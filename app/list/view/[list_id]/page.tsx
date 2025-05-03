import { createClient } from '@/utils/supabase/server';

import Link from 'next/link';

import type { Database } from '@/app/types/Supabase';

import {
  getListsFromSupabaseAnon,
  getLinksFromSupabaseAnon
} from '@/app/utils';

async function fetchListAndLinks(list_id: string) {
  const supabase = await createClient();
  const { data: listData, error: listError } = await getListsFromSupabaseAnon(
    supabase
  )
    .eq('id', list_id)
    .single();
  if (listError) {
    throw new Error(listError.message);
  }

  const { data: linksData, error: linksError } = await getLinksFromSupabaseAnon(
    supabase
  ).eq('list_id', list_id);

  if (linksError) {
    throw new Error(linksError.message);
  }

  return { listData, linksData };
}

export default async function ViewListPage({
  params
}: {
  params: Promise<{ list_id: string }>;
}) {
  const { list_id } = await params;
  let title = '';
  let description = '';
  let linksData: Database['public']['Tables']['links']['Row'][] = [];

  try {
    const { listData, linksData: links } = await fetchListAndLinks(list_id);
    title = listData.title ?? '';
    description = listData.description ?? '';
    linksData = links;
  } catch (err) {
    console.error('Error fetching list and links:', err);
  }

  return (
    <div className='flex flex-col items-center min-h-screen px-4 py-8'>
      <div className='max-w-[960px] w-full flex flex-col items-center gap-6'>
        <div className='flex flex-col items-center gap-4'>
          <div className='w-full text-center'>
            <p
              data-testid='view-list-header'
              className='text-[#121417] text-[32px] font-bold leading-10'
            >
              {title}
            </p>
          </div>
          <div className='w-full text-center'>
            <p className='text-[#61788A] text-sm leading-[21px]'>
              {description}
            </p>
          </div>
        </div>
        <div className='w-full min-w-[370px] flex flex-col gap-4 mx-auto'>
          {linksData.map((link, index) => (
            <Link key={index} href={link.url} target='_blank'>
              <div className='min-h-[72px] flex justify-between items-center gap-4 py-2 px-4 bg-[#FFFFFF] shadow-md rounded-lg'>
                <div className='flex flex-col'>
                  <p className='text-[#121417] font-medium text-lg leading-7'>
                    {link.title}
                  </p>
                  <p className='text-[#61788A] text-base leading-6'>
                    {link.url}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
