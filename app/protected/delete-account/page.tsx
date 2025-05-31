'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function DeleteAccountPage({
  searchParams
}: {
  searchParams: { token?: string };
}) {
  const router = useRouter();

  useEffect(() => {
    const deleteAccount = async () => {
      const { token } = searchParams;

      if (!token) {
        // Redirect to an error page if the token is missing
        router.push('/error?message=Missing cancellation token');
        return;
      }

      try {
        const response = await fetch('/api/confirm-deletion', {
          method: 'POST',
          body: JSON.stringify({ token }),
          headers: {
            'Content-Type': 'application/json'
          }
        });

        if (response.status > 200) {
          // Redirect to failure page
          router.push('/delete-confirmed?success=false');
        } else {
          // Redirect to success page
          router.push('/delete-confirmed?success=true');
        }
      } catch (err) {
        console.error('Error calling delete-user API:', err);
        // Redirect to failure page with error message
        router.push(
          '/delete-confirmed?success=false&error=An%20unexpected%20error%20occurred'
        );
      }
    };

    deleteAccount();
  }, [searchParams, router]);

  return <p>Processing your request...</p>;
}
