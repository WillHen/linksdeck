'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const AcceptSharePage: React.FC = () => {
  const { share_id } = useParams(); // Extract share_id from the URL params
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    const acceptShareRequest = async (share_id: string) => {
      try {
        const response = await fetch('/api/share/requests/accept', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ share_id })
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(
            result.error || 'Failed to accept the share request.'
          );
        }

        console.log('Share request accepted successfully:', result);
        return result;
      } catch (err) {
        console.error('Error:', err);
        throw err;
      }
    };

    acceptShareRequest(share_id);
  }, [share_id]);

  if (loading) {
    return (
      <p className='text-center text-blue-500'>Processing your request...</p>
    );
  }

  if (error) {
    return <p className='text-center text-red-500'>{error}</p>;
  }

  if (success) {
    return <p className='text-center text-green-500'>{success}</p>;
  }

  return null;
};

export default AcceptSharePage;
