import { Navigation } from '@/components/layout/Navigation';
import { api } from '@/lib/api';
import { Product } from '@/types';

export default async function GalleryPage() {
  let items: Product[] = [];
  let error = '';

  try {
    const data = await api.get('/api/menu');
    items = data?.items || [];
  } catch (e) {
    error = 'Unable to load gallery.';
  }

  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      <main className="mx-auto max-w-6xl space-y-8 px-4 py-10">
        <h1 className="text-3xl font-bold text-gray-900">Gallery</h1>
        {error ? (
          <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-center text-red-700">{error}</div>
        ) : items.length === 0 ? (
          <div className="rounded-lg border border-gray-200 bg-gray-50 p-6 text-center text-gray-600">No photos yet.</div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((item) => (
              <div key={item.id} className="aspect-[4/3] overflow-hidden rounded-xl bg-gray-100">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={item.imageUrl} alt={item.name} className="h-full w-full object-cover" />
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
