import Link from 'next/link';
import React from 'react';
export function ListSegment({
  title,
  listId,
  index,
  linkCount
}: Readonly<{
  title: string;
  listId: string;
  index: number;
  linkCount: number;
}>) {
  return (
    <div className='min-h-[72px] flex self-stretch items-center flex-row gap-4 py-2 px-4 bg-[#FFFFFF] h-[72px]'>
      <div className='flex justify-center items-start flex-col'>
        <div className='flex justify-start items-start flex-col'>
          <span className='text-[#121417] font-medium leading-6'>{title}</span>
        </div>
        <div
          className='flex justify-start items-start flex-col w-[138px]'
          style={{ width: '138px' }}
        >
          <p className='self-stretch text-[#637587] text-sm leading-[21px]'>
            {linkCount} links
          </p>
        </div>
      </div>
      <div className='flex-1' />
      <Link data-testid={`view-list-${index}`} href={`list/view/${listId}`}>
        <div className='flex justify-start items-start flex-col'>
          <div
            className='min-w-[84px] max-w-[480px] flex justify-center items-center flex-row px-4 bg-[#F0F2F5] rounded-xl w-[84px] h-[32px]'
            style={{ width: '84px' }}
          >
            <div className='flex justify-start items-center flex-col'>
              <span className='text-[#121417] text-sm text-center font-medium leading-[21px]'>
                View
              </span>
            </div>
          </div>
        </div>
      </Link>
      <Link
        data-testid={`edit-list-${index}`}
        href={`protected/list/edit/${listId}`}
      >
        <div className='flex justify-start items-start flex-col'>
          <div
            className='min-w-[84px] max-w-[480px] flex justify-center items-center flex-row px-4 bg-[#F0F2F5] rounded-xl w-[84px] h-[32px]'
            style={{ width: '84px' }}
          >
            <div className='flex justify-start items-center flex-col'>
              <span className='text-[#121417] text-sm text-center font-medium leading-[21px]'>
                Edit
              </span>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}
