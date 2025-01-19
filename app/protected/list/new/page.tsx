'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';
import { supabase } from '@/lib/supabaseClient';

import { createListAndLinksAction } from './actions';

import { AddLinkForm } from '../edit/[list_id]/AddLinkForm';

interface Link {
  title: string;
  description: string;
  url: string;
}

export default function AddListPage() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const [links, setLinks] = useState([{ title: '', description: '', url: '' }]);
  const hasUser = useRef(false);

  const handleAddLink = () => {
    setLinks([...links, { title: '', description: '', url: '' }]);
  };

  const handleLinkChange = (
    index: number,
    field: keyof Link,
    value: string
  ) => {
    const newLinks = links.map((link, i) =>
      i === index ? { ...link, [field]: value } : link
    );
    setLinks(newLinks);
  };

  useEffect(() => {
    const checkUser = async () => {
      const {
        data: { user }
      } = await supabase.auth.getUser();

      if (!user) {
        router.push('/sign-in');
      }
    };
    if (!hasUser.current) {
      checkUser();
      hasUser.current = true;
    }
  }, []);

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    setError('');

    try {
      const listId = await createListAndLinksAction(title, description, links);
      router.push(`/list/view/${listId}`);
    } catch (error) {
      setError(String(error));
    }
  };

  return (
    <div className='max-w-2xl mx-auto p-4'>
      <h2 data-testid='create-list-header' className='text-2xl font-bold mb-4'>
        Create a New List
      </h2>
      <form onSubmit={handleSubmit}>
        <div className='mb-4'>
          <label
            htmlFor='title'
            className='block text-sm font-medium text-gray-700'
          >
            Title
          </label>
          <input
            data-testid='list-title-input'
            type='text'
            id='title'
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className='mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
          />
        </div>
        <div className='mb-4'>
          <label
            htmlFor='description'
            className='block text-sm font-medium text-gray-700'
          >
            Description
          </label>
          <textarea
            data-testid='list-description-input'
            id='description'
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className='mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
          />
        </div>
        <AddLinkForm
          links={links}
          handleAddLink={handleAddLink}
          handleChange={handleLinkChange}
        />
        <button
          data-testid='create-list-button'
          type='submit'
          className='inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
        >
          Create List
        </button>
      </form>
      {error && <p className='mt-4 text-red-600'>{error}</p>}
    </div>
  );
}
