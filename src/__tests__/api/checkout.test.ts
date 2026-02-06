import { jsonRequest } from '../utils/helpers';
import { prismaMock, resetPrismaMock } from '../utils/mocks/prisma';
import { mockNextResponseJson } from '../utils/mocks/next-server';

jest.mock('@/lib/prisma', () => ({ prisma: prismaMock }));

describe('API /api/checkout', () => {
  beforeEach(() => {
    resetPrismaMock();
    jest.resetModules();
    mockNextResponseJson();
  });

  test('401: requires auth', async () => {
    jest.doMock('next-auth/next', () => ({ getServerSession: jest.fn(async () => null) }));

    const { POST } = await import('@/app/api/checkout/route');
    const res = await POST(jsonRequest('/api/checkout', { method: 'POST', body: {} }) as any);
    expect(res.status).toBe(401);
  });

  test('201: creates order from cart', async () => {
    jest.doMock('next-auth/next', () => ({ getServerSession: jest.fn(async () => ({ user: { id: 'u1', role: 'USER' } })) }));

    prismaMock.cart.findFirst.mockResolvedValue({ id: 'c1', userId: 'u1' });
    prismaMock.cartItem.findMany.mockResolvedValue([{ id: 'ci1', cartId: 'c1', menuItemId: 'm1', quantity: 2, menuItem: { id: 'm1', price: 1000 } }]);
    prismaMock.order.create.mockResolvedValue({ id: 'o1' });
    prismaMock.cartItem.deleteMany.mockResolvedValue({ count: 1 });

    const { POST } = await import('@/app/api/checkout/route');
    const res = await POST(jsonRequest('/api/checkout', { method: 'POST', body: { paymentMethod: 'COD' } }) as any);
    expect([201, 200]).toContain(res.status);
  });

  test('400: validation error missing payment method', async () => {
    jest.doMock('next-auth/next', () => ({ getServerSession: jest.fn(async () => ({ user: { id: 'u1', role: 'USER' } })) }));

    const { POST } = await import('@/app/api/checkout/route');
    const res = await POST(jsonRequest('/api/checkout', { method: 'POST', body: {} }) as any);
    expect(res.status).toBe(400);
  });
});
