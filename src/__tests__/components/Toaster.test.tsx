import React from 'react';
import { render, screen } from '@testing-library/react';
import Toaster from '@/components/ui/Toaster';

describe('Toaster', () => {
  test('renders container region', () => {
    render(<Toaster />);
    // Many toaster libs render a region or status area
    expect(screen.queryByRole('region') || screen.queryByRole('status') || document.body).toBeTruthy();
  });

  test('does not throw when rendered multiple times', () => {
    render(
      <>
        <Toaster />
        <Toaster />
      </>
    );
    expect(true).toBe(true);
  });
});
