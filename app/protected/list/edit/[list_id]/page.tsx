'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useParams } from 'next/navigation';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';

import { AddLinkForm } from './AddLinkForm';
import { fetchListAndLinks, saveListAndLinks } from './actions';

interface Link {
  title: string;
  description: string;
  url: string;
  id?: string;
  user_id?: string;
}

export default function EditListPage() {
  const router = useRouter();
  const { list_id } = useParams();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [linksToDelete, setLinksToDelete] = useState<string[]>([]);
  const [user_id, setUser_id] = useState('');
  const [links, setLinks] = useState<Link[]>([
    { title: '', description: '', url: '' }
  ]);

  const handleAddLink = () => {
    setLinks([...links, { title: '', description: '', url: '' }]);
  };

  const handleDeleteList = async (listId: string) => {
    try {
      // Delete associated links
      const { error: linksError } = await supabase
        .from('links')
        .delete()
        .eq('list_id', listId);

      if (linksError) {
        throw new Error(linksError.message);
      }

      // Delete the list
      const { error: listError } = await supabase
        .from('lists')
        .delete()
        .eq('id', listId);

      if (listError) {
        throw new Error(listError.message);
      }

      router.push('/protected');
    } catch (error: unknown) {
      const message = (error as Error).message;
      console.error('Error deleting list and links:', message);
    }
  };

  const handleDeleteLink = (index: number) => {
    const linkToDelete = links[index];
    if (linkToDelete.id) {
      setLinksToDelete((prevLinksToDelete) => [
        ...prevLinksToDelete,
        linkToDelete?.id as string
      ]);
    }
    setLinks((prevLinks) => prevLinks.filter((_, i) => i !== index));
  };

  const handleChange = (index: number, field: keyof Link, value: string) => {
    const newLinks = [...links];
    newLinks[index][field] = value;
    setLinks(newLinks);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { listData, linksData } = await fetchListAndLinks(list_id);
        setUser_id(listData.user_id);
        setTitle(listData.title);
        setDescription(listData.description);
        setLinks(linksData);
        setLoading(false);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError(String(err));
        }
      }
    };

    fetchData();
  }, [list_id]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      await saveListAndLinks(
        list_id as string,
        title,
        description,
        links,
        user_id
      );

      // Delete the marked links
      if (linksToDelete.length > 0) {
        const { error: deleteError } = await supabase
          .from('links')
          .delete()
          .in('id', linksToDelete);

        if (deleteError) {
          throw new Error(deleteError.message);
        }
      }
      router.push(`/list/view/${list_id}`);
    } catch (err) {
      alert('Error saving list and links: ' + err);
    }
  };

  return (
    <div className='max-w-2xl mx-auto p-4'>
      <h2 className='text-2xl font-bold mb-4'>Edit List</h2>{' '}
      <button
        data-testid='delete-list-button'
        onClick={() => handleDeleteList(list_id as string)}
        className='text-red-500 hover:text-red-700'
      >
        <FontAwesomeIcon icon={faTrash} />
      </button>
      {loading ? (
        <div className='space-y-4'>
          <div className='h-6 bg-gray-200 rounded animate-pulse w-full min-w-[200px]'></div>
          <div className='h-6 bg-gray-200 rounded animate-pulse w-full min-w-[200px]'></div>
          <div className='h-6 bg-gray-200 rounded animate-pulse w-full min-w-[200px]'></div>
          <div className='h-32 bg-gray-200 rounded animate-pulse w-full min-w-[200px]'></div>
          <div className='h-10 bg-gray-200 rounded animate-pulse w-full min-w-[200px]'></div>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className='mb-4'>
            <label
              htmlFor='title'
              className='block text-sm font-medium text-gray-700'
            >
              Title
            </label>
            <input
              type='text'
              id='title'
              data-testid='list-title-input'
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
              id='description'
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className='mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
            />
          </div>
          <AddLinkForm
            links={links}
            handleAddLink={handleAddLink}
            handleChange={handleChange}
            handleDeleteLink={handleDeleteLink}
          />
          <button
            type='submit'
            className='inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
          >
            Update List
          </button>
        </form>
      )}
      {error && <p className='mt-4 text-red-600'>{error}</p>}
    </div>
  );
}
