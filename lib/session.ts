import 'server-only';

import { createHash, createHmac, timingSafeEqual } from 'node:crypto';
import { cookies } from 'next/headers';

/**
 * Admin session (PRD §6.1): one shared password, single signed cookie,
 * HttpOnly + SameSite=Lax + 24h. The password itself is never stored in the
 * cookie; the token is an expiry + HMAC signature over that expiry, and the
 * comparison is constant-time (timingSafeEqual) in both branches.
 */

export const ADMIN_SESSION_COOKIE = 'admin_session';
export const SESSION_TTL_MS = 24 * 60 * 60_000;

export type TokenIssuer = { secret: string; now?: () => number };

function sign(payload: string, secret: string): string {
  return createHmac('sha256', secret).update(payload).digest('base64url');
}

export function createSessionToken(expiresAtMs: number, secret: string): string {
  const payload = String(expiresAtMs);
  return `${payload}.${sign(payload, secret)}`;
}

/** constant-time verification; malformed or expired ⇒ false, never a throw */
export function verifySessionToken(token: string | undefined, secret: string, now: () => number = Date.now): boolean {
  if (!token || !secret) return false;
  const dot = token.indexOf('.');
  if (dot < 1) return false;
  const payload = token.slice(0, dot);
  const signature = token.slice(dot + 1);
  if (!/^\d{13}$/.test(payload)) return false;
  if (Number(payload) <= now()) return false;

  const expected = sign(payload, secret);
  const a = Buffer.from(signature);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

/**
 * compareAdminPassword — constant-time across every input shape.
 * `timingSafeEqual` throws when byte lengths differ, and UTF-8 makes
 * visually-similar strings differ in byte length (Peña variants). Fix:
 * hash both values to fixed-length digests first, then compare digests:
 * no length leak, no zero-length edge, multibyte-safe.
 */
export function compareAdminPassword(supplied: string, expected: string): boolean {
  if (supplied.length === 0 || expected.length === 0) return false;
  const a = createHash('sha256').update(supplied, 'utf8').digest();
  const b = createHash('sha256').update(expected, 'utf8').digest();
  return timingSafeEqual(a, b);
}

/** requireAdmin — server helper for pages + route handlers */
export async function isAdminSession(): Promise<boolean> {
  const store = await cookies();
  const secret = process.env.SESSION_SECRET;
  if (!secret) return false;
  return verifySessionToken(store.get(ADMIN_SESSION_COOKIE)?.value, secret);
}
