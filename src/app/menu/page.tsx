import Link from 'next/link';
import { Navigation } from '@/components/layout/Navigation';
import { MenuCard } from '@/components/features/MenuCard';
import { api } from '@/lib/api';
import { Product, Category } from '@/types';

interface MenuPageProps {
  searchParams?: { category?: string; tag?: string; q?: string };
}

export default async function MenuPage({ searchParams }: MenuPageProps) {
  const params = new URLSearchParams();
  if (searchParams?.category) params.set('category', searchParams.category);
  if (searchParams?.tag) params.set('tag', searchParams.tag);
  if (searchParams?.q) params.set('q', searchParams.q);

  let items: Product[] = [];
  let categories: Category[] = [];
  let error = '';

  try {
    const [menuData, categoryData] = await Promise.all([
      api.get(`/api/menu${params.toString() ? `?${params.toString()}` : ''}`),
      api.get('/api/categories'),
    ]);
    items = menuData?.items || [];
    categories = categoryData?.items || [];
  } catch (e) {
    error = 'Unable to load menu items.';
  }

  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      <main className="mx-auto max-w-6xl space-y-8 px-4 py-10">
        <div className="space-y-3">
          <h1 className="text-3xl font-bold text-gray-900">Our Menu</h1>
          <p className="text-gray-600">Filter by category or search your favorite drink.</p>
          <div className="flex flex-wrap gap-2">
            <Link href="/menu" className="rounded-full border border-gray-200 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">All</Link>
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/menu?category=${category.slug}`}
                className="rounded-full border border-gray-200 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
              >
                {category.name}
              </Link>
            ))}
          </div>
        </div>
        {error ? (
          <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-center text-red-700">{error}</div>
        ) : items.length === 0 ? (
          <div className="rounded-lg border border-gray-200 bg-gray-50 p-6 text-center text-gray-600">No items found.</div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((item) => (
              <MenuCard key={item.id} item={item} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
