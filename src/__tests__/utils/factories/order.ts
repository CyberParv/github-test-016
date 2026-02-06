export function orderFactory(overrides: Partial<any> = {}) {
  return {
    id: 'ord_' + Math.random().toString(16).slice(2),
    userId: 'user_1',
    status: 'PENDING',
    total: 2598,
    createdAt: new Date(),
    ...overrides,
  };
}
