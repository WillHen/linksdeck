import { render, waitFor } from '@testing-library/react';
import { useRouter, useSearchParams } from 'next/navigation';
import DeleteAccountPage from '../page';

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
  useSearchParams: jest.fn()
}));

describe('DeleteAccountPage', () => {
  let pushMock: jest.Mock;
  let getMock: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();

    // Mock useRouter
    pushMock = jest.fn();
    (useRouter as jest.Mock).mockReturnValue({ push: pushMock });

    // Mock useSearchParams
    getMock = jest.fn();
    (useSearchParams as jest.Mock).mockReturnValue({ get: getMock });

    // Mock fetch
    global.fetch = jest.fn();
  });

  it('should redirect when no token is provided', async () => {
    getMock.mockReturnValue(undefined);

    render(<DeleteAccountPage />);

    await waitFor(() => {
      expect(pushMock).toHaveBeenCalledWith(
        '/error?message=Missing cancellation token'
      );
    });
  });

  it('should redirect to success page on successful deletion', async () => {
    getMock.mockReturnValue('test-token');
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      status: 200
    });

    render(<DeleteAccountPage />);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        '/api/confirm-deletion',
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            'Content-Type': 'application/json'
          }),
          body: JSON.stringify({ token: 'test-token' })
        })
      );

      expect(pushMock).toHaveBeenCalledWith('/delete-confirmed?success=true');
    });
  });

  it('should redirect to error page when API call fails', async () => {
    getMock.mockReturnValue('test-token');
    (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('API Error'));

    render(<DeleteAccountPage />);

    await waitFor(() => {
      expect(pushMock).toHaveBeenCalledWith(
        '/delete-confirmed?success=false&error=An%20unexpected%20error%20occurred'
      );
    });
  });

  it('should redirect to error page when API returns non-200 status', async () => {
    getMock.mockReturnValue('test-token');
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 500
    });

    render(<DeleteAccountPage />);

    await waitFor(() => {
      expect(pushMock).toHaveBeenCalledWith('/delete-confirmed?success=false');
    });
  });
});
