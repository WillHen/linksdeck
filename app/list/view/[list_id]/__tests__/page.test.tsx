import '@testing-library/jest-dom';
import { render, screen, waitFor } from '@testing-library/react';
import Page from '../page';

jest.mock('next/headers', () => ({
  cookies: jest.fn(() => ({
    get: jest.fn((key) => {
      if (key === 'auth-token') return { value: 'mock-token' }; // Mock specific cookie values
      return null;
    }),
    getAll: jest.fn(() => [
      { name: 'auth-token', value: 'mock-token' } // Mock all cookies
    ])
  }))
}));

describe('ViewListPage', () => {
  it('renders the list details and links', async () => {
    const Result = await Page({
      params: Promise.resolve({
        list_id: '6380887d-8749-4f6f-8380-821108847402'
      })
    });
    render(Result);

    await waitFor(() =>
      expect(screen.getByText('My List')).toBeInTheDocument()
    );

    expect(screen.getByText('Example Link 2')).toBeInTheDocument();
    expect(screen.getByText('https://example.com')).toBeInTheDocument();
  });
});
