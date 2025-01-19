import { createClient } from '@/utils/supabase/server';
import { PlusIcon } from 'lucide-react';
import Link from 'next/link';
import { redirect } from 'next/navigation';

export default async function ProtectedPage() {
  const supabase = await createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  const { data: lists } = await supabase
    .from('lists')
    .select('*')
    .eq('user_id', user?.id);

  if (!user) {
    return redirect('/sign-in');
  }

  return (
    <div className='flex-1 w-full flex flex-col gap-12 flex-wrap items-center'>
      <Link
        href='/protected/list/new'
        className='flex items-center gap-2 text-blue-500 hover:underline'
        data-testid='create-list-link'
      >
        <PlusIcon className='w-5 h-5' />
        Create a New List
      </Link>

      <div className='flex flex-col gap-2 items-start'>
        <h2 className='font-bold text-2xl mb-4'>Your Lists</h2>
        {lists && lists.length > 0 ? (
          <div
            data-testid='list-container'
            className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'
          >
            {lists.map((list, index) => (
              <div
                key={list.id}
                className='p-4 border border-gray-300 rounded-md shadow-sm'
              >
                <Link
                  href={`/list/view/${list.id}`}
                  className='text-blue-500 hover:underline'
                >
                  {list.title}
                </Link>
                <p className='text-gray-700'>{list.description}</p>
                <Link
                  data-testid={`edit-list-${index}`}
                  href={`protected/list/edit/${list.id}`}
                  className='text-blue-500 hover:underline'
                >
                  Edit
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <p>No lists available.</p>
        )}
      </div>
    </div>
  );
}
