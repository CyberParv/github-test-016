import React from 'react';
import { render, screen } from '@testing-library/react';
import Badge from '@/components/ui/Badge';

describe('Badge', () => {
  test('renders text', () => {
    render(<Badge>New</Badge>);
    expect(screen.getByText('New')).toBeInTheDocument();
  });

  test('renders with variant prop (if implemented)', () => {
    const { container } = render(<Badge variant="success">OK</Badge> as any);
    expect(container.textContent).toContain('OK');
  });
});
