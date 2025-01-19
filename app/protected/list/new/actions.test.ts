import { createListAndLinksAction } from './actions';
import { supabase } from '@/lib/supabaseClient';

const mockUser = { id: 'user-id', email: 'user@example.com' };
let mockListInsert = jest.fn().mockReturnThis();
let mockListSelect = jest.fn().mockReturnThis();
let mockLinkInsert = jest.fn().mockReturnThis();
let mockLinkSelect = jest.fn().mockReturnThis();

jest.mock('@/lib/supabaseClient', () => {
  return {
    supabase: {
      auth: {
        getUser: jest.fn(() => mockUser),
        setSession: jest.fn()
      },
      from: jest.fn().mockImplementation((table) => {
        if (table === 'lists') {
          return {
            insert: mockListInsert,
            select: mockListSelect,
            mockListInsert,
            mockListSelect
          };
        }

        if (table === 'links') {
          return {
            insert: mockLinkInsert,
            select: mockLinkSelect,
            mockLinkInsert,
            mockLinkSelect
          };
        }
      })
    }
  };
});

describe('createListAndLinksAction', () => {
  beforeAll(() => {
    jest.clearAllMocks();
    mockListInsert = jest.fn().mockReturnThis();
    mockListSelect = jest.fn().mockReturnThis();
    mockLinkInsert = jest.fn().mockReturnThis();
    mockLinkSelect = jest.fn().mockReturnThis();
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  it('should save list and links successfully', async () => {
    const mockListData = [{ id: 'list-id' }];
    const mockLinksData = [{ id: 'link-id' }];

    (supabase.auth.getUser as jest.Mock).mockResolvedValue({
      data: { user: mockUser },
      error: null
    });

    mockListInsert.mockReturnThis();
    mockListSelect.mockResolvedValue({
      data: mockListData,
      error: null
    });

    mockLinkInsert.mockReturnThis();
    mockLinkSelect.mockResolvedValue({
      data: mockLinksData,
      error: null
    });

    const links = [
      {
        title: 'Link 1',
        description: 'Description 1',
        url: 'https://example.com'
      }
    ];

    const listId = await createListAndLinksAction(
      'Title',
      'Description',
      links
    );
    expect(listId).toBe('list-id');
  });

  it('should throw an error if user retrieval fails', async () => {
    (supabase.auth.getUser as jest.Mock).mockResolvedValue({
      data: {},
      error: { message: 'User retrieval failed' }
    });

    await expect(
      createListAndLinksAction('Title', 'Description', [])
    ).rejects.toThrow('User retrieval failed');
  });

  it('should throw an error if list creation fails', async () => {
    const mockUser = { id: 'user-id', email: 'user@example.com' };

    (supabase.auth.getUser as jest.Mock).mockResolvedValue({
      data: { user: mockUser },
      error: null
    });

    mockListInsert.mockReturnThis();
    mockListSelect.mockResolvedValue({
      data: null,
      error: { message: 'List creation failed' }
    });

    await expect(
      createListAndLinksAction('Title', 'Description', [])
    ).rejects.toThrow('List creation failed');
  });

  it('should throw an error if links creation fails', async () => {
    const mockUser = { id: 'user-id', email: 'user@example.com' };
    const mockListData = [{ id: 'list-id' }];

    (supabase.auth.getUser as jest.Mock).mockResolvedValue({
      data: { user: mockUser },
      error: null
    });

    mockListInsert.mockReturnThis();
    mockListSelect.mockResolvedValue({
      data: mockListData,
      error: null
    });

    mockLinkInsert.mockResolvedValue({
      data: null,
      error: { message: 'Links creation failed' }
    });
    mockLinkSelect.mockResolvedValue({
      data: null,
      error: { message: 'Links creation failed' }
    });

    const links = [
      {
        title: 'Link 1',
        description: 'Description 1',
        url: 'https://example.com'
      }
    ];

    await expect(
      createListAndLinksAction('Title', 'Description', links)
    ).rejects.toThrow('Links creation failed');
  });
});