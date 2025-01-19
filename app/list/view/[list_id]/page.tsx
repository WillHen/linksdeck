import { createClient } from '@/utils/supabase/server';

import { ShareButtons } from './ShareButtons';

async function fetchListAndLinks(list_id: string) {
  const supabase = await createClient();

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

interface Params {
  list_id: string;
}

export default async function ViewListPage({ params }: { params: Params }) {
  const { list_id } = await params;
  let title = '';
  let description = '';
  let error = '';
  let linksData = [];

  try {
    const { listData, linksData: links } = await fetchListAndLinks(list_id);
    title = listData.title;
    description = listData.description;
    linksData = links;
  } catch (err) {
    if (err instanceof Error) {
      error = err.message;
    } else {
      error = String(err);
    }
  }

  return (
    <div className='max-w-2xl mx-auto p-4'>
      <h2 data-testid='view-list-header' className='text-2xl font-bold mb-4'>
        View List
      </h2>
      {error && <p className='mt-4 text-red-600'>{error}</p>}
      <div className='mb-4'>
        <h3 className='text-xl font-semibold text-gray-800'>{title}</h3>
        <p className='mt-2 text-gray-600'>{description}</p>
      </div>
      <div className='mt-4'>
        <h4 className='text-lg font-semibold mb-2'>Links</h4>
        {linksData.length > 0 ? (
          <ul>
            {linksData.map((link) => (
              <li
                key={link.id}
                className='mb-4 p-4 border border-gray-300 rounded-md shadow-sm'
              >
                <a
                  href={link.url}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='text-blue-500 underline text-xl font-bold hover:text-blue-700'
                >
                  {link.title}
                </a>
                <p>{link.description}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p>No links available.</p>
        )}
      </div>
      <ShareButtons
        url={`${process.env.NODE_ENV === 'development' ? 'http://www.localhost:3000/' : 'https://www.linkhub.com/'}list/view/${list_id}`}
        title={title}
      />
    </div>
  );
}
