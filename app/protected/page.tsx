import { createClient } from '@/utils/supabase/server';
import { getListsFromSupabase } from '@/app/utils';
import Link from 'next/link';
import { redirect } from 'next/navigation';

import { ListCard } from './list/List';

export default async function ProtectedPage() {
  const supabase = await createClient();

  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect('/sign-in');
  }

  const { data: lists } = await getListsFromSupabase(supabase, user.id);

  const listCount = lists?.length ?? 0;
  const linkTotal =
    lists?.reduce((sum, l) => sum + ((l.link_count as number) ?? 0), 0) ?? 0;

  return (
    <div className='flex flex-col gap-9'>
      {/* Header */}
      <div className='flex flex-col sm:flex-row justify-between sm:items-end gap-6 pb-7 border-b-2 border-[var(--ld-ink)]'>
        <div className='flex flex-col gap-2.5'>
          <h1
            data-testid='your-lists-header'
            className='text-[36px] sm:text-[46px] font-bold leading-[1.02] tracking-[-0.03em] text-[var(--ld-ink)]'
          >
            Your Lists
          </h1>
          <p className='ld-mono text-[15px] sm:text-base text-[var(--ld-muted)]'>
            {listCount} {listCount === 1 ? 'list' : 'lists'} &middot; {linkTotal}{' '}
            {linkTotal === 1 ? 'link' : 'links'} saved
          </p>
        </div>
        <Link
          href='/protected/list/new'
          data-testid='create-list-link'
          className='ld-btn ld-btn-primary h-[52px] px-6 text-[17px] self-start sm:self-auto'
        >
          Create new list
        </Link>
      </div>

      {/* Grid of lists */}
      {listCount > 0 ? (
        <div
          data-testid='list-container'
          className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6'
        >
          {lists!.map((list, index) => (
            <ListCard
              key={list.id}
              index={index}
              listId={list.id}
              title={list.title as string}
              description={list.description as string | null}
              linkCount={list.link_count as number}
            />
          ))}
          <Link
            href='/protected/list/new'
            className='flex flex-col items-center justify-center gap-3 min-h-[290px] p-6 rounded-[18px] border-2 border-dashed border-[var(--ld-dashed)] bg-white/50 hover:bg-white transition-colors'
          >
            <span className='w-10 h-10 rounded-xl border-2 border-[var(--ld-ink)] bg-[var(--ld-accent-soft)] flex items-center justify-center text-[22px] font-semibold'>
              +
            </span>
            <span className='text-[17px] font-semibold'>Create new list</span>
            <span className='ld-mono text-[13px] text-[var(--ld-muted)]'>
              up to 10 links each
            </span>
          </Link>
        </div>
      ) : (
        /* Empty / first-run state */
        <div className='ld-card flex flex-col items-start gap-4 p-8 sm:p-10 max-w-[620px]'>
          <span className='ld-chip'>no lists yet</span>
          <h2 className='text-[28px] sm:text-[32px] font-bold tracking-[-0.02em]'>
            Start your first deck
          </h2>
          <p className='text-[17px] leading-[1.5] text-[var(--ld-body)]'>
            Organize your links into lists that you can share and explore. Start
            by creating your first list.
          </p>
          <Link
            href='/protected/list/new'
            data-testid='create-list-link-empty'
            className='ld-btn ld-btn-primary h-[52px] px-6 text-[17px] mt-1'
          >
            Create new list
          </Link>
        </div>
      )}
    </div>
  );
}
