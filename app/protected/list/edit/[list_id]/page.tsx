'use client';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useParams } from 'next/navigation';
import { v4 as uuidv4 } from 'uuid';
import { Formik, Form, Field, FieldArray } from 'formik';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';

import { fetchListAndLinks, saveListAndLinks } from './actions';
import { LinkDetails } from './LinkDetails';
import * as Yup from 'yup';
import isEqual from 'lodash/isEqual';
import { SkeletonLoader } from './SkeleonLoader';

interface Link {
  title: string;
  url: string;
  id?: string;
  description?: string | undefined;
  new_id?: string;
}

type FormDetails = {
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

export default function EditListPage() {
  const router = useRouter();
  const { list_id } = useParams();
  const [loading, setLoading] = useState(true);
  const [, setError] = useState('');
  const [linksToDelete, setLinksToDelete] = useState<string[]>([]);
  const [user_id, setUser_id] = useState('');
  const [initialValues, setInitialValues] = useState({
    title: '',
    description: '',
    links: [] as Link[]
  });

  const handleDeleteList = async (listId: string) => {
    try {
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

      router.push('/protected');
    } catch (error: unknown) {
      const message = (error as Error).message;
      console.error('Error deleting list and links:', message);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { listData, linksData } = await fetchListAndLinks(
          list_id as string
        );
        setUser_id(listData.user_id);
        setInitialValues({
          title: listData.title,
          description: listData.description,
          links: linksData.map((link) => ({
            id: link.id,
            title: link.title,
            url: link.url
          }))
        });
        setLoading(false);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError(String(err));
        }
      }
    };

    fetchData();
  }, [list_id]);

  const handleSubmit = async (values: FormDetails) => {
    try {
      await saveListAndLinks(
        list_id as string,
        values.title,
        values.description,
        values.links,
        user_id
      );

      // Delete the marked links
      if (linksToDelete.length > 0) {
        const { error: deleteError } = await supabase
          .from('links')
          .delete()
          .in('id', linksToDelete);

        if (deleteError) {
          throw new Error(deleteError.message);
        }
      }
      router.push(`/list/view/${list_id}`);
    } catch (err) {
      alert('Error saving list and links: ' + err);
    }
  };

  if (loading) {
    return <SkeletonLoader />;
  }

  return (
    <Formik
      validationSchema={validationSchema}
      initialValues={initialValues}
      enableReinitialize
      onSubmit={(values, { setSubmitting }) => {
        handleSubmit(values);
      }}
    >
      {({ values, setFieldValue, errors }) => {
        return (
          <Form>
            <div>
              <div className='flex justify-start items-start flex-col gap-3'>
                <div
                  data-testid='edit-list-header'
                  className='flex flex-row items-center'
                >
                  <p className='self-stretch text-[#121417] font-bold leading-10 text-3xl'>
                    Edit list
                  </p>
                  <FontAwesomeIcon
                    data-testid='delete-list-button'
                    icon={faTrash}
                    className='text-[#121417] ml-2 cursor-pointer'
                    onClick={() => handleDeleteList(list_id as string)}
                  />
                </div>
              </div>
              <div className='flex flex-col'>
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
                <FieldArray name='links'>
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
                            console.log(value);
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
                        data-testid='add-link-button'
                        className='flex flex-1 w-full justify-center items-center flex-row px-4 h-9 rounded-xl bg-[#F0F2F5] mb-3 mt-2'
                        onClick={() =>
                          push({ title: '', url: '', new_id: uuidv4() })
                        }
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
                  isEqual(initialValues, values) ||
                  Object.keys(errors).length > 0
                }
              >
                <span className='text-[#FFFFFF] text-sm text-center font-bold'>
                  Save changes
                </span>
              </button>
            </div>
          </Form>
        );
      }}
    </Formik>
  );
}
