'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { useToast } from '@/providers/ToastProvider';
import { api } from '@/lib/api';
import { Product } from '@/types';

interface MenuCardProps {
  item: Product;
}

export function MenuCard({ item }: MenuCardProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const handleAddToCart = async () => {
    try {
      setLoading(true);
      await api.post('/api/cart', { items: [{ productId: item.id, quantity: 1 }] });
      toast({ title: 'Added to cart', description: `${item.name} added to your cart.` });
    } catch (e) {
      toast({ title: 'Unable to add', description: 'Please try again.', variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="flex flex-col">
      <CardHeader className="space-y-2">
        <div className="relative aspect-[4/3] overflow-hidden rounded-md bg-gray-100">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={item.imageUrl} alt={item.name} className="h-full w-full object-cover" />
        </div>
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">{item.name}</h3>
          <span className="text-lg font-bold text-amber-700">${item.price?.toFixed(2)}</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {item.tags?.map((tag) => (
            <Badge key={tag} variant="secondary">{tag}</Badge>
          ))}
        </div>
      </CardHeader>
      <CardContent className="flex-1">
        <p className="text-sm text-gray-600 line-clamp-3">{item.description}</p>
      </CardContent>
      <CardFooter className="flex gap-2">
        <Link href={`/menu/${item.id}`} className="flex-1">
          <Button variant="outline" className="w-full">View</Button>
        </Link>
        <Button className="flex-1" onClick={handleAddToCart} disabled={loading || !item.available}>
          {item.available ? (loading ? 'Adding...' : 'Add') : 'Sold out'}
        </Button>
      </CardFooter>
    </Card>
  );
}
