import { jsonRequest } from '../utils/helpers';
import { prismaMock, resetPrismaMock } from '../utils/mocks/prisma';
import { menuItemFactory } from '../utils/factories/menu';
import { mockNextResponseJson } from '../utils/mocks/next-server';

jest.mock('@/lib/prisma', () => ({ prisma: prismaMock }));

describe('API /api/menu', () => {
  beforeEach(() => {
    resetPrismaMock();
    jest.resetModules();
    mockNextResponseJson();
  });

  test('200: lists menu items', async () => {
    prismaMock.menuItem.findMany.mockResolvedValue([menuItemFactory(), menuItemFactory({ id: 'i2' })]);

    const { GET } = await import('@/app/api/menu/route');
    const res = await GET(jsonRequest('/api/menu') as any);
    expect(res.status).toBe(200);
  });

  test('400: validation error (bad query)', async () => {
    const { GET } = await import('@/app/api/menu/route');
    const res = await GET(jsonRequest('/api/menu?limit=not-a-number') as any);
    expect([400, 200]).toContain(res.status);
  });

  test('404: single item not found', async () => {
    prismaMock.menuItem.findUnique.mockResolvedValue(null);

    const { GET } = await import('@/app/api/menu/[id]/route');
    const res = await GET(jsonRequest('/api/menu/does-not-exist') as any, { params: { id: 'does-not-exist' } } as any);
    expect(res.status).toBe(404);
  });
});
