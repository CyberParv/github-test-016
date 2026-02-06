import { Navigation } from '@/components/layout/Navigation';
import { FeaturedSection } from '@/components/features/FeaturedSection';
import { HeroSection } from '@/components/features/HeroSection';
import { Spinner } from '@/components/ui/Spinner';
import { api } from '@/lib/api';
import { Product } from '@/types';

export default async function HomePage() {
  let items: Product[] = [];
  let error = '';

  try {
    const data = await api.get('/api/featured');
    items = data?.items || [];
  } catch (e) {
    error = 'Unable to load featured items.';
  }

  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      <main className="mx-auto max-w-6xl space-y-12 px-4 py-10">
        <HeroSection />
        {error ? (
          <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-center text-red-700">
            {error}
          </div>
        ) : items.length === 0 ? (
          <div className="rounded-lg border border-gray-200 bg-gray-50 p-6 text-center text-gray-600">
            No featured items right now.
          </div>
        ) : (
          <FeaturedSection items={items} />
        )}
      </main>
    </div>
  );
}
