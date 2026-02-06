import React from 'react';
import { render, screen } from '@testing-library/react';
import Card from '@/components/ui/Card';

describe('Card', () => {
  test('renders content', () => {
    render(
      <Card>
        <h2>Title</h2>
        <p>Body</p>
      </Card>
    );
    expect(screen.getByText('Title')).toBeInTheDocument();
    expect(screen.getByText('Body')).toBeInTheDocument();
  });

  test('renders with different props (className)', () => {
    const { container } = render(<Card className="custom">X</Card>);
    expect(container.firstChild).toHaveClass('custom');
  });
});
