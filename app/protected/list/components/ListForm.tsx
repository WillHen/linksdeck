import { Field, FieldArray, Form, Formik, ErrorMessage } from 'formik';
import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import * as Yup from 'yup';
import isEqual from 'lodash.isequal';

import { LinkDetails } from './LinkDetails';
import { SkeletonLoader } from './SkeletonLoader';

interface Link {
  title: string;
  url: string;
  id?: string;
  description?: string | undefined;
  new_id?: string;
}

export enum SaveAction {
  Create = 'create',
  Update = 'update'
}

export type FormDetails = {
  title: string;
  description: string;
  links: Link[];
};

const validationSchema = Yup.object().shape({
  title: Yup.string().required('List title is required'),
  description: Yup.string(),
  links: Yup.array()
    .of(
      Yup.object().shape({
        title: Yup.string().required('Link title is required'),
        url: Yup.string()
          .matches(
            /^(https?:\/\/)?((([a-z\d]([a-z\d-]*[a-z\d])*)\.)+[a-z]{2,}|((\d{1,3}\.){3}\d{1,3}))(:\d+)?(\/[-a-z\d%_.~+]*)*(\?[;&a-z\d%_.~+=-]*)?(#[-a-z\d_]*)?$/i,
            'Invalid URL'
          )
          .required('Link URL is required')
      })
    )
    .test(
      'max-links',
      'You cannot add more than 10 links.',
      (links) => !links || links.length <= 10
    )
});

export function ListForm({
  initialValues,
  handleSubmit,
  saveAction,
  title,
  isLoading,
  deleteList
}: {
  initialValues: FormDetails;
  handleSubmit: (values: FormDetails, linksToDelete: string[]) => Promise<void>;
  saveAction: SaveAction;
  title: string;
  isLoading?: boolean;
  deleteList?: () => Promise<void>;
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [linksToDelete, setLinksToDelete] = useState<string[]>([]);

  if (isSubmitting || isLoading) {
    return <SkeletonLoader />;
  }

  return (
    <div className='w-full max-w-[760px] mx-auto flex flex-col gap-7'>
      {/* Header */}
      <div className='flex justify-between items-center gap-6'>
        <h1
          className='text-[34px] sm:text-[42px] font-bold leading-[1.02] tracking-[-0.03em] text-[var(--ld-ink)]'
          data-testid={
            (saveAction === SaveAction.Create ? 'new-' : 'edit-') + 'list-header'
          }
        >
          {title}
        </h1>
        {deleteList && (
          <button
            type='button'
            onClick={deleteList}
            className='ld-btn ld-btn-danger h-10 text-sm'
            data-testid='delete-list-button'
          >
            Delete List
          </button>
        )}
      </div>

      <Formik
        validationSchema={validationSchema}
        initialValues={initialValues}
        validateOnChange={false}
        validateOnBlur={true}
        validateOnMount={false}
        enableReinitialize
        onSubmit={async (values) => {
          setIsSubmitting(true);
          try {
            await handleSubmit(values, linksToDelete);
          } catch (error: unknown) {
            if (error instanceof Error) {
              console.error('Error saving list:', { cause: error });
            }
          }
        }}
      >
        {({ values, setFieldValue }) => (
          <Form className='flex flex-col gap-7'>
            {/* List meta card */}
            <div className='ld-card flex flex-col gap-[22px] p-7'>
              <div className='flex flex-col gap-2'>
                <label htmlFor='title' className='ld-label'>
                  List Title
                </label>
                <Field
                  id='title'
                  name='title'
                  type='text'
                  placeholder='Enter list title'
                  data-testid='list-title-input'
                  className='ld-input font-semibold'
                />
                <ErrorMessage
                  name='title'
                  component='div'
                  className='text-[13px] text-[var(--ld-danger-ink)]'
                />
              </div>

              <div className='flex flex-col gap-2'>
                <label htmlFor='description' className='ld-label'>
                  List Description
                </label>
                <Field
                  id='description'
                  name='description'
                  type='text'
                  placeholder='Enter list description'
                  data-testid='list-description-input'
                  className='ld-input'
                />
              </div>
            </div>

            {/* Links */}
            <div className='flex flex-col gap-4'>
              <div className='flex justify-between items-baseline'>
                <h2 className='text-[22px] font-semibold text-[var(--ld-ink)]'>
                  Links
                </h2>
                <span className='ld-mono text-[13px] text-[var(--ld-muted)]'>
                  {values.links.length} of 10
                </span>
              </div>

              <FieldArray name='links' validateOnChange={false}>
                {({ push, remove }) => (
                  <div className='flex flex-col gap-4'>
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
                            setFieldValue(`links[${index}]`, { id, ...value });
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
                      className='h-[52px] flex items-center justify-center gap-2.5 rounded-xl border-2 border-dashed border-[var(--ld-dashed)] bg-white/60 text-base font-semibold text-[var(--ld-ink)] hover:bg-white disabled:opacity-50 transition-colors'
                      onClick={() => push({ title: '', url: '', new_id: uuidv4() })}
                      disabled={values.links.length >= 10}
                    >
                      <span aria-hidden='true'>+</span>
                      <span>Add Link</span>
                    </button>

                    {values.links.length >= 10 && (
                      <p
                        data-testid='link-limit-error'
                        className='ld-mono text-[13px] text-[var(--ld-danger-ink)]'
                      >
                        You can only add a maximum of 10 links.
                      </p>
                    )}
                  </div>
                )}
              </FieldArray>
            </div>

            {/* Actions */}
            <div className='flex gap-3 items-center pt-1'>
              <button
                data-testid={`${saveAction}-list-button`}
                type='submit'
                disabled={isEqual(initialValues, values)}
                className='ld-btn ld-btn-primary flex-1 h-14 text-[18px] disabled:bg-[var(--ld-line)] disabled:text-[var(--ld-faint)] disabled:shadow-none disabled:cursor-not-allowed disabled:translate-x-0 disabled:translate-y-0'
              >
                {saveAction === SaveAction.Create ? 'Create' : 'Update'} List
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
}
