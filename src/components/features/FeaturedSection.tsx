import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { MenuCard } from '@/components/features/MenuCard';
import { Product } from '@/types';

interface FeaturedSectionProps {
  items: Product[];
}

export function FeaturedSection({ items }: FeaturedSectionProps) {
  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-gray-900">Featured favorites</h2>
        <Link href="/menu">
          <Button variant="outline">View all</Button>
        </Link>
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <MenuCard key={item.id} item={item} />
        ))}
      </div>
    </section>
  );
}
