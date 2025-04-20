import { supabase } from '@/lib/supabaseClient';

import { getListsFromSupabase, getLinksFromSupabase } from '@/app/utils';

export async function fetchListAndLinks(list_id: string, user_id: string) {
  const { data: listData, error: listError } = await getListsFromSupabase(supabase, user_id)
    .eq('id', list_id)
    .single();

  if (listError) {
    throw new Error(listError.message);
  }

  const { data: linksData, error: linksError } = await getLinksFromSupabase(supabase, user_id)
    .eq('list_id', list_id);

  if (linksError) {
    throw new Error(linksError.message);
  }

  const EditableLinks = linksData.map((link) => ({
    id: link.id,
    title: link.title,
    description: link.description || '',
    url: link.url
  }));

  return { listData, linksData: EditableLinks };
}


