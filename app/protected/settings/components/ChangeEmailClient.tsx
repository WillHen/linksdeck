'use client';

import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { Button } from '@/components/ui/button';

import { emailRegex } from '@/app/constants';

export default function ChangeEmailClient() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleEmailChange = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    // Reset states
    setLoading(true);
    setError(null);
    setSuccess(null);

    // Validate email format
    if (!emailRegex.test(email)) {
      setError('Invalid email address');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/change-email', {
        method: 'POST',
        body: JSON.stringify({ email }),
        headers: {
          'Content-Type': 'application/json'
        }
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
    <div className='p-6 border rounded-lg shadow-md bg-white'>
      <h2 className='text-xl font-semibold mb-4'>Change Email</h2>
      <form
        onSubmit={handleEmailChange}
        className='flex flex-col gap-4'
        data-testid='change-email-form'
      >
        <input
          id='email'
          name='email'
          placeholder='Enter your new email'
          className='p-2 border rounded-md w-full'
          required
          data-testid='new-email-input'
        />
        <div className='min-h-[24px]' data-testid='message-container'>
          {error && (
            <div
              className='text-red-500 mt-2'
              data-testid='email-error'
              role='alert'
              aria-live='assertive'
            >
              {error}
            </div>
          )}
          {success && (
            <div
              className='text-green-500 mt-2'
              data-testid='email-success'
              role='status'
              aria-live='polite'
            >
              {success}
            </div>
          )}
        </div>
        <Button
          type='submit'
          variant='outline'
          disabled={loading}
          data-testid='change-email-submit'
        >
          {loading ? 'Changing...' : 'Change Email'}
        </Button>
      </form>
    </div>
  );
}
