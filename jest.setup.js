import '@testing-library/jest-dom';
import 'whatwg-fetch';

// Mock next/navigation for app router components if used
jest.mock('next/navigation', () => {
  const actual = jest.requireActual('next/navigation');
  return {
    ...actual,
    useRouter: () => ({
      push: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
      back: jest.fn(),
      forward: jest.fn(),
      refresh: jest.fn(),
    }),
    usePathname: () => '/',
    useSearchParams: () => new URLSearchParams(),
  };
});

// Mock next/image to render plain img
jest.mock('next/image', () => (props) => {
  // eslint-disable-next-line @next/next/no-img-element
  return <img alt={props.alt} {...props} />;
});

// Suppress noisy console errors in tests unless explicitly asserted
const originalError = console.error;
beforeAll(() => {
  console.error = (...args) => {
    // allow React act warnings to pass through if debugging
    if (String(args[0] || '').includes('Warning:')) return;
    originalError(...args);
  };
});

afterAll(() => {
  console.error = originalError;
});
