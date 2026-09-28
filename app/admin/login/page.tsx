import type { Metadata } from 'next';
import { redirect } from 'next/navigation';

import { LoginForm } from '~/components/admin/LoginForm';
import { isAdminSession } from '~/lib/session';

export const metadata: Metadata = {
  title: 'Couple sign-in',
  robots: { index: false, follow: false },
};

/** already signed in? straight to the dashboard (US8) */
export default async function LoginPage() {
  if (await isAdminSession()) redirect('/admin');
  return (
    <main className="flex min-h-[100dvh] items-center justify-center px-5 py-16">
      <LoginForm />
    </main>
  );
}
