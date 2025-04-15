'use client';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useParams } from 'next/navigation';

import { fetchListAndLinks, saveListAndLinks } from './actions';
import { ListForm, SaveAction } from '@/app/protected/list/components';

import type { FormDetails } from '@/app/protected/list/components/ListForm';

interface Link {
  title: string;
  url: string;
  id?: string;
  description?: string | undefined;
  new_id?: string;
}

export default function EditListPage() {
  const router = useRouter();
  const { list_id } = useParams();
  const [isLoading, setisLoading] = useState(true);
  const [, setError] = useState('');
  const [user_id, setUser_id] = useState('');
  const [initialValues, setInitialValues] = useState({
    title: '',
    description: '',
    links: [] as Link[]
  });

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

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Get user from API
        const userResponse = await fetch('/api/user');
        if (!userResponse.ok) {
          throw new Error('Failed to fetch user');
        }
        const { user } = await userResponse.json();

        const { listData, linksData } = await fetchListAndLinks(
          list_id as string,
          user.id
        );
        setUser_id(user.id);
        setInitialValues({
          title: listData.title,
          description: listData.description ?? '',
          links: linksData.map((link) => ({
            id: link.id,
            title: link.title,
            url: link.url
          }))
        });
        setisLoading(false);
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

  const handleSubmit = async (values: FormDetails, linksToDelete: string[]) => {
    let linkToDeletePromise = new Promise((resolve) => {
      resolve(true);
    });

    if (linksToDelete.length > 0) {
      linkToDeletePromise = new Promise((resolve, reject) => {
        supabase
          .from('links')
          .delete()
          .in('id', linksToDelete)
          .then(({ error }) => {
            if (error) {
              reject(error);
            } else {
              resolve(true);
            }
          });
      });
    }
    saveListAndLinks(
      list_id as string,
      values.title,
      values.description,
      values.links,
      user_id
    )
      .then(() => {
        linkToDeletePromise.then(() => {
          router.push(`/list/view/${list_id}`);
        });
      })
      .catch((error) => {
        setError((error as Error).message);
      });
  };

  return (
    <div className='w-full flex flex-col'>
      <ListForm
        initialValues={initialValues}
        handleSubmit={handleSubmit}
        saveAction={SaveAction.Update}
        title={'Update List'}
        isLoading={isLoading}
        deleteList={() => handleDeleteList(list_id as string)}
      />
    </div>
  );
}
