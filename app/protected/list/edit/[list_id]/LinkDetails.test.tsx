import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
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

describe('LinkDetails', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders title and url', () => {
    render(<LinkDetails {...defaultProps} />);
    expect(screen.getByText('Test Title')).toBeInTheDocument();
    expect(screen.getByText('http://example.com')).toBeInTheDocument();
  });

  test('enters edit mode and updates title and url', () => {
    render(<LinkDetails {...defaultProps} />);
    fireEvent.click(screen.getByTestId('edit-button'));
    const titleInput = screen.getByTestId('link-title-input');
    const urlInput = screen.getByTestId('link-url-input');
    fireEvent.change(titleInput, { target: { value: 'Updated Title' } });
    fireEvent.change(urlInput, { target: { value: 'http://updated.com' } });
    fireEvent.click(screen.getByTestId('confirm-button'));
    expect(mockOnChange).toHaveBeenCalledWith(0, {
      title: 'Updated Title',
      url: 'http://updated.com'
    });
  });

  test('shows validation error for invalid url', () => {
    render(<LinkDetails {...defaultProps} />);
    fireEvent.click(screen.getByTestId('edit-button'));
    const urlInput = screen.getByTestId('link-url-input');
    fireEvent.change(urlInput, { target: { value: 'invalid-url' } });
    fireEvent.click(screen.getByTestId('confirm-button'));
    expect(
      screen.getByText('Title and a valid URL are required')
    ).toBeInTheDocument();
  });

  test('cancels edit mode', () => {
    render(<LinkDetails {...defaultProps} />);
    fireEvent.click(screen.getByTestId('edit-button'));
    fireEvent.click(screen.getByTestId('cancel-button'));
    expect(screen.getByText('Test Title')).toBeInTheDocument();
    expect(screen.getByText('http://example.com')).toBeInTheDocument();
  });

  test('deletes link', () => {
    render(<LinkDetails {...defaultProps} />);
    fireEvent.click(screen.getByTestId('link-delete'));
    expect(mockOnDeleteLink).toHaveBeenCalledWith(0);
  });
});
