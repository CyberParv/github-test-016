import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Input from '@/components/ui/Input';

describe('Input', () => {
  test('renders and accepts typing', async () => {
    const user = userEvent.setup();
    render(<Input aria-label="Email" />);
    const input = screen.getByRole('textbox', { name: /email/i });
    await user.type(input, 'a@b.com');
    expect(input).toHaveValue('a@b.com');
  });

  test('supports error state (aria-invalid)', () => {
    render(<Input aria-label="Name" aria-invalid="true" />);
    expect(screen.getByRole('textbox', { name: /name/i })).toHaveAttribute('aria-invalid', 'true');
  });

  test('accessibility: labelled input', () => {
    render(
      <label>
        Username
        <Input />
      </label>
    );
    expect(screen.getByRole('textbox', { name: /username/i })).toBeInTheDocument();
  });
});
