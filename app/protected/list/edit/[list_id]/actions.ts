import { supabase } from '@/lib/supabaseClient';

interface Link {
  id?: string;
  title: string;
  description: string;
  url: string;
}

export async function fetchListAndLinks(list_id: string) {
  const { data: listData, error: listError } = await supabase
    .from('lists')
    .select('*')
    .eq('id', list_id)
    .single();

  if (listError) {
    throw new Error(listError.message);
  }

  const { data: linksData, error: linksError } = await supabase
    .from('links')
    .select('*')
    .eq('list_id', list_id); 

  if (linksError) {
    throw new Error(linksError.message);
  }

  return { listData, linksData };
}

export async function saveListAndLinks(
  list_id: string,
  title: string,
  description: string,
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
