import { resetPasswordAction } from '@/app/actions';
import { FormMessage, Message } from '@/components/form-message';
import { SubmitButton } from '@/components/submit-button';

export default async function ResetPassword(props: {
  searchParams: Promise<Message>;
}) {
  const searchParams = await props.searchParams;
  return (
    <form className='w-full max-w-[400px] mx-auto flex flex-col gap-[26px]'>
      <div className='flex flex-col gap-2'>
        <h1 className='text-[34px] sm:text-[38px] font-bold leading-[1.05] tracking-[-0.03em] text-[var(--ld-ink)]'>
          Reset password
        </h1>
        <p className='text-base text-[var(--ld-body)]'>
          Please enter your new password below.
        </p>
      </div>

      <div className='flex flex-col gap-[18px]'>
        <div className='flex flex-col gap-2'>
          <label htmlFor='password' className='ld-label'>
            New password
          </label>
          <input
            id='password'
            type='password'
            name='password'
            placeholder='New password'
            className='ld-input ld-input-mono'
            required
          />
        </div>

        <div className='flex flex-col gap-2'>
          <label htmlFor='confirmPassword' className='ld-label'>
            Confirm password
          </label>
          <input
            id='confirmPassword'
            type='password'
            name='confirmPassword'
            placeholder='Confirm password'
            className='ld-input ld-input-mono'
            required
          />
        </div>

        <SubmitButton
          formAction={resetPasswordAction}
          className='ld-btn ld-btn-primary h-[52px] px-5 py-0 text-[17px] mt-1.5 bg-[var(--ld-accent)] text-[var(--ld-accent-ink)] hover:bg-[var(--ld-accent)] hover:text-[var(--ld-accent-ink)]'
        >
          Reset password
        </SubmitButton>

        <FormMessage message={searchParams} />
      </div>
    </form>
  );
}
