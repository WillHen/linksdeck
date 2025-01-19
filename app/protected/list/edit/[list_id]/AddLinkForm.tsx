interface Link {
  title: string;
  description: string;
  url: string;
}

interface AddLinkFormProps {
  links: Link[];
  handleAddLink: () => void;
  handleChange: (index: number, field: keyof Link, value: string) => void;
  handleDeleteLink?: (index: number) => void;
}

export function AddLinkForm({
  links,
  handleAddLink,
  handleChange,
  handleDeleteLink
}: AddLinkFormProps) {
  const handleUrlBlur = (index: number, value: string) => {
    if (!value.startsWith('http://') && !value.startsWith('https://')) {
      value = `https://${value}`;
    }
    handleChange(index, 'url', value);
  };
  return (
    <>
      <p className='mb-2'>Links</p>
      {links.map((link, index) => (
        <div data-testid={`link-set-${index}`} key={index} className='mb-4'>
          <button
            type='button'
            onClick={() => handleDeleteLink && handleDeleteLink(index)}
            className='ml-2 text-red-500 hover:text-red-700'
          >
            &times;
          </button>
          <label
            htmlFor='title'
            className='block text-sm font-medium text-gray-700'
          >
            Title
          </label>
          <input
            data-testid='link-title-input'
            type='text'
            placeholder='Title'
            value={link.title}
            onChange={(e) => handleChange(index, 'title', e.target.value)}
            className='block w-full mb-2 p-2 border border-gray-300 rounded'
          />
          <label
            htmlFor='description'
            className='block text-sm font-medium text-gray-700'
          >
            Description
          </label>
          <input
            type='text'
            placeholder='Description'
            value={link.description}
            onChange={(e) => handleChange(index, 'description', e.target.value)}
            className='block w-full mb-2 p-2 border border-gray-300 rounded'
          />
          <label
            htmlFor='url'
            className='block text-sm font-medium text-gray-700'
          >
            Url
          </label>
          <input
            data-testid='link-url-input'
            type='url'
            placeholder='URL'
            value={link.url}
            onChange={(e) => handleChange(index, 'url', e.target.value)}
            onBlur={(e) => handleUrlBlur(index, e.target.value)}
            className='block w-full mb-2 p-2 border border-gray-300 rounded'
          />
        </div>
      ))}
      <button
        type='button'
        onClick={handleAddLink}
        className='flex items-center justify-center w-full p-2 mb-4 text-white bg-blue-500 rounded'
      >
        <span className='mr-2'>Add Link</span>
        <svg
          xmlns='http://www.w3.org/2000/svg'
          className='w-5 h-5'
          viewBox='0 0 20 20'
          fill='currentColor'
        >
          <path
            fillRule='evenodd'
            d='M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z'
            clipRule='evenodd'
          />
        </svg>
      </button>
    </>
  );
}
