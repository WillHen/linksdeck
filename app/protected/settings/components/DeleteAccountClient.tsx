'use client';

import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { Button } from '@/components/ui/button';

export default function DeleteAccountClient() {
  const [loading, setLoading] = useState(false);

  const handleDeleteAccount = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/start-cancellation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
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
          {
            duration: 6000,
            className: 'toast-error'
          }
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
    <div className='p-6 border rounded-lg shadow-md bg-red-50'>
      <h2 className='text-xl font-semibold text-red-600 mb-4'>
        Delete Account
      </h2>
      <p className='text-sm text-red-600 mb-4'>
        Warning: Deleting your account is permanent and cannot be undone.
      </p>
      <form onSubmit={handleDeleteAccount}>
        <Button type='submit' variant='destructive' disabled={loading}>
          {loading ? 'Sending...' : 'Delete Account'}
        </Button>
      </form>
    </div>
  );
}
