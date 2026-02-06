export const mockSessionUser = {
  id: 'user_1',
  email: 'user@example.com',
  name: 'Test User',
  role: 'USER',
};

export const mockAdminUser = {
  id: 'admin_1',
  email: 'admin@example.com',
  name: 'Admin',
  role: 'ADMIN',
};

export function mockGetServerSession(session: any) {
  jest.doMock('next-auth', () => ({
    __esModule: true,
    getServerSession: jest.fn(async () => session),
  }));
  jest.doMock('next-auth/next', () => ({
    __esModule: true,
    getServerSession: jest.fn(async () => session),
  }));
}

export function mockUseSession(session: any) {
  jest.doMock('next-auth/react', () => ({
    __esModule: true,
    useSession: () => ({ data: session, status: session ? 'authenticated' : 'unauthenticated' }),
    signIn: jest.fn(),
    signOut: jest.fn(),
  }));
}
