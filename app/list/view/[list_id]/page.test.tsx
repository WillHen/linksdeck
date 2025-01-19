import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';
import ViewListPage from './page';

jest.mock('next/headers', () => ({
  cookies: jest.fn(() => ({
    get: jest.fn(() => ({ value: 'test-cookie-value' })),
    getAll: jest.fn(() => [{ name: 'test-cookie', value: 'test-cookie-value' }])
  }))
}));

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;

// Mock list and links response
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

const server = setupServer(
  http.get(`${SUPABASE_URL}/rest/v1/lists`, () => {
    return HttpResponse.json(listData);
  }),
  http.get(`${SUPABASE_URL}/rest/v1/links`, () => {
    return HttpResponse.json(linksData);
  })
);

// Ideally you'd move this to a setupTests file
beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('ViewListPage', () => {
  it('renders the list details and links', async () => {
    const Result = await ViewListPage({ params: { list_id: '1' } });
    render(Result);

    // Assert list details
    expect(screen.getByText('Test Title')).toBeInTheDocument();
    expect(screen.getByText('Test Description')).toBeInTheDocument();

    // Assert links
    linksData.forEach((link) => {
      expect(screen.getByText(link.title)).toBeInTheDocument();
      expect(screen.getByText(link.description)).toBeInTheDocument();
      expect(screen.getByText(link.title).closest('a')).toHaveAttribute(
        'href',
        link.url
      );
    });
  });
});
