import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { AddLinkForm } from './AddLinkForm';

describe('AddLinkForm', () => {
  const mockHandleAddLink = jest.fn();
  const mockHandleChange = jest.fn();
  const mockHandleDeleteLink = jest.fn();

  const links = [
    {
      title: 'Link 1',
      description: 'Description 1',
      url: 'https://example.com'
    }
  ];

  beforeEach(() => {
    render(
      <AddLinkForm
        links={links}
        handleAddLink={mockHandleAddLink}
        handleChange={mockHandleChange}
        handleDeleteLink={mockHandleDeleteLink}
      />
    );
  });

  test('renders links correctly', () => {
    expect(screen.getByText('Links')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Link 1')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Description 1')).toBeInTheDocument();
    expect(screen.getByDisplayValue('https://example.com')).toBeInTheDocument();
  });

  test('calls handleAddLink when Add Link button is clicked', () => {
    fireEvent.click(screen.getByText('Add Link'));
    expect(mockHandleAddLink).toHaveBeenCalled();
  });

  test('calls handleChange when link title is changed', () => {
    fireEvent.change(screen.getByTestId('link-title-input'), {
      target: { value: 'New Title' }
    });
    expect(mockHandleChange).toHaveBeenCalledWith(0, 'title', 'New Title');
  });

  test('calls handleChange when link description is changed', () => {
    fireEvent.change(screen.getByPlaceholderText('Description'), {
      target: { value: 'New Description' }
    });
    expect(mockHandleChange).toHaveBeenCalledWith(
      0,
      'description',
      'New Description'
    );
  });

  test('calls handleChange when link URL is changed', () => {
    fireEvent.change(screen.getByTestId('link-url-input'), {
      target: { value: 'new-url.com' }
    });
    fireEvent.blur(screen.getByTestId('link-url-input'));
    expect(mockHandleChange).toHaveBeenCalledWith(0, 'url', 'new-url.com');
  });

  test('calls handleDeleteLink when delete button is clicked', () => {
    fireEvent.click(screen.getByText('×'));
    expect(mockHandleDeleteLink).toHaveBeenCalledWith(0);
  });
});
