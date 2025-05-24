'use client';

import { Formik, Form, Field, ErrorMessage, FormikHelpers } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-hot-toast';

const validationSchema = Yup.object({
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  subject: Yup.string().required('Subject is required'),
  message: Yup.string().required('Message is required')
});

const initialValues = {
  email: '',
  subject: '',
  message: ''
};

const handleSubmit = async (
  values: typeof initialValues,
  { resetForm }: FormikHelpers<typeof initialValues>
) => {
  try {
    const res = await fetch('/api/contact-us', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(values)
    });

    if (!res.ok) {
      throw new Error('Failed to send email.', { cause: res });
    }

    toast.success('Email sent successfully! We will get back to you soon.', {
      duration: 6000,
      className: 'toast-success'
    });
    resetForm();
  } catch (err) {
    console.error('Error sending email:', err);
    toast.error('Failed to send email. Please try again later.', {
      duration: 6000,
      className: 'toast-error'
    });
  }
};

export default function ContactPage() {
  return (
    <div className='flex flex-col items-center min-h-screen px-4 py-8 mt-24 sm:px-6'>
      <div className='w-full max-w-md space-y-6'>
        <h1 className='text-2xl font-bold text-center text-gray-800 sm:text-3xl'>
          Contact Us
        </h1>
        <p className='text-sm text-center text-gray-600'>
          Have questions or feedback? Fill out the form below to send us an
          email.
        </p>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form className='space-y-4'>
              <div>
                <label
                  htmlFor='email'
                  className='block text-sm font-medium text-gray-700'
                >
                  Your Email
                </label>
                <Field
                  type='email'
                  id='email'
                  name='email'
                  className='w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
                  placeholder='Enter your email'
                />
                <ErrorMessage
                  name='email'
                  component='p'
                  className='text-sm text-red-600 mt-1'
                />
              </div>
              <div>
                <label
                  htmlFor='subject'
                  className='block text-sm font-medium text-gray-700'
                >
                  Subject
                </label>
                <Field
                  type='text'
                  id='subject'
                  name='subject'
                  className='w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
                  placeholder='Enter the subject'
                />
                <ErrorMessage
                  name='subject'
                  component='p'
                  className='text-sm text-red-600 mt-1'
                />
              </div>
              <div>
                <label
                  htmlFor='message'
                  className='block text-sm font-medium text-gray-700'
                >
                  Message
                </label>
                <Field
                  as='textarea'
                  id='message'
                  name='message'
                  rows={4}
                  className='w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
                  placeholder='Enter your message'
                />
                <ErrorMessage
                  name='message'
                  component='p'
                  className='text-sm text-red-600 mt-1'
                />
              </div>
              <button
                type='submit'
                disabled={isSubmitting}
                className='w-full rounded-md bg-blue-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50'
              >
                {isSubmitting ? 'Sending...' : 'Send Email'}
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}
