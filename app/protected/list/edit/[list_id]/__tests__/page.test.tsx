import React from 'react';
import {
  render,
  screen,
  waitFor,
  fireEvent,
  act
} from '@testing-library/react';
import Page from '../page';
import { useParams } from 'next/navigation';

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(() => ({
    push: jest.fn(), // Mock the `push` method
    replace: jest.fn(), // Mock the `replace` method (if needed)
    back: jest.fn() // Mock the `back` method (if needed)
  })),
  useParams: jest.fn()
}));

const listId = '25de3ed8-12d3-485f-8a72-ce71f4e92ad7'; // Valid UUID format

describe('EditListPage', () => {
  beforeEach(async () => {
    // Mock `useParams` to return the listId
    (useParams as jest.Mock).mockReturnValue({ list_id: listId });
  });

  it('renders the page and fetches data from the API', async () => {
    render(<Page />);

    await waitFor(() => {
      expect(screen.getByTestId('edit-list-header')).toBeInTheDocument();
    });
  });

  it('adds a link and updates the list', async () => {
    render(<Page />);

    // Wait for the page to load
    await waitFor(() => {
      expect(screen.getByTestId('edit-list-header')).toBeInTheDocument();
    });

    // Add a new link
    const addLinkButton = screen.getByText('Add Link');
    act(() => {
      addLinkButton.click();
    });

    const linkTitleInput = screen.getByTestId('link-title-2');
    const linkUrlInput = screen.getByTestId('link-url-2');

    await act(async () => {
      fireEvent.change(linkTitleInput, { target: { value: 'New Link' } });
      fireEvent.change(linkUrlInput, {
        target: { value: 'https://newlink.com' }
      });
    });

    const saveLinkButton = screen.getByTestId('update-list-button');
    await act(async () => {
      saveLinkButton.click();
    });
  });

  it('adds validation messages', async () => {
    render(<Page />);

    await waitFor(() => {
      expect(screen.getByTestId('edit-list-header')).toBeInTheDocument();
    });

    const titleInput = screen.getByTestId('list-title-input');
    await act(async () => {
      fireEvent.change(titleInput, { target: { value: '' } });
    });

    // Simulate unfocusing the input field to trigger validation
    await act(async () => {
      fireEvent.blur(titleInput);
    });

    // Wait for the validation message to appear
    await waitFor(() => {
      expect(screen.getByText('List title is required')).toBeInTheDocument();
    });
  });
});
