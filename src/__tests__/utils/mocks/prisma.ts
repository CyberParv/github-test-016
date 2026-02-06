/*
  Prisma mock helper.
  In tests, prefer importing { prisma } from '@/lib/prisma' which is mapped here.
*/

type MockFn = (...args: any[]) => any;

function mockModel() {
  return {
    findUnique: jest.fn() as unknown as MockFn,
    findFirst: jest.fn() as unknown as MockFn,
    findMany: jest.fn() as unknown as MockFn,
    create: jest.fn() as unknown as MockFn,
    update: jest.fn() as unknown as MockFn,
    upsert: jest.fn() as unknown as MockFn,
    delete: jest.fn() as unknown as MockFn,
    deleteMany: jest.fn() as unknown as MockFn,
    count: jest.fn() as unknown as MockFn,
  };
}

export const prismaMock = {
  user: mockModel(),
  menuItem: mockModel(),
  category: mockModel(),
  cart: mockModel(),
  cartItem: mockModel(),
  order: mockModel(),
  orderItem: mockModel(),
  reservation: mockModel(),
  product: mockModel(),
  $transaction: jest.fn(async (fn: any) => fn(prismaMock)),
};

export function resetPrismaMock() {
  Object.values(prismaMock).forEach((v: any) => {
    if (v && typeof v === 'object') {
      Object.values(v).forEach((fn: any) => {
        if (fn && typeof fn.mockReset === 'function') fn.mockReset();
      });
    }
  });
  prismaMock.$transaction.mockReset();
}
