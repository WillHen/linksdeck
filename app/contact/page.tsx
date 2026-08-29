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
    <div className='w-full max-w-[500px] mx-auto flex flex-col gap-7 py-6 sm:py-10'>
      <div className='flex flex-col items-center gap-2.5 text-center'>
        <h1 className='text-[34px] sm:text-[42px] font-bold leading-[1.05] tracking-[-0.03em] text-[var(--ld-ink)]'>
          Contact Us
        </h1>
        <p className='text-base text-[var(--ld-body)]'>
          Have questions or feedback? Fill out the form below to send us an
          email.
        </p>
      </div>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form className='ld-card flex flex-col gap-[18px] p-7'>
            <div className='flex flex-col gap-2'>
              <label htmlFor='email' className='ld-label'>
                Your Email
              </label>
              <Field
                type='email'
                id='email'
                name='email'
                className='ld-input ld-input-mono'
                placeholder='Enter your email'
              />
              <ErrorMessage
                name='email'
                component='p'
                className='text-[13px] text-[var(--ld-danger-ink)]'
              />
            </div>

            <div className='flex flex-col gap-2'>
              <label htmlFor='subject' className='ld-label'>
                Subject
              </label>
              <Field
                type='text'
                id='subject'
                name='subject'
                className='ld-input'
                placeholder='Enter the subject'
              />
              <ErrorMessage
                name='subject'
                component='p'
                className='text-[13px] text-[var(--ld-danger-ink)]'
              />
            </div>

            <div className='flex flex-col gap-2'>
              <label htmlFor='message' className='ld-label'>
                Message
              </label>
              <Field
                as='textarea'
                id='message'
                name='message'
                rows={4}
                className='ld-input pt-3 h-auto resize-none'
                placeholder='Enter your message'
              />
              <ErrorMessage
                name='message'
                component='p'
                className='text-[13px] text-[var(--ld-danger-ink)]'
              />
            </div>

            <button
              type='submit'
              disabled={isSubmitting}
              className='ld-btn ld-btn-primary h-[52px] text-[17px] disabled:opacity-60'
            >
              {isSubmitting ? 'Sending...' : 'Send Email'}
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
}
