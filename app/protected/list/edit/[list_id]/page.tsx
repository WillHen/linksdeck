'use client';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

import { ListForm, SaveAction } from '@/app/protected/list/components';

import type { FormDetails } from '@/app/protected/list/components/ListForm';

import { EditableLink, Link } from '@/app/types';

export default function EditListPage() {
  const router = useRouter();
  const { list_id } = useParams();
  const [isLoading, setisLoading] = useState(true);
  const [initialValues, setInitialValues] = useState({
    title: '',
    description: '',
    links: [] as EditableLink[]
  });

  const handleDeleteList = async (listId: string) => {
    try {
      const response = await fetch(`/api/lists/${listId}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        throw new Error('Failed to delete list');
      }

      router.push('/protected');
    } catch (error: unknown) {
      if (error instanceof Error) {
        const deleteError = new Error('Error deleting list:', { cause: error });
        console.error(deleteError);
      }
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Get user from API to ensure authentication
        const userResponse = await fetch('/api/user');
        if (!userResponse.ok) {
          throw new Error('Failed to fetch user');
        }

        // Fetch list data
        const listResponse = await fetch(`/api/lists/${list_id}`);

        if (!listResponse.ok) {
          throw new Error(
            `Failed to fetch list, status: ${listResponse.status}`
          );
        }
        const { list: listData } = await listResponse.json();

        // Fetch links data
        const linksResponse = await fetch(`/api/links?list_id=${list_id}`);
        if (!linksResponse.ok) {
          throw new Error(
            `Failed to fetch links, status: ${linksResponse.status}`
          );
        }
        const { links: linksData } = await linksResponse.json();

        setisLoading(false);

        setInitialValues({
          title: listData.title,
          description: listData.description ?? '',
          links: linksData.map((link: Link) => ({
            id: link.id,
            title: link.title,
            url: link.url
          }))
        });
      } catch (err) {
        if (err instanceof Error) {
          const fetchError = new Error('Error fetching data:', { cause: err });
          console.error(fetchError);
        }
      }
    };

    fetchData();
  }, [list_id]);

  const handleSubmit = async (values: FormDetails, linksToDelete: string[]) => {
    try {
      // First, delete any links that need to be removed
      if (linksToDelete.length > 0) {
        const deleteResponse = await fetch(
          `/api/links?ids=${linksToDelete.join(',')}`,
          {
            method: 'DELETE'
          }
        );
        if (!deleteResponse.ok) {
          throw new Error('Failed to delete links');
        }
      }
      // Then update the list and create/update links in a single request
      const response = await fetch(`/api/lists/${list_id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title: values.title,
          description: values.description,
          links: values.links.map((link) => ({
            title: link.title,
            url: link.url,
            ...(link.id && { id: link.id })
          }))
        })
      });

      if (!response.ok) {
        throw new Error('Failed to update list');
      }

      router.push(`/list/view/${list_id}`);
    } catch (error) {
      if (error instanceof Error) {
        const submitError = new Error('Error submitting form:', {
          cause: error
        });
        console.error(submitError);
      }
    }
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
