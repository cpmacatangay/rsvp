'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import { ADMIN_SESSION_COOKIE } from '~/lib/session';

/** Sign out (US8 companion): clears the admin cookie, always back to login. */
export async function signOutAdmin() {
  const store = await cookies();
  store.delete(ADMIN_SESSION_COOKIE);
  redirect('/admin/login');
}
