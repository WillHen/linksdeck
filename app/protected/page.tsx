import { createClient } from '@/utils/supabase/server';
import Image from 'next/image';
import { getListsFromSupabase } from '@/app/utils';

import Link from 'next/link';

import { ListSegment } from './list/List';
import { redirect } from 'next/navigation';

export default async function ProtectedPage() {
  const supabase = await createClient();

  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect('/sign-in');
  }

  const { data: lists } = await getListsFromSupabase(supabase, user.id);

  return (
    <div className='flex-1 w-full flex flex-col gap-4 flex-wrap py-4 sm:py-6 sm:px-6 md:py-8 md:px-12 max-w-[320px] sm:max-w-[700px] lg:max-w-[1000px] xl:max-w-[1200px] mx-auto'>
      <div className='relative w-full flex min-h-[400px] md:min-h-[500px] flex-col gap-4 bg-cover bg-center bg-no-repeat sm:gap-6 md:gap-8 rounded-lg items-center justify-center p-4'>
        <Image
          src='/assets/linksdeckbackground3.png'
          alt='Background'
          fill
          priority
          quality={75}
          sizes='100vw'
          style={{ objectFit: 'cover', objectPosition: 'center' }}
          className='z-[-1]' // Ensures the image is behind the content
        />
        <div className='flex flex-col gap-2 text-center'>
          <h1 className='text-white text-2xl font-bold leading-tight tracking-[-0.02em] sm:text-3xl md:text-4xl'>
            Welcome to LinksDeck
          </h1>
          <h2 className='text-white text-sm font-normal leading-snug sm:text-base md:text-lg'>
            Organize your links into lists that you can share and explore. Start
            by creating your first list.
          </h2>
        </div>
        <Link
          href='/protected/list/new'
          className='flex items-center gap-2 text-blue-500 hover:underline'
          data-testid='create-list-link'
        >
          <button className='flex w-full max-w-[240px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 sm:h-12 sm:px-5 bg-[#1565c0] text-white text-sm font-bold leading-normal tracking-[0.01em] sm:text-base'>
            <span className='truncate'>Create new list</span>
          </button>
        </Link>
      </div>
      <div className='flex flex-col gap-2 items-start'>
        <h2
          data-testid='your-lists-header'
          className='font-bold text-lg mb-4 sm:text-xl'
        >
          Your Lists
        </h2>
        {lists && lists.length > 0 ? (
          <div className='w-full' data-testid='list-container'>
            {lists.map((list, index) => (
              <ListSegment
                key={list.id}
                index={index}
                listId={list.id}
                title={list.title as string}
                linkCount={list.link_count as number}
              />
            ))}
          </div>
        ) : (
          <p className='text-sm text-gray-600'>No lists available.</p>
        )}
      </div>
    </div>
  );
}
