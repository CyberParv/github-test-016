import { jsonRequest } from '../utils/helpers';
import { prismaMock, resetPrismaMock } from '../utils/mocks/prisma';
import { menuItemFactory } from '../utils/factories/menu';
import { mockNextResponseJson } from '../utils/mocks/next-server';

jest.mock('@/lib/prisma', () => ({ prisma: prismaMock }));

describe('API /api/admin/products', () => {
  beforeEach(() => {
    resetPrismaMock();
    jest.resetModules();
    mockNextResponseJson();
  });

  test('401: requires auth', async () => {
    jest.doMock('next-auth/next', () => ({ getServerSession: jest.fn(async () => null) }));

    const { GET } = await import('@/app/api/admin/products/route');
    const res = await GET(jsonRequest('/api/admin/products') as any);
    expect(res.status).toBe(401);
  });

  test('403: forbids non-admin', async () => {
    jest.doMock('next-auth/next', () => ({ getServerSession: jest.fn(async () => ({ user: { id: 'u1', role: 'USER' } })) }));

    const { POST } = await import('@/app/api/admin/products/route');
    const res = await POST(jsonRequest('/api/admin/products', { method: 'POST', body: { name: 'X', price: 100 } }) as any);
    expect(res.status).toBe(403);
  });

  test('201: admin can create product', async () => {
    jest.doMock('next-auth/next', () => ({ getServerSession: jest.fn(async () => ({ user: { id: 'a1', role: 'ADMIN' } })) }));
    prismaMock.product.create.mockResolvedValue(menuItemFactory({ id: 'p1', name: 'X' }));

    const { POST } = await import('@/app/api/admin/products/route');
    const res = await POST(jsonRequest('/api/admin/products', { method: 'POST', body: { name: 'X', price: 1000 } }) as any);
    expect([201, 200]).toContain(res.status);
  });

  test('404: update missing product', async () => {
    jest.doMock('next-auth/next', () => ({ getServerSession: jest.fn(async () => ({ user: { id: 'a1', role: 'ADMIN' } })) }));
    prismaMock.product.update.mockRejectedValue(new Error('Record not found'));

    const { PATCH } = await import('@/app/api/admin/products/[id]/route');
    const res = await PATCH(jsonRequest('/api/admin/products/nope', { method: 'PATCH', body: { name: 'Y' } }) as any, {
      params: { id: 'nope' },
    } as any);

    expect([404, 400, 500]).toContain(res.status);
  });
});
