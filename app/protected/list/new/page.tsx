'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';
import { supabase } from '@/lib/supabaseClient';

import { createListAndLinksAction } from './actions';

import { ListForm, SaveAction } from '@/app/protected/list/components';

import type { FormDetails } from '@/app/protected/list/components/ListForm';

export default function AddListPage() {
  const router = useRouter();
  const [, setError] = useState('');
  const hasUser = useRef(false);

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

  const handleSubmit = (values: FormDetails) => {
    const createRouterPromise = (listId: string) => {
      return new Promise<void>((resolve) => {
        router.push(`/list/view/${listId}`);
        resolve();
      });
    };
    return new Promise<void>((resolve, reject) => {
      createListAndLinksAction(values.title, values.description, values.links)
        .then((listId) => {
          createRouterPromise(listId).then(() => {
            resolve();
          });
        })
        .catch((error) => {
          setError((error as Error).message);
          reject();
        });
    });
  };

  return (
    <div className='lg:w-1/2 flex flex-col'>
      <ListForm
        handleSubmit={handleSubmit}
        initialValues={{ title: '', description: '', links: [] }}
        title={'Create List'}
        saveAction={SaveAction.Create}
      />
    </div>
  );
}
