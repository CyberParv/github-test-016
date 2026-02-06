import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Review } from '@/types';

interface ReviewCardProps {
  review: Review;
}

export function ReviewCard({ review }: ReviewCardProps) {
  return (
    <Card>
      <CardContent className="space-y-2">
        <div className="flex items-center justify-between">
          <Badge>{review.rating} / 5</Badge>
          <span className="text-xs text-gray-500">{new Date(review.createdAt).toLocaleDateString()}</span>
        </div>
        <p className="text-sm text-gray-700">{review.comment || 'No comment provided.'}</p>
      </CardContent>
    </Card>
  );
}
