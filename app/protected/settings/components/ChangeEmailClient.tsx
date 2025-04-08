'use client';

import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { Button } from '@/components/ui/button';

export default function ChangeEmailClient() {
  const [loading, setLoading] = useState(false);

  const handleEmailChange = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;

    try {
      const response = await fetch('/api/change-email', {
        method: 'POST',
        body: JSON.stringify({ email }),
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        toast.success(
          'Email updated successfully! Please check your inbox to confirm.',
          { duration: 6000, className: 'toast-success' }
        );
      } else {
        const error = await response.json();
        toast.error(error.message || 'Failed to update email.');
      }
    } catch (err) {
      console.error('Error changing email:', err);
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
      <form onSubmit={handleEmailChange} className='flex flex-col gap-4'>
        <input
          type='email'
          id='email'
          name='email'
          placeholder='Enter your email'
          className='p-2 border rounded-md w-full'
          required
        />
        <Button type='submit' variant='outline' disabled={loading}>
          {loading ? 'Changing...' : 'Change Email'}
        </Button>
      </form>
    </div>
  );
}
