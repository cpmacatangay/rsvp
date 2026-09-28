'use server';

import { cookies, headers } from 'next/headers';
import { redirect } from 'next/navigation';

import { createRateLimiter } from '~/lib/rate-limit';
import {
  ADMIN_SESSION_COOKIE,
  SESSION_TTL_MS,
  compareAdminPassword,
  createSessionToken,
} from '~/lib/session';

/**
 * Login (PRD §6.1): rate-limited per IP (5/5min), honeypot, constant-time
 * password compare with an identical generic error either way; success sets
 * the HttpOnly SameSite=Lax signed cookie and redirects to /admin.
 */

export type LoginState = { ok: boolean; message?: string };

const loginLimiter = createRateLimiter(5, 5 * 60_000);

export async function loginAdmin(_prev: LoginState | null, formData: FormData): Promise<LoginState> {
  // honeypot: bots receive the same generic failure as a wrong password
  if (String(formData.get('website') ?? '').length > 0) {
    return { ok: false, message: 'That password did not match. Please try again.' };
  }

  const h = await headers();
  const ip = h.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'local';
  if (!loginLimiter.check(`admin:${ip}`)) {
    return { ok: false, message: 'Too many attempts. Please wait a few minutes and try again.' };
  }

  const password = process.env.ADMIN_PASSWORD;
  const secret = process.env.SESSION_SECRET;
  if (!password || !secret) {
    return { ok: false, message: 'Admin is not configured yet (missing env).' };
  }

  const supplied = String(formData.get('password') ?? '');
  if (!compareAdminPassword(supplied, password)) {
    return { ok: false, message: 'That password did not match. Please try again.' };
  }

  const store = await cookies();
  store.set(ADMIN_SESSION_COOKIE, createSessionToken(Date.now() + SESSION_TTL_MS, secret), {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/admin',
    maxAge: SESSION_TTL_MS / 1000,
  });

  redirect('/admin');
}
