'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Navigation } from '@/components/layout/Navigation';
import { Button } from '@/components/ui/Button';
import { Spinner } from '@/components/ui/Spinner';
import { CartItem } from '@/components/features/CartItem';
import { api } from '@/lib/api';
import { useToast } from '@/providers/ToastProvider';

interface CartData {
  items: { productId: string; name: string; price: number; quantity: number; imageUrl?: string }[];
  subtotal: number;
  tax: number;
  total: number;
}

export default function CartPage() {
  const { toast } = useToast();
  const [cart, setCart] = useState<CartData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadCart = async () => {
    try {
      setLoading(true);
      const data = await api.get('/api/cart');
      setCart(data);
      setError('');
    } catch (e) {
      setError('Unable to load cart.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCart();
  }, []);

  const handleRemove = async (productId: string) => {
    try {
      await api.post('/api/cart', { items: [{ productId, quantity: 0 }] });
      loadCart();
    } catch (e) {
      toast({ title: 'Remove failed', description: 'Please try again.', variant: 'error' });
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      <main className="mx-auto max-w-5xl space-y-8 px-4 py-10">
        <h1 className="text-3xl font-bold text-gray-900">Your Cart</h1>
        {loading ? (
          <div className="flex justify-center py-10"><Spinner /></div>
        ) : error ? (
          <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-center text-red-700">
            {error}
            <div className="mt-4">
              <Button onClick={loadCart}>Retry</Button>
            </div>
          </div>
        ) : !cart || cart.items.length === 0 ? (
          <div className="rounded-lg border border-gray-200 bg-gray-50 p-6 text-center text-gray-600">
            Your cart is empty.
          </div>
        ) : (
          <div className="grid gap-8 lg:grid-cols-[2fr_1fr]">
            <div className="space-y-4">
              {cart.items.map((item) => (
                <CartItem
                  key={item.productId}
                  item={item}
                  onUpdate={() => loadCart()}
                  onRemove={() => handleRemove(item.productId)}
                />
              ))}
            </div>
            <div className="space-y-4 rounded-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-semibold">${cart.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Tax</span>
                <span className="font-semibold">${cart.tax.toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between text-lg font-semibold">
                <span>Total</span>
                <span>${cart.total.toFixed(2)}</span>
              </div>
              <Link href="/checkout">
                <Button className="w-full">Proceed to Checkout</Button>
              </Link>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
