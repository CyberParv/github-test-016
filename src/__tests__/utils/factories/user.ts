export function userFactory(overrides: Partial<any> = {}) {
  return {
    id: 'user_' + Math.random().toString(16).slice(2),
    email: 'user@example.com',
    name: 'Test User',
    role: 'USER',
    createdAt: new Date(),
    ...overrides,
  };
}

export function adminFactory(overrides: Partial<any> = {}) {
  return userFactory({
    email: 'admin@example.com',
    name: 'Admin',
    role: 'ADMIN',
    ...overrides,
  });
}
