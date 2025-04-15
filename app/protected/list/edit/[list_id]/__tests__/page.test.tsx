import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Page from '../page';
import { useRouter, useParams } from 'next/navigation';
import { fetchListAndLinks, saveListAndLinks } from '../actions';

// Mock modules
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
  useParams: jest.fn()
}));

jest.mock('../actions', () => ({
  ...jest.requireActual('../actions'),
  fetchListAndLinks: jest.fn(
    () => new Promise((resolve) => resolve({ listData: {}, linksData: [] }))
  ),
  saveListAndLinks: jest.fn(() => new Promise<void>((resolve) => resolve()))
}));

// Mock fetch for API calls
global.fetch = jest.fn();

const mockUser = { id: 'user1', email: 'user@example.com' };
const mockListId = '123e4567-e89b-12d3-a456-426614174000'; // Valid UUID format

describe('EditListPage', () => {
  const mockRouterPush = jest.fn();
  const mockFetchListAndLinks = fetchListAndLinks as jest.Mock;
  const mockSaveListAndLinks = saveListAndLinks as jest.Mock;

  beforeAll(() => {
    (useParams as jest.Mock).mockReturnValue({ list_id: mockListId });
  });

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({ push: mockRouterPush });
    (global.fetch as jest.Mock).mockImplementation((url) => {
      if (url.includes('/api/user')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ user: mockUser })
        });
      }
      return Promise.reject(new Error(`Unhandled fetch mock for ${url}`));
    });

    mockFetchListAndLinks.mockResolvedValue({
      listData: {
        user_id: 'user1',
        title: 'Test List',
        description: 'Test Description'
      },
      linksData: [
        {
          id: 'link1',
          title: 'Link 1',
          url: 'https://example.com'
        }
      ]
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders EditListPage correctly', async () => {
    render(<Page />);

    await waitFor(() => {
      expect(screen.getByTestId('edit-list-header')).toBeInTheDocument();
      expect(screen.getByDisplayValue('Test List')).toBeInTheDocument();
      expect(screen.getByDisplayValue('Test Description')).toBeInTheDocument();
      expect(screen.getByTestId('link-title-0')).toBeInTheDocument();
      expect(screen.getByTestId('link-url-0')).toBeInTheDocument();
    });
  });

  test('handles form submission', async () => {
    render(<Page />);

    await waitFor(() => {
      expect(screen.getByTestId('edit-list-header')).toBeInTheDocument();
      expect(screen.getByTestId('list-title-input')).toBeInTheDocument();
    });

    fireEvent.change(screen.getByTestId('list-title-input'), {
      target: { value: 'Updated List' }
    });
    fireEvent.change(screen.getByTestId('list-description-input'), {
      target: { value: 'Updated Description' }
    });
    fireEvent.click(screen.getByTestId('update-list-button'));

    await waitFor(() => {
      expect(mockSaveListAndLinks).toHaveBeenCalledWith(
        mockListId,
        'Updated List',
        'Updated Description',
        [
          {
            id: 'link1',
            title: 'Link 1',
            url: 'https://example.com'
          }
        ],
        'user1'
      );
      expect(mockRouterPush).toHaveBeenCalledWith('/list/view/' + mockListId);
    });
  });

  test('handles link deletion', async () => {
    render(<Page />);

    await waitFor(() => {
      expect(screen.getByTestId('edit-list-header')).toBeInTheDocument();
      expect(screen.getByTestId('list-title-input')).toBeInTheDocument();
      expect(screen.queryByTestId('link-title-0')).toBeInTheDocument();
      expect(screen.queryByTestId('link-url-0')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByTestId('delete-link-0-button'));

    await waitFor(() => {
      expect(screen.queryByTestId('link-title-0')).not.toBeInTheDocument();
      expect(screen.queryByTestId('link-url-0')).not.toBeInTheDocument();
    });
  });

  test('handles list deletion', async () => {
    render(<Page />);

    await waitFor(() => {
      expect(screen.getByTestId('edit-list-header')).toBeInTheDocument();
      expect(screen.getByTestId('list-title-input')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByTestId('delete-list-button'));

    await waitFor(() => {
      expect(mockRouterPush).toHaveBeenCalledWith('/protected');
    });
  });
});
