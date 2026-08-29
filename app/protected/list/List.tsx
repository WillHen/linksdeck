import Link from 'next/link';
import React from 'react';

/**
 * Replaces the old 72px-tall list row layout with a scannable card.
 * data-testid values are unchanged so the Playwright specs keep passing.
 */
export function ListCard({
  title,
  description,
  listId,
  index,
  linkCount
}: Readonly<{
  title: string;
  description?: string | null;
  listId: string;
  index: number;
  linkCount: number;
}>) {
  return (
    <div className='ld-card flex flex-col gap-[18px] p-6 min-h-[290px]'>
      <div className='flex justify-between items-start gap-3'>
        <span className='text-[24px] font-semibold leading-[1.15] tracking-[-0.01em] text-[var(--ld-ink)]'>
          {title}
        </span>
        <span className='ld-chip'>
          {linkCount} {linkCount === 1 ? 'link' : 'links'}
        </span>
      </div>

      {description ? (
        <p className='text-[15px] leading-[1.45] text-[var(--ld-body)]'>
          {description}
        </p>
      ) : null}

      <div className='flex-1' />

      <div className='flex gap-2.5 pt-1.5 border-t-2 border-[var(--ld-line)]'>
        <Link
          data-testid={`view-list-${index}`}
          href={`list/view/${listId}`}
          className='ld-btn ld-btn-ink flex-1 h-10'
        >
          View
        </Link>
        <Link
          data-testid={`edit-list-${index}`}
          href={`protected/list/edit/${listId}`}
          className='ld-btn flex-1 h-10'
        >
          Edit
        </Link>
      </div>
    </div>
  );
}
