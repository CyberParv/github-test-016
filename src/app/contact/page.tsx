'use client';

import { useState } from 'react';
import { Navigation } from '@/components/layout/Navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useToast } from '@/providers/ToastProvider';

export default function ContactPage() {
  const { toast } = useToast();
  const [form, setForm] = useState({ name: '', email: '', message: '' });

  const handleSubmit = () => {
    toast({ title: 'Message sent', description: 'We will get back to you soon.' });
  };

  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      <main className="mx-auto max-w-3xl space-y-8 px-4 py-10">
        <h1 className="text-3xl font-bold text-gray-900">Contact Us</h1>
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
            <label className="text-sm font-medium text-gray-700">Message</label>
            <Input value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />
          </div>
          <Button className="w-full" onClick={handleSubmit}>Send Message</Button>
        </div>
      </main>
    </div>
  );
}
