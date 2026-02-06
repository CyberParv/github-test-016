export function reservationFactory(overrides: Partial<any> = {}) {
  return {
    id: 'res_' + Math.random().toString(16).slice(2),
    userId: 'user_1',
    name: 'Test User',
    phone: '555-0100',
    partySize: 2,
    dateTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    notes: 'Window seat',
    createdAt: new Date(),
    ...overrides,
  };
}
