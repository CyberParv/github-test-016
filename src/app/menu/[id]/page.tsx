import { Navigation } from '@/components/layout/Navigation';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { ReviewCard } from '@/components/features/ReviewCard';
import { api } from '@/lib/api';
import { Product, Review } from '@/types';

interface MenuDetailPageProps {
  params: { id: string };
}

export default async function MenuDetailPage({ params }: MenuDetailPageProps) {
  let product: Product | null = null;
  let reviews: Review[] = [];
  let error = '';

  try {
    product = await api.get(`/api/menu/${params.id}`);
    const reviewData = await api.get(`/api/reviews?productId=${params.id}`);
    reviews = reviewData?.items || [];
  } catch (e) {
    error = 'Unable to load product.';
  }

  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      <main className="mx-auto max-w-5xl space-y-10 px-4 py-10">
        {error || !product ? (
          <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-center text-red-700">{error || 'Product not found.'}</div>
        ) : (
          <>
            <div className="grid gap-8 lg:grid-cols-2">
              <div className="aspect-[4/3] overflow-hidden rounded-2xl bg-gray-100">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={product.imageUrl} alt={product.name} className="h-full w-full object-cover" />
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  {product.tags?.map((tag) => (
                    <Badge key={tag} variant="secondary">{tag}</Badge>
                  ))}
                </div>
                <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
                <p className="text-gray-600">{product.description}</p>
                <p className="text-2xl font-semibold text-amber-700">${product.price?.toFixed(2)}</p>
                <Button className="w-full" disabled={!product.available}>Add to Cart</Button>
              </div>
            </div>
            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-gray-900">Reviews</h2>
              {reviews.length === 0 ? (
                <div className="rounded-lg border border-gray-200 bg-gray-50 p-6 text-center text-gray-600">No reviews yet.</div>
              ) : (
                <div className="grid gap-4 md:grid-cols-2">
                  {reviews.map((review) => (
                    <ReviewCard key={review.id} review={review} />
                  ))}
                </div>
              )}
            </section>
          </>
        )}
      </main>
    </div>
  );
}
