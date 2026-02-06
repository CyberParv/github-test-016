import { Navigation } from '@/components/layout/Navigation';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      <main className="mx-auto max-w-4xl space-y-6 px-4 py-10">
        <h1 className="text-3xl font-bold text-gray-900">About Our Coffee</h1>
        <p className="text-gray-600">
          We are a neighborhood coffee house dedicated to thoughtful sourcing, precise roasting, and warm hospitality.
          Every drink is brewed with care to deliver a vibrant, balanced cup.
        </p>
        <div className="rounded-2xl bg-amber-50 p-6">
          <h2 className="text-xl font-semibold text-gray-900">Visit us</h2>
          <p className="text-gray-600">123 Brew Lane, Roast City</p>
          <p className="text-gray-600">Open daily 7am - 7pm</p>
        </div>
      </main>
    </div>
  );
}
