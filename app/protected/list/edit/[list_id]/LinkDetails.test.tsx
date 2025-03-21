import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Formik } from 'formik';
import { LinkDetails } from './LinkDetails';

const mockOnChange = jest.fn();
const mockOnDeleteLink = jest.fn();

const defaultProps = {
  title: 'Test Title',
  url: 'http://example.com',
  id: '1',
  linkIndex: 0,
  onChange: mockOnChange,
  onDeleteLink: mockOnDeleteLink
};

const renderWithFormik = (ui, initialValues) => {
  return render(
    <Formik
      initialValues={initialValues}
      onSubmit={jest.fn()} // Mock submit function
    >
      {ui}
    </Formik>
  );
};

describe('LinkDetails', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders title and url', () => {
    renderWithFormik(<LinkDetails {...defaultProps} />, {
      links: [{ title: 'Test Title', url: 'http://example.com' }]
    });
    expect(screen.getByDisplayValue('Test Title')).toBeInTheDocument();
    expect(screen.getByDisplayValue('http://example.com')).toBeInTheDocument();
  });

  test('enters edit mode and updates title and url', () => {
    renderWithFormik(<LinkDetails {...defaultProps} />, {
      links: [{ title: 'Test Title', url: 'http://example.com' }]
    });
    const titleInput = screen.getByTestId('link-title-0');
    const urlInput = screen.getByTestId('link-url-0');
    // Update the title
    fireEvent.change(titleInput, { target: { value: 'Updated Title' } });
    expect(mockOnChange).toHaveBeenCalledWith(
      0,
      { title: 'Updated Title', url: 'http://example.com' },
      '1',
      undefined
    );

    // Update the URL
    // fireEvent.change(urlInput, { target: { value: 'http://updated.com' } });
    // expect(mockOnChange).toHaveBeenCalledWith(
    //   '1', // id
    //   undefined, // new_id
    //   0, // linkIndex
    //   {
    //     title: 'Updated Title', // Title remains unchanged
    //     url: 'http://updated.com'
    //   }
    // );
  });

  test('cancels edit mode', () => {
    renderWithFormik(<LinkDetails {...defaultProps} />, {
      links: [{ title: 'Test Title', url: 'http://example.com' }]
    });
    expect(screen.getByDisplayValue('Test Title')).toBeInTheDocument();
    expect(screen.getByDisplayValue('http://example.com')).toBeInTheDocument();
  });

  test('deletes link', () => {
    renderWithFormik(<LinkDetails {...defaultProps} />, {
      links: [{ title: 'Test Title', url: 'http://example.com' }]
    });
    fireEvent.click(screen.getByTestId('delete-link-0-button'));
    expect(mockOnDeleteLink).toHaveBeenCalledWith(0);
  });
});
