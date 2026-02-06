'use client';

import { useEffect, useState } from 'react';
import { Navigation } from '@/components/layout/Navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Spinner } from '@/components/ui/Spinner';
import { api } from '@/lib/api';
import { useToast } from '@/providers/ToastProvider';

interface CartData {
  items: { productId: string; name: string; price: number; quantity: number }[];
  total: number;
}

export default function CheckoutPage() {
  const { toast } = useToast();
  const [cart, setCart] = useState<CartData | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    name: '',
    phone: '',
    address: '',
    pickupOrDelivery: 'pickup',
    paymentMethod: 'card',
    couponCode: '',
  });

  useEffect(() => {
    const load = async () => {
      try {
        const data = await api.get('/api/cart');
        setCart(data);
      } catch (e) {
        toast({ title: 'Unable to load cart', description: 'Please try again.', variant: 'error' });
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [toast]);

  const handleSubmit = async () => {
    if (!cart || cart.items.length === 0) return;
    try {
      setSubmitting(true);
      const payload = {
        items: cart.items.map((item) => ({ productId: item.productId, quantity: item.quantity })),
        pickupOrDelivery: form.pickupOrDelivery,
        contact: { name: form.name, phone: form.phone, address: form.pickupOrDelivery === 'delivery' ? form.address : undefined },
        paymentMethod: form.paymentMethod,
        couponCode: form.couponCode || undefined,
      };
      const result = await api.post('/api/checkout', payload);
      toast({ title: 'Order placed', description: `Order #${result.orderId} confirmed.` });
    } catch (e) {
      toast({ title: 'Checkout failed', description: 'Please try again.', variant: 'error' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      <main className="mx-auto max-w-5xl space-y-8 px-4 py-10">
        <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
        {loading ? (
          <div className="flex justify-center py-10"><Spinner /></div>
        ) : !cart || cart.items.length === 0 ? (
          <div className="rounded-lg border border-gray-200 bg-gray-50 p-6 text-center text-gray-600">
            Your cart is empty.
          </div>
        ) : (
          <div className="grid gap-8 lg:grid-cols-[2fr_1fr]">
            <div className="space-y-6">
              <div className="space-y-3">
                <label className="text-sm font-medium text-gray-700">Name</label>
                <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              </div>
              <div className="space-y-3">
                <label className="text-sm font-medium text-gray-700">Phone</label>
                <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
              </div>
              <div className="space-y-3">
                <label className="text-sm font-medium text-gray-700">Pickup or delivery</label>
                <select
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                  value={form.pickupOrDelivery}
                  onChange={(e) => setForm({ ...form, pickupOrDelivery: e.target.value })}
                >
                  <option value="pickup">Pickup</option>
                  <option value="delivery">Delivery</option>
                </select>
              </div>
              {form.pickupOrDelivery === 'delivery' && (
                <div className="space-y-3">
                  <label className="text-sm font-medium text-gray-700">Delivery address</label>
                  <Input value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
                </div>
              )}
              <div className="space-y-3">
                <label className="text-sm font-medium text-gray-700">Payment method</label>
                <select
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                  value={form.paymentMethod}
                  onChange={(e) => setForm({ ...form, paymentMethod: e.target.value })}
                >
                  <option value="card">Card</option>
                  <option value="cash">Cash</option>
                </select>
              </div>
              <div className="space-y-3">
                <label className="text-sm font-medium text-gray-700">Coupon code</label>
                <Input value={form.couponCode} onChange={(e) => setForm({ ...form, couponCode: e.target.value })} />
              </div>
            </div>
            <div className="space-y-4 rounded-lg border border-gray-200 p-6">
              <div className="space-y-2">
                {cart.items.map((item) => (
                  <div key={item.productId} className="flex items-center justify-between text-sm">
                    <span>{item.name} x{item.quantity}</span>
                    <span>${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-between text-lg font-semibold">
                <span>Total</span>
                <span>${cart.total.toFixed(2)}</span>
              </div>
              <Button className="w-full" onClick={handleSubmit} disabled={submitting}>
                {submitting ? 'Placing order...' : 'Place Order'}
              </Button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
