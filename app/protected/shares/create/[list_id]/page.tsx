'use client';

import React, { useState } from 'react';
import { useParams } from 'next/navigation';

import ShareList from './components/ShareList'; // Adjust the import path as necessary

const ShareListPage: React.FC = () => {
  const { list_id } = useParams(); // Extract list_id from the URL
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleShare = async (email: string, listId: string) => {
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch('/api/share', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          to_email: email, // Assuming email maps to `to_user_id`
          list_id: listId
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to share the list');
      }

      const data = await response.json();
      setSuccess('List shared successfully!');
      console.log('Share request created:', data);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || 'An unexpected error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  if (!list_id) {
    return (
      <p className='text-center text-red-500'>List ID is missing in the URL.</p>
    );
  }

  return (
    <div className='flex items-center justify-center bg-gray-100'>
      <div className='max-w-md w-full'>
        <h1 className='text-2xl font-bold text-center mb-6'>Share Your List</h1>
        <ShareList listId={list_id} onShare={handleShare} />
        {loading && (
          <p className='text-blue-500 text-center mt-4'>Sharing...</p>
        )}
        {error && <p className='text-red-500 text-center mt-4'>{error}</p>}
        {success && (
          <p className='text-green-500 text-center mt-4'>{success}</p>
        )}
      </div>
    </div>
  );
};

export default ShareListPage;
