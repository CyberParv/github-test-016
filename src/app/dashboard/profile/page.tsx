'use client';

import { useState } from 'react';
import { Navigation } from '@/components/layout/Navigation';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/providers/AuthProvider';
import { useToast } from '@/providers/ToastProvider';

export default function ProfilePage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [form, setForm] = useState({ name: user?.name || '', phone: user?.phone || '', address: user?.address || '' });

  if (!user) {
    return (
      <div className="min-h-screen bg-white">
        <Navigation />
        <main className="mx-auto max-w-3xl px-4 py-10 text-center text-gray-600">Please sign in to manage your profile.</main>
      </div>
    );
  }

  const handleSave = () => {
    toast({ title: 'Profile updated', description: 'Your changes have been saved.' });
  };

  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      <main className="mx-auto max-w-3xl space-y-6 px-4 py-10">
        <h1 className="text-3xl font-bold text-gray-900">Profile Settings</h1>
        <div className="space-y-4 rounded-lg border border-gray-200 p-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Name</label>
            <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Phone</label>
            <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Address</label>
            <Input value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
          </div>
          <Button className="w-full" onClick={handleSave}>Save Changes</Button>
        </div>
      </main>
    </div>
  );
}
