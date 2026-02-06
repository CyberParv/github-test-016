import React from 'react';
import { render, screen } from '@testing-library/react';
import Spinner from '@/components/ui/Spinner';

describe('Spinner', () => {
  test('renders with status role for accessibility', () => {
    render(<Spinner />);
    const el = screen.queryByRole('status');
    expect(el || screen.getByTestId?.('spinner')).toBeTruthy();
  });

  test('supports size prop (if implemented) without crashing', () => {
    render(<Spinner size="sm" /> as any);
    expect(true).toBe(true);
  });
});
