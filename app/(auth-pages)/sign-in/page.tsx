import { signInAction } from '@/app/actions';
import { createClient } from '@/utils/supabase/server';
import { FormMessage, Message } from '@/components/form-message';
import { SubmitButton } from '@/components/submit-button';
import Link from 'next/link';
import { redirect } from 'next/navigation';

type SearchParams = Message & { redirect_to?: string };

export default async function Login(props: {
  searchParams: Promise<SearchParams>;
}) {
  const supabase = await createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  const searchParams = await props.searchParams;
  const redirectTo = searchParams?.redirect_to || '/protected';

  if (user) {
    redirect(redirectTo);
  }

  return (
    <form className='w-full max-w-[400px] flex flex-col gap-[26px]'>
      <div className='flex flex-col gap-2'>
        <h1 className='text-[34px] sm:text-[38px] font-bold leading-[1.05] tracking-[-0.03em] text-[var(--ld-ink)]'>
          Sign in
        </h1>
        <p className='text-base text-[var(--ld-body)]'>
          Don&apos;t have an account?{' '}
          <Link
            className='font-semibold text-[var(--ld-ink)] border-b-2 border-[var(--ld-accent)]'
            href='/sign-up'
          >
            Sign up
          </Link>
        </p>
      </div>

      <div className='flex flex-col gap-[18px]'>
        <div className='flex flex-col gap-2'>
          <label htmlFor='email' className='ld-label'>
            Email
          </label>
          <input
            id='email'
            name='email'
            placeholder='you@example.com'
            className='ld-input ld-input-mono'
            required
          />
        </div>

        <div className='flex flex-col gap-2'>
          <div className='flex justify-between items-baseline'>
            <label htmlFor='password' className='ld-label'>
              Password
            </label>
            <Link
              className='text-[13px] text-[var(--ld-body)] border-b border-[var(--ld-dashed)]'
              href='/forgot-password'
            >
              Forgot Password?
            </Link>
          </div>
          <input
            id='password'
            type='password'
            name='password'
            placeholder='Your password'
            className='ld-input ld-input-mono'
            required
          />
        </div>

        <input type='hidden' name='redirect_to' value={redirectTo} />

        <SubmitButton
          data-testid='submit-button-sign-in'
          pendingText='Signing In...'
          formAction={signInAction}
          className='ld-btn ld-btn-primary h-[52px] px-5 py-0 text-[17px] mt-1.5 bg-[var(--ld-accent)] text-[var(--ld-accent-ink)] hover:bg-[var(--ld-accent)] hover:text-[var(--ld-accent-ink)]'
        >
          Sign in
        </SubmitButton>

        <FormMessage message={searchParams} />
      </div>
    </form>
  );
}
