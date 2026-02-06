import { jsonRequest, readJson } from '../utils/helpers';
import { prismaMock, resetPrismaMock } from '../utils/mocks/prisma';
import { mockNextResponseJson } from '../utils/mocks/next-server';

jest.mock('@/lib/prisma', () => ({ prisma: prismaMock }));

describe('API /api/auth/login', () => {
  beforeEach(() => {
    resetPrismaMock();
    jest.resetModules();
    mockNextResponseJson();
  });

  test('200: returns session token on valid credentials', async () => {
    prismaMock.user.findUnique.mockResolvedValue({ id: 'u1', email: 'a@b.com', passwordHash: 'hash' });

    jest.doMock('bcryptjs', () => ({ compare: jest.fn(async () => true) }));

    const { POST } = await import('@/app/api/auth/login/route');
    const req = jsonRequest('/api/auth/login', {
      method: 'POST',
      body: { email: 'a@b.com', password: 'Password123!' },
    });

    const res = await POST(req as any);
    expect(res.status).toBe(200);
    const body = await readJson(res);
    expect(body).toEqual(expect.objectContaining({ ok: true }));
  });

  test('400: rejects missing fields', async () => {
    const { POST } = await import('@/app/api/auth/login/route');
    const req = jsonRequest('/api/auth/login', { method: 'POST', body: { email: 'a@b.com' } });
    const res = await POST(req as any);
    expect(res.status).toBe(400);
  });

  test('401: rejects invalid credentials', async () => {
    prismaMock.user.findUnique.mockResolvedValue({ id: 'u1', email: 'a@b.com', passwordHash: 'hash' });
    jest.doMock('bcryptjs', () => ({ compare: jest.fn(async () => false) }));

    const { POST } = await import('@/app/api/auth/login/route');
    const req = jsonRequest('/api/auth/login', {
      method: 'POST',
      body: { email: 'a@b.com', password: 'wrong' },
    });
    const res = await POST(req as any);
    expect(res.status).toBe(401);
  });
});
