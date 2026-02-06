import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Order } from '@/types';

interface OrderCardProps {
  order: Order;
}

export function OrderCard({ order }: OrderCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <p className="text-sm text-gray-600">Order #{order.id}</p>
          <p className="text-sm text-gray-500">{new Date(order.createdAt).toLocaleString()}</p>
        </div>
        <Badge>{order.status}</Badge>
      </CardHeader>
      <CardContent className="space-y-2">
        {order.items?.map((item) => (
          <div key={item.productId} className="flex items-center justify-between text-sm">
            <span>{item.name} x{item.quantity}</span>
            <span>${(item.price * item.quantity).toFixed(2)}</span>
          </div>
        ))}
      </CardContent>
      <CardFooter className="flex items-center justify-between">
        <p className="text-sm text-gray-600">{order.pickupOrDelivery}</p>
        <p className="text-lg font-semibold">${order.total?.toFixed(2)}</p>
      </CardFooter>
    </Card>
  );
}
