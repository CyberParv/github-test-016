'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Navigation } from '@/components/layout/Navigation';
import { Spinner } from '@/components/ui/Spinner';
import { api } from '@/lib/api';

interface Stats {
  salesToday: number;
  ordersOpen: number;
  topProducts: { productId: string; name: string; sold: number }[];
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const data = await api.get('/api/stats');
        setStats(data);
      } catch (e) {
        setError('Unable to load stats.');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      <main className="mx-auto max-w-5xl space-y-6 px-4 py-10">
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        {loading ? (
          <div className="flex justify-center py-10"><Spinner /></div>
        ) : error || !stats ? (
          <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-center text-red-700">{error || 'No stats available.'}</div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-lg border border-gray-200 p-6">
              <p className="text-sm text-gray-600">Sales Today</p>
              <p className="text-2xl font-semibold">${stats.salesToday.toFixed(2)}</p>
            </div>
            <div className="rounded-lg border border-gray-200 p-6">
              <p className="text-sm text-gray-600">Open Orders</p>
              <p className="text-2xl font-semibold">{stats.ordersOpen}</p>
            </div>
            <div className="rounded-lg border border-gray-200 p-6 sm:col-span-2">
              <p className="text-sm text-gray-600">Top Products</p>
              <ul className="mt-2 space-y-1 text-sm text-gray-700">
                {stats.topProducts.map((product) => (
                  <li key={product.productId} className="flex items-center justify-between">
                    <span>{product.name}</span>
                    <span>{product.sold}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
        <div className="flex flex-wrap gap-3">
          <Link href="/admin/menu" className="rounded-md border border-gray-200 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Manage Menu</Link>
          <Link href="/admin/orders" className="rounded-md border border-gray-200 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Manage Orders</Link>
          <Link href="/admin/reservations" className="rounded-md border border-gray-200 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Manage Reservations</Link>
        </div>
      </main>
    </div>
  );
}
