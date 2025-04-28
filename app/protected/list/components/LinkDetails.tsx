import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { Field, ErrorMessage, useFormikContext } from 'formik';
import { useState } from 'react';

type LinkChangeFunc = (
  index: number,
  value: { title: string; url: string; id?: string; new_id?: string },
  id?: string,
  new_id?: string
) => void;

interface LinkProps {
  title: string;
  url: string;
  linkIndex: number;
  onChange: LinkChangeFunc;
  onDeleteLink: (index: number) => void;
  id?: string;
  new_id?: string;
}

export function LinkDetails({
  title,
  url,
  new_id,
  linkIndex,
  id,
  onChange,
  onDeleteLink
}: LinkProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = () => {
    setIsDeleting(true); // Trigger the animation
    setTimeout(() => {
      onDeleteLink(linkIndex);
      setIsDeleting(false); // Remove the link after the animation
    }, 300); // Match the duration of the animation
  };

  const { setFieldValue, setFieldTouched } = useFormikContext();

  return (
    <div
      data-testid={`link-${linkIndex}`}
      className={`flex flex-col gap-4 p-4 bg-gray-50 border border-gray-300 rounded-lg shadow-sm transition-opacity duration-300 ${
        isDeleting ? 'opacity-0' : 'opacity-100'
      }`}
    >
      <div>
        <label
          htmlFor={`links[${linkIndex}].title`}
          className='block text-sm font-medium text-gray-700 mb-1'
        >
          Link Title
        </label>
        <Field
          type='text'
          name={`links[${linkIndex}].title`}
          data-testid={`link-title-${linkIndex}`}
          placeholder='Enter link title'
          className='w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
          onChange={(e: { target: { value: string } }) => {
            onChange(
              linkIndex,
              {
                title: e.target.value,
                url
              },
              id,
              new_id
            );
          }}
        />
        <ErrorMessage
          name={`links[${linkIndex}].title`}
          data-testid={`link-title-${linkIndex}-error`}
          component='div'
          className='text-red-500 text-sm mt-1'
        />
      </div>

      {/* Link URL */}
      <div>
        <label
          htmlFor={`links[${linkIndex}].url`}
          className='block text-sm font-medium text-gray-700 mb-1'
        >
          Link URL
        </label>
        <Field
          type='text'
          name={`links[${linkIndex}].url`}
          data-testid={`link-url-${linkIndex}`}
          placeholder='Enter link URL'
          className='w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
          onBlur={(e: React.FocusEvent<HTMLInputElement>) => {
            const value = e.target.value;
            if (value && !/^(https?:\/\/)/i.test(value)) {
              // Add http:// if missing
              setFieldValue(`links[${linkIndex}].url`, `http://${value}`);
            }
            setFieldTouched(`links[${linkIndex}].url`, true);
          }}
          onChange={(e: { target: { value: string } }) => {
            onChange(
              linkIndex,
              {
                title,
                url: e.target.value,
                id,
                new_id
              },
              id,
              new_id
            );
          }}
        />
        <ErrorMessage
          name={`links[${linkIndex}].url`}
          data-testid={`link-url-${linkIndex}-error`}
          component='div'
          className='text-red-500 text-sm mt-1'
        />
      </div>

      {/* Delete Button */}
      <button
        data-testid={`delete-link-${linkIndex}-button`}
        type='button'
        onClick={handleDelete}
        className='flex items-center justify-center gap-2 px-4 py-2 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition focus:outline-none focus:ring-2 focus:ring-red-500'
      >
        <FontAwesomeIcon icon={faTrash} className='text-white' />
        <span>Delete Link</span>
      </button>
    </div>
  );
}
