'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Navigation } from '@/components/layout/Navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { api } from '@/lib/api';
import { useToast } from '@/providers/ToastProvider';

export default function LoginPage() {
  const { toast } = useToast();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    try {
      setLoading(true);
      await api.post('/api/auth/login', form);
      toast({ title: 'Welcome back', description: 'You are now signed in.' });
    } catch (e) {
      toast({ title: 'Login failed', description: 'Check your credentials.', variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      <main className="mx-auto max-w-md space-y-6 px-4 py-10">
        <h1 className="text-3xl font-bold text-gray-900">Sign In</h1>
        <div className="space-y-4 rounded-lg border border-gray-200 p-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Email</label>
            <Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Password</label>
            <Input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
          </div>
          <Button className="w-full" onClick={handleSubmit} disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </Button>
          <div className="flex items-center justify-between text-sm">
            <Link href="/auth/forgot-password" className="text-amber-700 hover:underline">Forgot password?</Link>
            <Link href="/auth/signup" className="text-amber-700 hover:underline">Create account</Link>
          </div>
        </div>
      </main>
    </div>
  );
}
