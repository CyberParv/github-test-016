'use client';

import { useEffect, useState } from 'react';
import { Navigation } from '@/components/layout/Navigation';
import { Spinner } from '@/components/ui/Spinner';
import { Button } from '@/components/ui/Button';
import { api } from '@/lib/api';
import { Reservation } from '@/types';

export default function AdminReservationsPage() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = async () => {
    try {
      setLoading(true);
      const data = await api.get('/api/reservations');
      setReservations(data?.items || []);
      setError('');
    } catch (e) {
      setError('Unable to load reservations.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const updateStatus = async (id: string, status: string) => {
    await api.put(`/api/reservations/${id}`, { status });
    load();
  };

  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      <main className="mx-auto max-w-5xl space-y-6 px-4 py-10">
        <h1 className="text-3xl font-bold text-gray-900">Manage Reservations</h1>
        {loading ? (
          <div className="flex justify-center py-10"><Spinner /></div>
        ) : error ? (
          <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-center text-red-700">{error}</div>
        ) : reservations.length === 0 ? (
          <div className="rounded-lg border border-gray-200 bg-gray-50 p-6 text-center text-gray-600">No reservations.</div>
        ) : (
          <div className="space-y-4">
            {reservations.map((res) => (
              <div key={res.id} className="rounded-lg border border-gray-200 p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="font-medium text-gray-900">{res.name}</p>
                    <p className="text-sm text-gray-600">{res.date} at {res.time} • Party of {res.partySize}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={() => updateStatus(res.id, 'confirmed')}>Confirm</Button>
                    <Button variant="destructive" onClick={() => updateStatus(res.id, 'cancelled')}>Cancel</Button>
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
