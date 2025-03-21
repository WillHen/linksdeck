import { createClient } from '@/utils/supabase/server';

import Link from 'next/link';

import type { Database } from '@/app/types/Supabase';

import { getListsFromSupabase, getLinksFromSupabase } from '@/app/utils';

async function fetchListAndLinks(list_id: string) {
  const supabase = await createClient();

  const { data: listData, error: listError } = await getListsFromSupabase(
    supabase
  )
    .eq('id', list_id)
    .single();
  if (listError) {
    throw new Error(listError.message);
  }

  const { data: linksData, error: linksError } = await getLinksFromSupabase(
    supabase
  ).eq('list_id', list_id);

  if (linksError) {
    throw new Error(linksError.message);
  }

  return { listData, linksData };
}

interface Params {
  list_id: string;
}

export default async function ViewListPage({ params }: { params: Params }) {
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
    <div className='max-w-[960px] flex flex-1 justify-start items-start flex-col h-[695px]'>
      <div className='flex flex-wrap self-stretch justify-between items-start flex-row gap-3 p-4'>
        <div className='min-w-[288px] flex justify-start items-start flex-col gap-3'>
          <div
            className='flex justify-start items-start flex-col w-[288px]'
            style={{ width: '288px' }}
          >
            <p
              data-testid='list-header'
              className='self-stretch text-[#121417] text-[32px] font-bold leading-10'
            >
              {title}
            </p>
          </div>
          <div
            className='flex justify-start items-start flex-col w-[288px]'
            style={{ width: '288px' }}
          >
            <p className='self-stretch text-[#61788A] text-sm leading-[21px]'>
              {description}
            </p>
          </div>
        </div>
      </div>
      {linksData.map((link, index) => {
        return (
          <Link key={index} href={link.url} target='_blank'>
            <div
              key={index}
              className='min-h-[72px] flex self-stretch justify-start items-center flex-row gap-4 py-2 px-4 bg-[#FFFFFF] h-[72px]'
            >
              <div className='flex justify-center items-start flex-col'>
                <div
                  className='flex justify-start items-start flex-col w-[147px]'
                  style={{ width: '147px' }}
                >
                  <p className='self-stretch text-[#121417] font-medium leading-6'>
                    {link.title}
                  </p>
                </div>
                <div className='flex justify-start items-start flex-col'>
                  <p className='self-stretch text-[#61788A] text-sm leading-[21px]'>
                    {link.url}
                  </p>
                </div>
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
