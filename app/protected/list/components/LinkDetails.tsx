import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { Field, ErrorMessage, useFormikContext } from 'formik';
interface LinkProps {
  title: string;
  url: string;
  linkIndex: number;
  onChange: (
    index: number,
    value: { title: string; url: string; id?: string; new_id?: string },
    id?: string,
    new_id?: string
  ) => void;
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
  const { setFieldValue } = useFormikContext();
  return (
    <div data-testid={`link-${linkIndex}`} className='flex min-w-full'>
      <div className='min-w-full'>
        <Field
          type='text'
          name={`links[${linkIndex}].title`}
          data-testid={`link-title-${linkIndex}`}
          placeholder='Link Title'
          className='self-stretch text-[#121417] font-medium leading-6 p-[15px] bg-[#FFFFFF] border-solid border-[#DBE0E5] border rounded-xl h-[40px] w-full mb-2'
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
          component='div'
          className='text-red-500 text-sm mt-1'
        />
        <Field
          type='text'
          name={`links[${linkIndex}].url`}
          data-testid={`link-url-${linkIndex}`}
          placeholder='Link URL'
          className='self-stretch text-[#121417] font-medium leading-6 p-[15px] bg-[#FFFFFF] border-solid border-[#DBE0E5] border rounded-xl h-[40px] w-full mb-2'
          onBlur={(e: React.FocusEvent<HTMLInputElement>) => {
            const value = e.target.value;
            if (value && !/^(https?:\/\/)/i.test(value)) {
              // Add http:// if missing
              setFieldValue(`links[${linkIndex}].url`, `http://${value}`);
            }
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
          component='div'
          className='text-red-500 text-sm'
        />
        <button
          data-testid='delete-link-button'
          type='button'
          onClick={() => onDeleteLink(linkIndex)}
          className='flex flex-1 w-full justify-center items-center flex-row px-4 bg-[#C70000] h-9 rounded-xl mt-1 mb-1'
        >
          <span className='text-[#FFFFFF] text-sm text-center font-bold'>
            <FontAwesomeIcon
              data-testid={`delete-link-${linkIndex}-button`}
              icon={faTrash}
              className='text-[#121417] text-2xl cursor-pointer'
              onClick={() => onDeleteLink(linkIndex)}
            />
          </span>
        </button>
      </div>
    </div>
  );
}
