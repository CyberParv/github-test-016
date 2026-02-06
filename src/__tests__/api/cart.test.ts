import { jsonRequest, readJson } from '../utils/helpers';
import { prismaMock, resetPrismaMock } from '../utils/mocks/prisma';
import { menuItemFactory } from '../utils/factories/menu';
import { mockNextResponseJson } from '../utils/mocks/next-server';

jest.mock('@/lib/prisma', () => ({ prisma: prismaMock }));

const mockSession = (userId?: string, role: 'USER' | 'ADMIN' = 'USER') =>
  userId
    ? { user: { id: userId, email: 'u@e.com', role } }
    : null;

describe('API /api/cart', () => {
  beforeEach(() => {
    resetPrismaMock();
    jest.resetModules();
    mockNextResponseJson();
  });

  test('401: requires auth', async () => {
    jest.doMock('next-auth/next', () => ({ getServerSession: jest.fn(async () => null) }));

    const { GET } = await import('@/app/api/cart/route');
    const res = await GET(jsonRequest('/api/cart') as any);
    expect(res.status).toBe(401);
  });

  test('200: gets current user cart', async () => {
    jest.doMock('next-auth/next', () => ({ getServerSession: jest.fn(async () => mockSession('u1')) }));
    prismaMock.cart.findFirst.mockResolvedValue({ id: 'c1', userId: 'u1' });
    prismaMock.cartItem.findMany.mockResolvedValue([
      { id: 'ci1', cartId: 'c1', menuItemId: 'm1', quantity: 1, menuItem: menuItemFactory({ id: 'm1' }) },
    ]);

    const { GET } = await import('@/app/api/cart/route');
    const res = await GET(jsonRequest('/api/cart') as any);
    expect(res.status).toBe(200);
    const body = await readJson(res);
    expect(body).toEqual(expect.objectContaining({ items: expect.any(Array) }));
  });

  test('400: add item validation error', async () => {
    jest.doMock('next-auth/next', () => ({ getServerSession: jest.fn(async () => mockSession('u1')) }));

    const { POST } = await import('@/app/api/cart/items/route');
    const res = await POST(jsonRequest('/api/cart/items', { method: 'POST', body: { menuItemId: '', quantity: -1 } }) as any);
    expect(res.status).toBe(400);
  });
});
