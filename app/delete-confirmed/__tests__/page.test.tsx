import { render, screen, waitFor } from '@testing-library/react';
import DeleteConfirmedPage from '../page';
import { useRouter, useSearchParams } from 'next/navigation';

// Mock the useRouter and useSearchParams hooks
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
  useSearchParams: jest.fn()
}));

describe('DeleteConfirmedPage', () => {
  const mockPush = jest.fn();
  const mockSearchParams = jest.fn();

  beforeEach(() => {
    // Reset the mocks before each test
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush
    });
    (useSearchParams as jest.Mock).mockImplementation(mockSearchParams);
  });

  it('should redirect to sign-in on success', async () => {
    mockSearchParams.mockReturnValue({
      get: (key: string) => (key === 'success' ? 'true' : null)
    });

    render(<DeleteConfirmedPage />);

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/sign-in');
    });

    expect(screen.getByText('Deleting Account...')).toBeInTheDocument();
  });

  it('should redirect to error page with message on error', async () => {
    const errorMessage = 'Account deletion failed';
    mockSearchParams.mockReturnValue({
      get: (key: string) => (key === 'error' ? errorMessage : null)
    });

    render(<DeleteConfirmedPage />);

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith(
        `/error?message=${encodeURIComponent(errorMessage)}`
      );
    });

    expect(screen.getByText('Error Occurred')).toBeInTheDocument();
  });

  it('should show error state when success is false', async () => {
    mockSearchParams.mockReturnValue({
      get: (key: string) => (key === 'success' ? 'false' : null)
    });

    render(<DeleteConfirmedPage />);

    await waitFor(() => {
      expect(screen.getByText('Error Occurred')).toBeInTheDocument();
    });

    expect(mockPush).not.toHaveBeenCalled();
  });
});
