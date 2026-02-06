import { jsonRequest, readJson } from '../utils/helpers';
import { prismaMock, resetPrismaMock } from '../utils/mocks/prisma';
import { mockNextResponseJson } from '../utils/mocks/next-server';

jest.mock('@/lib/prisma', () => ({ prisma: prismaMock }));

describe('API /api/auth/signup', () => {
  beforeEach(() => {
    resetPrismaMock();
    jest.resetModules();
    mockNextResponseJson();
  });

  test('201: creates user with valid payload', async () => {
    prismaMock.user.findUnique.mockResolvedValue(null);
    prismaMock.user.create.mockResolvedValue({ id: 'u1', email: 'a@b.com' });

    const { POST } = await import('@/app/api/auth/signup/route');
    const req = jsonRequest('/api/auth/signup', {
      method: 'POST',
      body: { email: 'a@b.com', password: 'Password123!', name: 'A' },
    });

    const res = await POST(req as any);
    expect(res.status).toBe(201);
    const body = await readJson(res);
    expect(body).toEqual(expect.objectContaining({ user: expect.anything() }));
    expect(prismaMock.user.create).toHaveBeenCalled();
  });

  test('400: rejects invalid payload', async () => {
    const { POST } = await import('@/app/api/auth/signup/route');
    const req = jsonRequest('/api/auth/signup', { method: 'POST', body: { email: 'not-an-email' } });

    const res = await POST(req as any);
    expect(res.status).toBe(400);
  });

  test('403: rejects signup when email already exists', async () => {
    prismaMock.user.findUnique.mockResolvedValue({ id: 'existing', email: 'a@b.com' });

    const { POST } = await import('@/app/api/auth/signup/route');
    const req = jsonRequest('/api/auth/signup', {
      method: 'POST',
      body: { email: 'a@b.com', password: 'Password123!', name: 'A' },
    });

    const res = await POST(req as any);
    expect(res.status).toBe(403);
  });
});
