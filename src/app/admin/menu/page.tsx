'use client';

import { useEffect, useState } from 'react';
import { Navigation } from '@/components/layout/Navigation';
import { Button } from '@/components/ui/Button';
import { Spinner } from '@/components/ui/Spinner';
import { Input } from '@/components/ui/Input';
import { api } from '@/lib/api';
import { Product } from '@/types';

export default function AdminMenuPage() {
  const [items, setItems] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');

  const load = async () => {
    try {
      setLoading(true);
      const data = await api.get(`/api/menu${search ? `?q=${search}` : ''}`);
      setItems(data?.items || []);
      setError('');
    } catch (e) {
      setError('Unable to load menu.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      <main className="mx-auto max-w-6xl space-y-6 px-4 py-10">
        <h1 className="text-3xl font-bold text-gray-900">Manage Menu</h1>
        <div className="flex flex-wrap gap-3">
          <Input placeholder="Search menu" value={search} onChange={(e) => setSearch(e.target.value)} />
          <Button onClick={load}>Search</Button>
        </div>
        {loading ? (
          <div className="flex justify-center py-10"><Spinner /></div>
        ) : error ? (
          <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-center text-red-700">{error}</div>
        ) : items.length === 0 ? (
          <div className="rounded-lg border border-gray-200 bg-gray-50 p-6 text-center text-gray-600">No menu items.</div>
        ) : (
          <div className="grid gap-4">
            {items.map((item) => (
              <div key={item.id} className="flex flex-col gap-3 rounded-lg border border-gray-200 p-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="font-medium text-gray-900">{item.name}</p>
                  <p className="text-sm text-gray-600">${item.price?.toFixed(2)}</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline">Edit</Button>
                  <Button variant="destructive">Delete</Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
