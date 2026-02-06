'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Navigation } from '@/components/layout/Navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useToast } from '@/providers/ToastProvider';

export default function ForgotPasswordPage() {
  const { toast } = useToast();
  const [email, setEmail] = useState('');

  const handleSubmit = () => {
    toast({ title: 'Request received', description: 'Please check your email for reset instructions.' });
  };

  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      <main className="mx-auto max-w-md space-y-6 px-4 py-10">
        <h1 className="text-3xl font-bold text-gray-900">Reset Password</h1>
        <div className="space-y-4 rounded-lg border border-gray-200 p-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Email</label>
            <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <Button className="w-full" onClick={handleSubmit}>Send Reset Link</Button>
          <Link href="/auth/login" className="text-sm text-amber-700 hover:underline">Back to login</Link>
        </div>
      </main>
    </div>
  );
}
