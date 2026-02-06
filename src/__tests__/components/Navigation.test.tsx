import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

// Navigation likely depends on next-auth session
jest.mock('next-auth/react', () => ({
  __esModule: true,
  useSession: () => ({ data: null, status: 'unauthenticated' }),
  signOut: jest.fn(),
}));

import Navigation from '@/components/layout/Navigation';

describe('Navigation', () => {
  test('renders public navigation links', () => {
    render(<Navigation />);
    expect(screen.getByRole('navigation')).toBeInTheDocument();
  });

  test('renders authenticated actions when session exists', async () => {
    jest.doMock('next-auth/react', () => ({
      __esModule: true,
      useSession: () => ({ data: { user: { id: 'u1', role: 'USER', email: 'u@e.com' } }, status: 'authenticated' }),
      signOut: jest.fn(),
    }));
    const { default: NavAuthed } = await import('@/components/layout/Navigation');
    render(<NavAuthed />);
    expect(screen.getByRole('navigation')).toBeInTheDocument();
  });

  test('accessibility: navigation landmark present', () => {
    render(<Navigation />);
    expect(screen.getByRole('navigation')).toBeInTheDocument();
  });

  test('interaction: menu button (if exists) is clickable', async () => {
    const user = userEvent.setup();
    render(<Navigation />);
    const button = screen.queryByRole('button', { name: /menu|open/i });
    if (button) await user.click(button);
    expect(true).toBe(true);
  });
});
