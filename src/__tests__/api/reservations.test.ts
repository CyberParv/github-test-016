import { jsonRequest } from '../utils/helpers';
import { prismaMock, resetPrismaMock } from '../utils/mocks/prisma';
import { reservationFactory } from '../utils/factories/reservation';
import { mockNextResponseJson } from '../utils/mocks/next-server';

jest.mock('@/lib/prisma', () => ({ prisma: prismaMock }));

describe('API /api/reservations', () => {
  beforeEach(() => {
    resetPrismaMock();
    jest.resetModules();
    mockNextResponseJson();
  });

  test('401: requires auth to create reservation', async () => {
    jest.doMock('next-auth/next', () => ({ getServerSession: jest.fn(async () => null) }));

    const { POST } = await import('@/app/api/reservations/route');
    const res = await POST(
      jsonRequest('/api/reservations', { method: 'POST', body: { partySize: 2, dateTime: new Date().toISOString() } }) as any
    );
    expect(res.status).toBe(401);
  });

  test('201: creates reservation', async () => {
    jest.doMock('next-auth/next', () => ({ getServerSession: jest.fn(async () => ({ user: { id: 'u1', role: 'USER' } })) }));
    prismaMock.reservation.create.mockResolvedValue(reservationFactory({ userId: 'u1' }));

    const { POST } = await import('@/app/api/reservations/route');
    const res = await POST(
      jsonRequest('/api/reservations', {
        method: 'POST',
        body: { name: 'Test', phone: '555-0100', partySize: 2, dateTime: new Date().toISOString() },
      }) as any
    );
    expect([201, 200]).toContain(res.status);
  });

  test('400: validation error for partySize', async () => {
    jest.doMock('next-auth/next', () => ({ getServerSession: jest.fn(async () => ({ user: { id: 'u1', role: 'USER' } })) }));

    const { POST } = await import('@/app/api/reservations/route');
    const res = await POST(jsonRequest('/api/reservations', { method: 'POST', body: { partySize: 0 } }) as any);
    expect(res.status).toBe(400);
  });
});
