'use client';

import { useEffect, useState } from 'react';
import { Navigation } from '@/components/layout/Navigation';
import { Spinner } from '@/components/ui/Spinner';
import { Button } from '@/components/ui/Button';
import { OrderCard } from '@/components/features/OrderCard';
import { api } from '@/lib/api';
import { Order } from '@/types';

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadOrders = async () => {
    try {
      setLoading(true);
      const data = await api.get('/api/orders');
      setOrders(data?.items || []);
      setError('');
    } catch (e) {
      setError('Unable to load orders.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      <main className="mx-auto max-w-5xl space-y-6 px-4 py-10">
        <h1 className="text-3xl font-bold text-gray-900">Order History</h1>
        {loading ? (
          <div className="flex justify-center py-10"><Spinner /></div>
        ) : error ? (
          <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-center text-red-700">
            {error}
            <div className="mt-4"><Button onClick={loadOrders}>Retry</Button></div>
          </div>
        ) : orders.length === 0 ? (
          <div className="rounded-lg border border-gray-200 bg-gray-50 p-6 text-center text-gray-600">No orders yet.</div>
        ) : (
          <div className="grid gap-4">
            {orders.map((order) => (
              <OrderCard key={order.id} order={order} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
