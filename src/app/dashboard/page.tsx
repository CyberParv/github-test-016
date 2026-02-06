'use client';

import { Navigation } from '@/components/layout/Navigation';
import { useAuth } from '@/providers/AuthProvider';
import Link from 'next/link';

export default function DashboardPage() {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="min-h-screen bg-white">
        <Navigation />
        <main className="mx-auto max-w-3xl px-4 py-10 text-center">
          <p className="text-gray-600">Please sign in to access your dashboard.</p>
          <Link href="/auth/login" className="text-amber-700 hover:underline">Go to login</Link>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      <main className="mx-auto max-w-4xl space-y-6 px-4 py-10">
        <h1 className="text-3xl font-bold text-gray-900">Welcome back, {user.name}</h1>
        <div className="grid gap-4 sm:grid-cols-2">
          <Link href="/dashboard/orders" className="rounded-lg border border-gray-200 p-6 hover:bg-gray-50">
            <h2 className="text-lg font-semibold text-gray-900">Order History</h2>
            <p className="text-sm text-gray-600">Track your past orders.</p>
          </Link>
          <Link href="/dashboard/profile" className="rounded-lg border border-gray-200 p-6 hover:bg-gray-50">
            <h2 className="text-lg font-semibold text-gray-900">Profile Settings</h2>
            <p className="text-sm text-gray-600">Manage your contact info.</p>
          </Link>
        </div>
      </main>
    </div>
  );
}
