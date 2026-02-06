'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { api } from '@/lib/api';
import { useToast } from '@/providers/ToastProvider';

interface CartItemProps {
  item: { productId: string; name: string; price: number; quantity: number; imageUrl?: string };
  onUpdate: (qty: number) => void;
  onRemove: () => void;
}

export function CartItem({ item, onUpdate, onRemove }: CartItemProps) {
  const { toast } = useToast();
  const [qty, setQty] = useState(item.quantity);
  const [loading, setLoading] = useState(false);

  const handleUpdate = async (value: number) => {
    const next = Math.max(1, value);
    setQty(next);
    onUpdate(next);
    try {
      setLoading(true);
      await api.post('/api/cart', { items: [{ productId: item.productId, quantity: next }] });
    } catch (e) {
      toast({ title: 'Update failed', description: 'Please try again.', variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-4 rounded-lg border border-gray-200 p-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-4">
        <div className="h-16 w-16 overflow-hidden rounded-md bg-gray-100">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={item.imageUrl || '/placeholder.png'} alt={item.name} className="h-full w-full object-cover" />
        </div>
        <div>
          <p className="font-medium text-gray-900">{item.name}</p>
          <p className="text-sm text-gray-600">${item.price.toFixed(2)}</p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <Input
          aria-label={`Quantity for ${item.name}`}
          type="number"
          min={1}
          value={qty}
          onChange={(e) => handleUpdate(Number(e.target.value))}
          className="w-20"
        />
        <p className="w-20 text-right font-semibold">${(item.price * qty).toFixed(2)}</p>
        <Button variant="outline" onClick={onRemove} disabled={loading}>
          Remove
        </Button>
      </div>
    </div>
  );
}
