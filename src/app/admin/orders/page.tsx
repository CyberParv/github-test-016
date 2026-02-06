'use client';

import { useEffect, useState } from 'react';
import { Navigation } from '@/components/layout/Navigation';
import { Spinner } from '@/components/ui/Spinner';
import { Button } from '@/components/ui/Button';
import { api } from '@/lib/api';
import { Order } from '@/types';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = async () => {
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
    load();
  }, []);

  const updateStatus = async (id: string, status: string) => {
    await api.put(`/api/orders/${id}`, { status });
    load();
  };

  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      <main className="mx-auto max-w-6xl space-y-6 px-4 py-10">
        <h1 className="text-3xl font-bold text-gray-900">Manage Orders</h1>
        {loading ? (
          <div className="flex justify-center py-10"><Spinner /></div>
        ) : error ? (
          <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-center text-red-700">{error}</div>
        ) : orders.length === 0 ? (
          <div className="rounded-lg border border-gray-200 bg-gray-50 p-6 text-center text-gray-600">No orders found.</div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order.id} className="rounded-lg border border-gray-200 p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="font-medium text-gray-900">Order #{order.id}</p>
                    <p className="text-sm text-gray-600">{order.status}</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {['received', 'preparing', 'ready', 'completed', 'cancelled'].map((status) => (
                      <Button key={status} variant="outline" onClick={() => updateStatus(order.id, status)}>
                        {status}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
