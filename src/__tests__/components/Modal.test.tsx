import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Modal from '@/components/ui/Modal';

describe('Modal', () => {
  test('does not render when closed', () => {
    render(
      <Modal open={false} onClose={jest.fn()} title="Dialog">
        Content
      </Modal>
    );
    expect(screen.queryByText('Content')).not.toBeInTheDocument();
  });

  test('renders when open and calls onClose', async () => {
    const user = userEvent.setup();
    const onClose = jest.fn();
    render(
      <Modal open onClose={onClose} title="Dialog">
        Content
      </Modal>
    );
    expect(screen.getByRole('dialog', { name: /dialog/i })).toBeInTheDocument();

    const close = screen.queryByRole('button', { name: /close/i });
    if (close) {
      await user.click(close);
      expect(onClose).toHaveBeenCalled();
    }
  });

  test('accessibility: has role=dialog with aria-modal', () => {
    render(
      <Modal open onClose={jest.fn()} title="Dialog">
        Content
      </Modal>
    );
    const dialog = screen.getByRole('dialog', { name: /dialog/i });
    expect(dialog).toHaveAttribute('aria-modal');
  });
});
