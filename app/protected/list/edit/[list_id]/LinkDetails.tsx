import { useEffect, useState } from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { Field, useFormikContext } from 'formik';
interface LinkProps {
  title: string;
  url: string;
  id: string;
  new_id: string | undefined;
  linkIndex: number;
  onChange: (
    id: string,
    new_id: string | undefined,
    index: number,
    value: { title: string; url: string }
  ) => void;
  onDeleteLink: (index: number) => void;
}

interface FormValues {
  links: {
    title: string;
    url: string;
  }[];
}

const urlPattern = new RegExp(
  '^(https?:\\/\\/)?' + // protocol
    '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
    '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR IP (v4) address
    '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
    '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
    '(\\#[-a-z\\d_]*)?$', // fragment locator
  'i'
);

export function LinkDetails({
  title,
  url,
  new_id,
  linkIndex,
  id,
  onChange,
  onDeleteLink
}: LinkProps) {
  const { values, errors, touched, setFieldValue, handleSubmit, isValid } =
    useFormikContext<FormValues>();
  const [isEditMode, setIsEditMode] = useState(!title && !url);
  const [editableTitle, setEditableTitle] = useState(title);
  const [editableUrl, setEditableUrl] = useState(url);
  useEffect(() => {
    setEditableTitle(title);
    setEditableUrl(url);
  }, [title, url]);

  return (
    <>
      <div
        data-testid={`link-${linkIndex}`}
        className='min-h-[72px] flex self-stretch justify-between items-center flex-row gap-4 py-2 px-4 bg-[#FFFFFF] h-[72px] mb-1.5'
      >
        <div className='flex justify-center items-start flex-col'>
          <div
            className='flex justify-start items-start flex-col w-[142px]'
            style={{ width: '142px' }}
          >
            {isEditMode ? (
              <Field
                type='text'
                name={`links[${linkIndex}].title`}
                placeholder='Link Title'
                className='self-stretch text-[#121417] font-medium leading-6 p-[15px] bg-[#FFFFFF] border-solid border-[#DBE0E5] border rounded-xl h-[32px] w-full'
                onChange={(e: { target: { value: string } }) =>
                  onChange(id, new_id, linkIndex, {
                    title: e.target.value,
                    url
                  })
                }
              />
            ) : (
              <p
                data-testid={`link-title-${linkIndex}`}
                className='self-stretch text-[#121417] font-medium leading-6'
              >
                {title}
              </p>
            )}
          </div>
          <div className='flex justify-start items-start flex-col'>
            {isEditMode ? (
              <div className='flex justify-start items-start flex-col'>
                <Field
                  type='text'
                  name={`links[${linkIndex}].url`}
                  placeholder='Link URL'
                  className='text-[#637587] mt-1.5 text-sm leading-[21px] p-[15px] bg-[#FFFFFF] border-solid border-[#DBE0E5] border rounded-xl h-[32px] w-full'
                  onChange={(e: { target: { value: string } }) =>
                    onChange(id, new_id, linkIndex, {
                      title,
                      url: e.target.value
                    })
                  }
                />
              </div>
            ) : (
              <span
                data-testid={`link-url-${linkIndex}`}
                className='text-[#637587] text-sm leading-[21px]'
              >
                {url}
              </span>
            )}
          </div>
        </div>
        <div className='flex justify-start items-start flex-row gap-2'>
          {isEditMode && (
            <div
              className='min-w-[84px] max-w-[480px] flex justify-center items-center flex-row px-4 bg-[#F0F2F5] rounded-xl h-[32px] cursor-pointer'
              onClick={() => {
                if (
                  !!id &&
                  (!editableTitle ||
                    !editableUrl ||
                    !urlPattern.test(editableUrl))
                ) {
                  return;
                }

                if (!id && !editableTitle && !editableUrl) {
                  onDeleteLink(linkIndex);
                  return;
                }
                setEditableTitle(title);
                setEditableUrl(url);
                setIsEditMode(false);
              }}
            >
              <div
                data-testid='cancel-button'
                className='flex justify-start items-center flex-col'
              >
                <span className='text-[#121417] text-sm text-center font-medium leading-[21px]'>
                  Cancel
                </span>
              </div>
            </div>
          )}
          <div
            className='min-w-[84px] max-w-[480px] flex justify-center items-center flex-row px-4 bg-[#F0F2F5] rounded-xl h-[32px] cursor-pointer'
            onClick={
              isEditMode
                ? () => {
                    if (
                      !editableTitle ||
                      !editableUrl ||
                      !urlPattern.test(editableUrl)
                    ) {
                      return;
                    } else {
                      onChange(id, new_id, linkIndex, {
                        title: editableTitle,
                        url: editableUrl
                      });
                      setIsEditMode(false);
                    }
                  }
                : () => setIsEditMode(true)
            }
          >
            <div
              data-testid={`${isEditMode ? 'confirm' : 'edit'}-button`}
              className='flex justify-start items-center flex-col'
            >
              <span className='text-[#121417] text-sm text-center font-medium leading-[21px]'>
                {isEditMode ? 'Confirm' : 'Edit'}
              </span>
            </div>
          </div>
          <div
            data-testid='link-delete'
            className='min-w-[32px] max-w-[32px] flex justify-center items-center flex-row px-4 bg-[#F0F2F5] rounded-xl h-[32px] cursor-pointer'
            onClick={() => onDeleteLink(linkIndex)}
          >
            <div className='flex justify-start items-center flex-col'>
              <FontAwesomeIcon icon={faTrash} className='text-[#121417]' />
            </div>
          </div>
        </div>
      </div>
      {(touched.links?.[linkIndex]?.title &&
        errors.links as FormikErrors<{ title: string; url: string }>[]) errors.links?.[linkIndex]?.title) ||
        (touched.links?.[linkIndex]?.url && errors.links?.[linkIndex]?.url && (
          <div className='gap-4 py-2 px-4 text-red-500 text-sm mt-2'>
            Title and a valid URL are required
          </div>
        ))}
    </>
  );
}
