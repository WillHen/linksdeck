import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import DeleteAccountPage from '../page';

// Mock next/headers
jest.mock('next/headers', () => ({
  headers: jest.fn()
}));

// Mock next/navigation
jest.mock('next/navigation', () => ({
  redirect: jest.fn()
}));

// Mock supabase client
jest.mock('@/utils/supabase/server', () => ({
  createClient: jest.fn().mockReturnValue({
    auth: {
      getSession: jest.fn().mockResolvedValue({
        data: {
          session: {
            access_token: 'test-token'
          }
        },
        error: null
      })
    }
  })
}));

// Mock fetch
global.fetch = jest.fn();

describe('DeleteAccountPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (headers as jest.Mock).mockReturnValue({
      get: jest.fn().mockImplementation((key) => {
        if (key === 'x-forwarded-proto') return 'https';
        if (key === 'host') return 'example.com';
        return null;
      })
    });
  });

  it('should redirect when no token is provided', async () => {
    await DeleteAccountPage({ searchParams: {} });
    expect(redirect).toHaveBeenCalledWith(
      '/error?message=Missing cancellation token'
    );
  });

  it('should redirect to success page on successful deletion', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      status: 200
    });

    await DeleteAccountPage({
      searchParams: { token: 'test-token' }
    });

    expect(global.fetch).toHaveBeenCalledWith(
      'https://example.com/api/confirm_deletion',
      expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({
          'Content-Type': 'application/json',
          Authorization: 'Bearer test-token'
        }),
        body: JSON.stringify({ token: 'test-token' })
      })
    );

    expect(redirect).toHaveBeenCalledWith(
      '/protected/delete-confirmed?success=true'
    );
  });

  it('should redirect to error page when API call fails', async () => {
    (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('API Error'));

    await DeleteAccountPage({
      searchParams: { token: 'test-token' }
    });

    expect(redirect).toHaveBeenCalledWith(
      '/protected/delete-confirmed?success=false&error=An%20unexpected%20error%20occurred'
    );
  });

  it('should redirect to error page when API returns non-200 status', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 500
    });

    await DeleteAccountPage({
      searchParams: { token: 'test-token' }
    });

    expect(redirect).toHaveBeenCalledWith(
      '/protected/delete-confirmed?success=false'
    );
  });
});
