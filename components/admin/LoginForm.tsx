'use client';

import { useActionState } from 'react';

import { Button } from '~/components/ui/Button';
import { DoubleBezel } from '~/components/ui/Card';
import { Field, controlClass } from '~/components/ui/Field';
import { loginAdmin, type LoginState } from '~/app/admin/login/action';

/** Login form — progressive <form> (same pattern as the guest panel). */
export function LoginForm() {
  const [state, formAction, pending] = useActionState(loginAdmin, null);

  return (
    <DoubleBezel className="max-w-md">
      <form action={formAction} className="flex flex-col gap-4">
        <h1 className="font-display text-h2 text-ink">Couple sign-in</h1>
        <p className="font-body text-body text-ink-soft">The password from your invite config.</p>
        <div className="absolute -left-[9999px] h-0 w-0" aria-hidden="true">
          <label>
            Leave empty
            <input type="text" name="website" tabIndex={-1} autoComplete="off" />
          </label>
        </div>
        <Field
          id="password"
          label="Password"
          control={
            <input
              id="password"
              name="password"
              type="password"
              required
              autoComplete="current-password"
              className={controlClass(null)}
            />
          }
        />
        {state && !state.ok ? (
          <p className="font-body text-caption text-danger" role="alert">
            {state.message}
          </p>
        ) : null}
        <Button type="submit" disabled={pending}>
          {pending ? 'Checking…' : 'Enter'}
        </Button>
      </form>
    </DoubleBezel>
  );
}
