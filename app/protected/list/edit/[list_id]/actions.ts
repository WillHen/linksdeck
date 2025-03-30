import { supabase } from '@/lib/supabaseClient';

interface Link {
  id?: string;
  title: string;
  description?: string;
  url: string;
}

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

export const handleDeleteList = async (listId: string) => {
  // Delete associated links
  const { error: linksError } = await supabase
    .from('links')
    .delete()
    .eq('list_id', listId);

  if (linksError) {
    throw new Error(linksError.message);
  }

  // Delete the list
  const { error: listError } = await supabase
    .from('lists')
    .delete()
    .eq('id', listId);

  if (listError) {
    throw new Error(listError.message);
  }
};


export const handleLinksChange = (
  index: number,
  value: { title: string; url: string },
  links: Link[],
) => {
  const newLinks = [...links];
  const updatedUrl =
    value.url.startsWith('http://') || value.url.startsWith('https://')
      ? value.url
      : `http://${value.url}`;
  newLinks[index] = {
    ...newLinks[index],
    title: value.title,
    url: updatedUrl
  };
  return newLinks;
};

export async function saveListAndLinks(
  list_id: string,
  title: string,
  description?: string,
  links: Link[],
  user_id: string
) {
  const { error: listError } = await supabase
    .from('lists')
    .update({ title, description })
    .eq('id', list_id);

  if (listError) {
    throw new Error(listError.message);
  }

  const newLinks = links.filter((link) => !link.id);
  const existingLinks = links.filter((link) => link.id);

  if (newLinks.length > 0) {
    const { error: insertError } = await supabase.from('links').insert(
      newLinks.map(({ title, description, url }) => ({
        title,
        description,
        url,
        list_id,
        user_id
      }))
    );

    if (insertError) {
      throw new Error(insertError.message);
    }
  }

  const { error: upsertError } = await supabase.from('links').upsert(
    existingLinks.map((link) => ({
      id: link.id,
      title: link.title,
      description: link.description,
      url: link.url,
      list_id: list_id, // Ensure you include the list_id
      user_id: user_id // Ensure you include the user_id
    })),
    { onConflict: 'id' } // Specify the unique constraint for conflict resolution
  );

  if (upsertError) {
    throw new Error(upsertError.message);
  }
}
