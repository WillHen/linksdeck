import { createClient } from '@/utils/supabase/server';
import Link from 'next/link';
import type { Database } from '@/app/types/Supabase';
import {
  getListsFromSupabaseAnon,
  getLinksFromSupabaseAnon
} from '@/app/utils';

function truncateText(text: string, maxLength: number): string {
  return text.length > maxLength ? `${text.slice(0, maxLength)}...` : text;
}

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
    if (err instanceof Error) {
      console.error('Error fetching list and links:', { cause: err });
    }
  }

  return (
    <div className='w-full max-w-[640px] mx-auto flex flex-col gap-9 py-6 sm:py-10'>
      <div className='flex flex-col items-start gap-3.5'>
        <span className='ld-mono text-[13px] uppercase tracking-[0.06em] text-[var(--ld-muted)]'>
          a linksdeck list
        </span>
        <h1
          data-testid='view-list-header'
          className='text-[40px] sm:text-[56px] font-bold leading-[1] tracking-[-0.035em] text-[var(--ld-ink)]'
        >
          {title}
        </h1>
        {description ? (
          <p className='text-[18px] sm:text-[19px] leading-[1.45] text-[var(--ld-body)]'>
            {description}
          </p>
        ) : null}
      </div>

      <div className='flex flex-col gap-3.5'>
        {linksData.map((link, index) => (
          <Link key={link.id ?? index} href={link.url} target='_blank'>
            <div className='flex items-center gap-4 sm:gap-[18px] px-5 sm:px-6 py-[22px] bg-white border-2 border-[var(--ld-ink)] rounded-2xl shadow-[5px_5px_0_var(--ld-ink)] hover:shadow-[7px_7px_0_var(--ld-accent)] transition-shadow'>
              <span className='ld-mono text-sm font-medium text-[var(--ld-faint)]'>
                {String(index + 1).padStart(2, '0')}
              </span>
              <div className='flex flex-col gap-1.5 flex-1 min-w-0'>
                <span className='text-[19px] sm:text-[21px] font-semibold leading-[1.2] text-[var(--ld-ink)]'>
                  {link.title}
                </span>
                <span className='ld-mono text-sm leading-[1.3] text-[var(--ld-muted)] break-all'>
                  {truncateText(link.url, 50)}
                </span>
              </div>
              <span
                aria-hidden
                className='shrink-0 w-9 h-9 rounded-[10px] border-2 border-[var(--ld-ink)] bg-[var(--ld-accent-soft)] flex items-center justify-center text-base font-semibold'
              >
                &#8599;
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
