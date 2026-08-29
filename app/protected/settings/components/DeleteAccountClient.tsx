'use client';

import { useState } from 'react';
import { toast } from 'react-hot-toast';

export default function DeleteAccountClient() {
  const [loading, setLoading] = useState(false);

  const handleDeleteAccount = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/start-cancellation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });

      if (response.ok) {
        toast.success(
          'A link to delete your account has been sent to your email. Please check your inbox.',
          { duration: 6000, className: 'toast-success' }
        );
      } else {
        const error = await response.json();
        toast.error(
          error.message || 'Failed to send the delete account link.',
          { duration: 6000, className: 'toast-error' }
        );
      }
    } catch (err) {
      console.error('Error sending delete account link:', err);
      toast.error('An unexpected error occurred.', {
        duration: 6000,
        className: 'toast-error'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='flex flex-col items-start gap-3.5 p-[26px] rounded-[18px] bg-[var(--ld-danger-soft)] border-2 border-[var(--ld-danger-line)] shadow-[6px_6px_0_var(--ld-danger-line)]'>
      <span className='text-[18px] font-semibold leading-[1.2] text-[var(--ld-danger-ink)]'>
        Delete Account
      </span>
      <p className='max-w-[520px] text-[15px] leading-[1.45] text-[var(--ld-danger-ink)]'>
        Warning: Deleting your account is permanent and cannot be undone.
      </p>
      <form onSubmit={handleDeleteAccount}>
        <button
          type='submit'
          disabled={loading}
          className='ld-btn border-[var(--ld-danger-ink)] bg-[var(--ld-danger)] text-white disabled:opacity-60'
        >
          {loading ? 'Sending...' : 'Delete Account'}
        </button>
      </form>
    </div>
  );
}
