import { forgotPasswordAction } from '@/app/actions';
import { FormMessage, Message } from '@/components/form-message';
import { SubmitButton } from '@/components/submit-button';
import Link from 'next/link';

export default async function ForgotPassword(props: {
  searchParams: Promise<Message>;
}) {
  const searchParams = await props.searchParams;
  return (
    <form className='w-full max-w-[400px] flex flex-col gap-[26px]'>
      <div className='flex flex-col gap-2'>
        <h1 className='text-[34px] sm:text-[38px] font-bold leading-[1.05] tracking-[-0.03em] text-[var(--ld-ink)]'>
          Reset Password
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

        <SubmitButton
          formAction={forgotPasswordAction}
          className='ld-btn ld-btn-primary h-[52px] px-5 py-0 text-[17px] mt-1.5 bg-[var(--ld-accent)] text-[var(--ld-accent-ink)] hover:bg-[var(--ld-accent)] hover:text-[var(--ld-accent-ink)]'
        >
          Reset Password
        </SubmitButton>

        <FormMessage message={searchParams} />
      </div>
    </form>
  );
}
