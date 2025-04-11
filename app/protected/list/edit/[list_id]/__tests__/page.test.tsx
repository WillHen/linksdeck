import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Page from '../page';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';
import { fetchListAndLinks, saveListAndLinks } from '../actions';

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
  useParams: jest.fn().mockReturnValue({ list_id: 'list_id' })
}));

const mockUser = { id: 'user1', email: 'user@example.com' };

jest.mock('@/lib/supabaseClient', () => ({
  supabase: {
    from: jest.fn().mockReturnThis(),
    delete: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    in: jest.fn().mockReturnThis()
  }
}));
const mockListInsert = jest.fn().mockReturnThis();
const mockListSelect = jest.fn().mockReturnThis();
const mockLinkDelete = jest.fn().mockReturnThis();
const mockListEq = jest.fn().mockReturnThis();
const mockLinkEq = jest.fn().mockReturnThis();
const mockLinkInsert = jest.fn().mockReturnThis();
const mockLinkSelect = jest.fn().mockReturnThis();
const mockListDelete = jest.fn().mockReturnThis();

jest.mock('@/lib/supabaseClient', () => {
  return {
    supabase: {
      auth: {
        getUser: jest.fn(() =>
          Promise.resolve({ data: { user: mockUser }, error: null })
        ),
        setSession: jest.fn()
      },
      from: jest.fn().mockImplementation((table) => {
        if (table === 'lists') {
          return {
            insert: mockListInsert,
            select: mockListSelect,
            eq: mockListEq,
            delete: mockListDelete,
            mockListInsert,
            mockListSelect
          };
        }

        if (table === 'links') {
          return {
            insert: mockLinkInsert,
            select: mockLinkSelect,
            eq: mockLinkEq,
            delete: mockLinkDelete,
            mockLinkInsert,
            mockLinkSelect
          };
        }
      })
    }
  };
});

jest.mock('../actions', () => ({
  ...jest.requireActual('../actions'),
  fetchListAndLinks: jest.fn(
    () => new Promise((resolve) => resolve({ listData: {}, linksData: [] }))
  ),
  saveListAndLinks: jest.fn(() => new Promise<void>((resolve) => resolve()))
}));

describe('EditListPage', () => {
  const mockRouterPush = jest.fn();
  const mockFetchListAndLinks = fetchListAndLinks as jest.Mock;
  const mockSaveListAndLinks = saveListAndLinks as jest.Mock;

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({ push: mockRouterPush });
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
        'list_id',
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
      expect(mockRouterPush).toHaveBeenCalledWith('/list/view/list_id');
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
      expect(supabase.from).toHaveBeenCalledWith('links');
      expect(mockListDelete).toHaveBeenCalled();
      expect(mockLinkEq).toHaveBeenCalledWith('list_id', 'list_id');
      expect(supabase.from).toHaveBeenCalledWith('lists');
      expect(mockRouterPush).toHaveBeenCalledWith('/protected');
    });
  });
});
