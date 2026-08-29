import { signUpAction } from '@/app/actions';
import { FormMessage, Message } from '@/components/form-message';
import { SubmitButton } from '@/components/submit-button';
import { createClient } from '@/utils/supabase/server';
import Link from 'next/link';
import { redirect } from 'next/navigation';

export default async function Signup(props: {
  searchParams: Promise<Message>;
}) {
  const supabase = await createClient();
  // Get the current user session
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (user) {
    redirect('/protected');
  }
  const searchParams = await props.searchParams;
  if ('message' in searchParams) {
    return (
      <div className='w-full max-w-[400px] flex flex-col gap-4'>
        <FormMessage message={searchParams} />
      </div>
    );
  }

  return (
    <form className='w-full max-w-[400px] flex flex-col gap-[26px]'>
      <div className='flex flex-col gap-2'>
        <h1 className='text-[34px] sm:text-[38px] font-bold leading-[1.05] tracking-[-0.03em] text-[var(--ld-ink)]'>
          Sign up
        </h1>
        <p className='text-base text-[var(--ld-body)]'>
          Already have an account?{' '}
          <Link
            className='font-semibold text-[var(--ld-ink)] border-b-2 border-[var(--ld-accent)]'
            href='/sign-in'
          >
            Sign in
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
          <label htmlFor='password' className='ld-label'>
            Password
          </label>
          <input
            id='password'
            type='password'
            name='password'
            placeholder='Your password'
            minLength={6}
            className='ld-input ld-input-mono'
            required
          />
        </div>

        <SubmitButton
          formAction={signUpAction}
          pendingText='Signing up...'
          className='ld-btn ld-btn-primary h-[52px] px-5 py-0 text-[17px] mt-1.5 bg-[var(--ld-accent)] text-[var(--ld-accent-ink)] hover:bg-[var(--ld-accent)] hover:text-[var(--ld-accent-ink)]'
        >
          Sign up
        </SubmitButton>

        <FormMessage message={searchParams} />
      </div>
    </form>
  );
}
