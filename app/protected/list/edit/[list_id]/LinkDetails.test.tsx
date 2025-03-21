import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
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
    // Update the title
    fireEvent.change(titleInput, { target: { value: 'Updated Title' } });
    fireEvent.change(urlInput, { target: { value: 'http://updated.com' } });

    // Assert that the mock function was called twice
    expect(mockOnChange).toHaveBeenCalledTimes(2);

    // Assert the arguments for the first call
    expect(mockOnChange).toHaveBeenNthCalledWith(
      1, // First call
      0,
      { title: 'Updated Title', url: 'http://example.com' },
      '1',
      undefined // Updated title, original URL
    );

    // Assert the arguments for the second call
    expect(mockOnChange).toHaveBeenNthCalledWith(
      2, // Second call
      0,
      {
        id: '1',
        new_id: undefined,
        title: 'Test Title',
        url: 'http://updated.com'
      },
      '1',
      undefined // Original title, updated URL
    );
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
