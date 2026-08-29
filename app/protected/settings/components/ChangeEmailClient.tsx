'use client';

import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { emailRegex } from '@/app/constants';

export default function ChangeEmailClient() {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleEmailChange = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    setLoading(true);
    setError(null);
    setSuccess(null);

    if (!emailRegex.test(email)) {
      setError('Invalid email address');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/change-email', {
        method: 'POST',
        body: JSON.stringify({ email }),
        headers: { 'Content-Type': 'application/json' }
      });

      if (response.ok) {
        setSuccess('Email updated successfully');
        toast.success(
          'Email updated successfully! Please check your inbox to confirm.',
          { duration: 6000, className: 'toast-success' }
        );
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to update email');
        toast.error(errorData.error || 'Failed to update email.');
      }
    } catch (err) {
      console.error('Error changing email:', err);
      setError('An unexpected error occurred');
      toast.error('An unexpected error occurred.', {
        duration: 6000,
        className: 'toast-error'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='px-[26px] py-6 border-b-2 border-[var(--ld-line)]'>
      <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-4'>
        <div className='flex flex-col gap-1'>
          <span className='text-[18px] font-semibold leading-[1.2]'>Email</span>
          <span className='ld-mono text-sm text-[var(--ld-muted)]'>
            The address you sign in with.
          </span>
        </div>
        <button
          type='button'
          className='ld-btn'
          onClick={() => setOpen((v) => !v)}
        >
          Change Email
        </button>
      </div>

      {open && (
        <form
          onSubmit={handleEmailChange}
          className='flex flex-col gap-3 mt-5'
          data-testid='change-email-form'
        >
          <label htmlFor='email' className='ld-label'>
            New email
          </label>
          <input
            id='email'
            name='email'
            placeholder='Enter your new email'
            className='ld-input ld-input-mono'
            required
            data-testid='new-email-input'
          />
          <div className='min-h-[24px]' data-testid='message-container'>
            {error && (
              <div
                className='text-sm text-[var(--ld-danger-ink)]'
                data-testid='email-error'
                role='alert'
                aria-live='assertive'
              >
                {error}
              </div>
            )}
            {success && (
              <div
                className='text-sm text-[var(--ld-accent)]'
                data-testid='email-success'
                role='status'
                aria-live='polite'
              >
                {success}
              </div>
            )}
          </div>
          <button
            type='submit'
            disabled={loading}
            data-testid='change-email-submit'
            className='ld-btn ld-btn-primary self-start disabled:opacity-60'
          >
            {loading ? 'Changing...' : 'Save new email'}
          </button>
        </form>
      )}
    </div>
  );
}
