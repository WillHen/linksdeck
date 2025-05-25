import React, { useState } from 'react';

interface ShareListProps {
  listId: string;
  onShare: (email: string, listId: string) => Promise<void>;
}

const ShareList: React.FC<ShareListProps> = ({ listId, onShare }) => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!email) {
      setError('Please enter an email address.');
      return;
    }

    try {
      await onShare(email, listId);
      setSuccess('List shared successfully!');
      setEmail(''); // Clear the input field
    } catch (err) {
      setError('Failed to share the list. Please try again.');
    }
  };

  return (
    <div className='mx-auto p-4 bg-white rounded-lg'>
      <h2 className='text-xl font-bold mb-4'>Share List</h2>
      <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
        <div>
          <label
            htmlFor='email'
            className='block text-sm font-medium text-gray-700'
          >
            Enter email to share the list:
          </label>
          <input
            type='email'
            id='email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className='mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm'
            placeholder='example@example.com'
          />
        </div>
        {error && <p className='text-red-500 text-sm'>{error}</p>}
        {success && <p className='text-green-500 text-sm'>{success}</p>}
        <button
          type='submit'
          className='w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
        >
          Share List
        </button>
      </form>
    </div>
  );
};

export default ShareList;
