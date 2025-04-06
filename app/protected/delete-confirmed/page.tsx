'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface DeleteAccountClientProps {
  success?: boolean;
  error?: string;
}

export default function DeleteAccountClient({
  success,
  error
}: DeleteAccountClientProps) {
  const router = useRouter();

  useEffect(() => {
    if (success) {
      router.push('/sign-in');
    } else if (error) {
      router.push(`/error?message=${encodeURIComponent(error)}`);
    }
  }, [success, error, router]);

  return (
    <div>
      <h1>{success ? 'Deleting Account...' : 'Error Occurred'}</h1>
    </div>
  );
}
