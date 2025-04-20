'use client';

import { Suspense, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

function DeleteConfirmedContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const success = searchParams.get('success') === 'true';
  const error = searchParams.get('error');

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

export default function DeleteConfirmedPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <DeleteConfirmedContent />
    </Suspense>
  );
}
