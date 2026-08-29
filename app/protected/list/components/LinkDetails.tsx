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
  const { setFieldValue, setFieldTouched } = useFormikContext();

  const handleDelete = () => {
    setIsDeleting(true);
    setTimeout(() => {
      onDeleteLink(linkIndex);
      setIsDeleting(false);
    }, 300);
  };

  return (
    <div
      data-testid={`link-${linkIndex}`}
      className={`flex gap-4 sm:gap-[18px] items-start p-5 bg-white border-2 border-[var(--ld-ink)] rounded-2xl shadow-[4px_4px_0_var(--ld-ink)] transition-opacity duration-300 ${
        isDeleting ? 'opacity-0' : 'opacity-100'
      }`}
    >
      <span className='ld-mono text-sm font-medium text-[var(--ld-faint)] pt-[14px]'>
        {String(linkIndex + 1).padStart(2, '0')}
      </span>

      <div className='flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3.5'>
        <div className='flex flex-col gap-1.5'>
          <label
            htmlFor={`links[${linkIndex}].title`}
            className='text-[13px] font-semibold text-[var(--ld-body)]'
          >
            Link Title
          </label>
          <Field
            type='text'
            name={`links[${linkIndex}].title`}
            data-testid={`link-title-${linkIndex}`}
            placeholder='Enter link title'
            className='ld-input h-[46px] rounded-[10px] text-[15px] font-medium'
            onChange={(e: { target: { value: string } }) => {
              onChange(linkIndex, { title: e.target.value, url }, id, new_id);
            }}
          />
          <ErrorMessage
            name={`links[${linkIndex}].title`}
            data-testid={`link-title-${linkIndex}-error`}
            component='div'
            className='text-[13px] text-[var(--ld-danger-ink)]'
          />
        </div>

        <div className='flex flex-col gap-1.5'>
          <label
            htmlFor={`links[${linkIndex}].url`}
            className='text-[13px] font-semibold text-[var(--ld-body)]'
          >
            Link URL
          </label>
          <Field
            type='text'
            name={`links[${linkIndex}].url`}
            data-testid={`link-url-${linkIndex}`}
            placeholder='Enter link URL'
            className='ld-input ld-input-mono h-[46px] rounded-[10px] text-sm'
            onBlur={(e: React.FocusEvent<HTMLInputElement>) => {
              const value = e.target.value;
              if (value && !/^(https?:\/\/)/i.test(value)) {
                setFieldValue(`links[${linkIndex}].url`, `http://${value}`);
              }
              setFieldTouched(`links[${linkIndex}].url`, true);
            }}
            onChange={(e: { target: { value: string } }) => {
              onChange(
                linkIndex,
                { title, url: e.target.value, id, new_id },
                id,
                new_id
              );
            }}
          />
          <ErrorMessage
            name={`links[${linkIndex}].url`}
            data-testid={`link-url-${linkIndex}-error`}
            component='div'
            className='text-[13px] text-[var(--ld-danger-ink)]'
          />
        </div>
      </div>

      <button
        data-testid={`delete-link-${linkIndex}-button`}
        type='button'
        onClick={handleDelete}
        aria-label='Delete link'
        className='shrink-0 mt-5 w-[38px] h-[38px] flex items-center justify-center rounded-[10px] border-2 border-[var(--ld-danger-line)] bg-[var(--ld-danger-soft)] text-[var(--ld-danger-ink)] font-semibold hover:shadow-[3px_3px_0_var(--ld-danger-line)] transition-shadow'
      >
        &#215;
      </button>
    </div>
  );
}
