import { Field, FieldArray, Form, Formik, ErrorMessage } from 'formik';
import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

import * as Yup from 'yup';
import { LinkDetails } from './LinkDetails';
import isEqual from 'lodash.isequal';

interface Link {
  title: string;
  url: string;
  id?: string;
  description?: string | undefined;
  new_id?: string;
}

export type FormDetails = {
  title: string;
  description: string;
  links: Link[];
};

const validationSchema = Yup.object().shape({
  title: Yup.string().required('List title is required'),
  description: Yup.string(),
  links: Yup.array().of(
    Yup.object().shape({
      title: Yup.string().required('Link title is required'),
      url: Yup.string()
        /* eslint-disable no-useless-escape */
        .matches(
          /^(https?:\/\/)?((([a-z\d]([a-z\d-]*[a-z\d])*)\.)+[a-z]{2,}|((\d{1,3}\.){3}\d{1,3}))(\:\d+)?(\/[-a-z\d%_.~+]*)*(\?[;&a-z\d%_.~+=-]*)?(#[-a-z\d_]*)?$/i,
          'Invalid URL'
        )
        /* eslint-enable no-useless-escape */
        .required('Link URL is required')
    })
  )
});

export function ListForm({
  initialValues,
  handleSubmit
}: {
  initialValues: FormDetails;
  handleSubmit: (values: FormDetails, linksToDelete: string[]) => void;
}) {
  const [linksToDelete, setLinksToDelete] = useState<string[]>([]);
  return (
    <Formik
      validationSchema={validationSchema}
      initialValues={initialValues}
      va
      validateOnChange={false} // Disable validation on change
      validateOnBlur={false}
      validateOnMount={false}
      enableReinitialize
      onSubmit={(values) => {
        handleSubmit(values, linksToDelete);
      }}
    >
      {({ values, setFieldValue, errors }) => {
        return (
          <Form>
            <div className='flex flex-col w-full self-stretch min-w-[31.25rem]'>
              <div className='flex justify-start items-start flex-col gap-3'>
                <div className='flex flex-row items-center'>
                  <p className='self-stretch text-[#121417] leading-10 text-xl'>
                    List title
                  </p>
                </div>
              </div>
              <Field
                data-testid='list-title-input'
                type='text'
                name='title'
                placeholder='List Description'
                className='self-stretch text-[#121417] font-medium leading-6 bg-[#FFFFFF] border-solid border-[#DBE0E5] border rounded-xl h-10 w-full mb-2'
              />
              <ErrorMessage
                name='title'
                component='div'
                className='text-red-500 text-sm mt-1'
              />
              <div className='flex justify-start items-start flex-col gap-3'>
                <div className='flex flex-row items-center'>
                  <p className='self-stretch text-[#121417] leading-10 text-xl'>
                    List Description
                  </p>
                </div>
              </div>
              <Field
                type='text'
                data-testid='list-description-input'
                name='description'
                placeholder='List description'
                className='self-stretch text-[#121417] font-medium leading-6 bg-[#FFFFFF] border-solid border-[#DBE0E5] border rounded-xl w-full mb-2 h-10'
              />
            </div>
            <div className='flex flex-col'>
              <div className='flex justify-start items-start flex-col gap-3'>
                <div className='flex flex-row items-center'>
                  <p className='self-stretch text-[#121417] leading-10 text-xl'>
                    Links
                  </p>
                </div>
              </div>
              <FieldArray name='links' validateOnChange={false}>
                {({ push, remove }) => (
                  <div>
                    {values.links.map((link, index) => (
                      <LinkDetails
                        key={index}
                        linkIndex={index}
                        title={link.title}
                        url={link.url}
                        id={link.id}
                        new_id={link.new_id}
                        onChange={(index, value, id, new_id) => {
                          if (id) {
                            setFieldValue(`links[${index}]`, {
                              id,
                              ...value
                            });
                          } else if (new_id) {
                            setFieldValue(`links[${index}]`, {
                              new_id,
                              ...value
                            });
                          } else {
                            setFieldValue(`links[${index}]`, {
                              new_id: uuidv4(),
                              ...value
                            });
                          }
                        }}
                        onDeleteLink={(index) => {
                          remove(index);
                          if (link.id) {
                            const id = link.id as string;
                            setLinksToDelete((prev) => [...prev, id]);
                          }
                        }}
                      />
                    ))}
                    <button
                      type='button'
                      data-testid='add-link-button'
                      className='flex flex-1 w-full justify-center items-center flex-row px-4 h-9 rounded-xl bg-[#F0F2F5] mb-3 mt-2'
                      onClick={() => {
                        push({ title: '', url: '', new_id: uuidv4() });
                      }}
                    >
                      <span className='text-sm text-center font-bold'>
                        Add Link
                      </span>
                    </button>
                  </div>
                )}
              </FieldArray>
            </div>
            <button
              data-testid='update-list-button'
              type='submit'
              className='flex flex-1 w-full justify-center items-center flex-row px-4 bg-[#1A80E5] h-9 rounded-xl'
              disabled={
                isEqual(initialValues, values) || Object.keys(errors).length > 0
              }
            >
              <span className='text-[#FFFFFF] text-sm text-center font-bold'>
                Save changes
              </span>
            </button>
          </Form>
        );
      }}
    </Formik>
  );
}
