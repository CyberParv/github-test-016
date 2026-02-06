import Link from 'next/link';
import { Button } from '@/components/ui/Button';

export function HeroSection() {
  return (
    <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-amber-50 via-white to-amber-100 px-6 py-16 md:px-12">
      <div className="mx-auto flex max-w-6xl flex-col gap-10 md:flex-row md:items-center">
        <div className="flex-1 space-y-6">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-600">Freshly roasted daily</p>
          <h1 className="text-4xl font-bold text-gray-900 md:text-5xl">Savor the craft of every cup.</h1>
          <p className="text-lg text-gray-600">
            Discover small-batch roasts, seasonal pastries, and signature blends crafted for every moment.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="/menu">
              <Button size="lg">Explore Menu</Button>
            </Link>
            <Link href="/reservations">
              <Button variant="outline" size="lg">Reserve a Table</Button>
            </Link>
          </div>
        </div>
        <div className="flex-1">
          <div className="aspect-[4/3] w-full overflow-hidden rounded-2xl bg-amber-200">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/hero-coffee.jpg" alt="Coffee poured into cup" className="h-full w-full object-cover" />
          </div>
        </div>
      </div>
    </section>
  );
}
