'use client';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useParams } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';

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
        const {
          data: { user }
        } = await supabase.auth.getUser();
        const { listData, linksData } = await fetchListAndLinks(
          list_id as string,
          user?.id as string
        );
        setUser_id(user?.id as string);
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
    <div className='flex flex-col gap-5'>
      <div className='flex justify-start items-start flex-col gap-3'>
        <div
          data-testid='edit-list-header'
          className='flex flex-row items-center'
        >
          <p className='self-stretch text-[#121417] font-bold leading-10 text-3xl'>
            Edit list
          </p>
          <FontAwesomeIcon
            data-testid='delete-list-button'
            icon={faTrash}
            className='text-[#121417] ml-2 cursor-pointer'
            onClick={() => handleDeleteList(list_id as string)}
          />
        </div>
      </div>
      <ListForm
        initialValues={initialValues}
        handleSubmit={handleSubmit}
        saveAction={SaveAction.Update}
        isLoading={isLoading}
      />
    </div>
  );
}
