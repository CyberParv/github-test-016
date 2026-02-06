'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Navigation } from '@/components/layout/Navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { api } from '@/lib/api';
import { useToast } from '@/providers/ToastProvider';

export default function SignupPage() {
  const { toast } = useToast();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    try {
      setLoading(true);
      await api.post('/api/auth/signup', form);
      toast({ title: 'Account created', description: 'You can now sign in.' });
    } catch (e) {
      toast({ title: 'Signup failed', description: 'Please try again.', variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      <main className="mx-auto max-w-md space-y-6 px-4 py-10">
        <h1 className="text-3xl font-bold text-gray-900">Create Account</h1>
        <div className="space-y-4 rounded-lg border border-gray-200 p-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Name</label>
            <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Email</label>
            <Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Password</label>
            <Input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
          </div>
          <Button className="w-full" onClick={handleSubmit} disabled={loading}>
            {loading ? 'Creating...' : 'Create Account'}
          </Button>
          <div className="text-sm">
            <Link href="/auth/login" className="text-amber-700 hover:underline">Already have an account?</Link>
          </div>
        </div>
      </main>
    </div>
  );
}
