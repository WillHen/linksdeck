import '@testing-library/jest-dom';
import { render, screen, waitFor } from '@testing-library/react';
import Page from '../page';

// Mock the underlying functions
jest.mock('@/app/utils', () => ({
  getListsFromSupabaseAnon: jest.fn(),
  getLinksFromSupabaseAnon: jest.fn()
}));

jest.mock('@/utils/supabase/server', () => ({
  createClient: jest.fn()
}));

import {
  getListsFromSupabaseAnon,
  getLinksFromSupabaseAnon
} from '@/app/utils';

const listData = { title: 'Test Title', description: 'Test Description' };
const linksData = [
  {
    id: '1',
    title: 'Link 1',
    description: 'Description 1',
    url: 'http://example.com/1'
  },
  {
    id: '2',
    title: 'Link 2',
    description: 'Description 2',
    url: 'http://example.com/2'
  }
];

describe('ViewListPage', () => {
  beforeAll(() => {
    (getListsFromSupabaseAnon as jest.Mock).mockReturnValue({
      eq: () => ({ single: () => ({ data: listData, error: null }) })
    });
    (getLinksFromSupabaseAnon as jest.Mock).mockReturnValue({
      eq: () => ({ data: linksData, error: null })
    });
  });

  afterAll(() => {
    jest.resetAllMocks();
  });

  it('renders the list details and links', async () => {
    const Result = await Page({ params: { list_id: '1' } });
    render(Result);

    // Wait for the list title to be rendered
    await waitFor(() =>
      expect(screen.getByText('Test Title')).toBeInTheDocument()
    );

    // Assert list details
    expect(screen.getByText('Test Title')).toBeInTheDocument();
    expect(screen.getByText('Test Description')).toBeInTheDocument();

    // Assert links
    linksData.forEach((link) => {
      expect(screen.getByText(link.title)).toBeInTheDocument();
      expect(screen.getByText(link.title).closest('a')).toHaveAttribute(
        'href',
        link.url
      );
    });
  });
});
