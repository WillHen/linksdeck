import { render, screen } from '@testing-library/react';
import DeleteAccountClient from '../page';
import { useRouter } from 'next/navigation';

// Mock the useRouter hook
jest.mock('next/navigation', () => ({
  useRouter: jest.fn()
}));

describe('DeleteAccountClient', () => {
  const mockPush = jest.fn();

  beforeEach(() => {
    // Reset the mock before each test
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush
    });
  });

  it('should redirect to sign-in on success', () => {
    render(<DeleteAccountClient success={true} />);

    expect(mockPush).toHaveBeenCalledWith('/sign-in');
    expect(screen.getByText('Deleting Account...')).toBeInTheDocument();
  });

  it('should redirect to error page with message on error', () => {
    const errorMessage = 'Account deletion failed';
    render(<DeleteAccountClient error={errorMessage} />);

    expect(mockPush).toHaveBeenCalledWith(
      `/error?message=${encodeURIComponent(errorMessage)}`
    );
    expect(screen.getByText('Error Occurred')).toBeInTheDocument();
  });

  it('should show error state when success is false', () => {
    render(<DeleteAccountClient success={false} />);

    expect(screen.getByText('Error Occurred')).toBeInTheDocument();
    expect(mockPush).not.toHaveBeenCalled();
  });
});
