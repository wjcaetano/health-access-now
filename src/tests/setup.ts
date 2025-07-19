
import { expect, afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';
import * as matchers from '@testing-library/jest-dom/matchers';

// Extend Vitest's expect with jest-dom matchers
expect.extend(matchers);

// Mock do Supabase
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn().mockReturnThis(),
      insert: vi.fn().mockReturnThis(),
      update: vi.fn().mockReturnThis(),
      delete: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn().mockReturnThis(),
      order: vi.fn().mockReturnThis(),
      limit: vi.fn().mockReturnThis(),
    })),
    auth: {
      getUser: vi.fn(),
      signIn: vi.fn(),
      signOut: vi.fn(),
    },
  },
}));

// Mock do React Router
vi.mock('react-router-dom', () => ({
  useNavigate: vi.fn(() => vi.fn()),
  useLocation: vi.fn(() => ({ pathname: '/' })),
  BrowserRouter: ({ children }: { children: React.ReactNode }) => children,
  Routes: ({ children }: { children: React.ReactNode }) => children,
  Route: ({ children }: { children: React.ReactNode }) => children,
  Navigate: ({ children }: { children?: React.ReactNode }) => children || null,
}));

// Mock do useToast
vi.mock('@/hooks/use-toast', () => ({
  useToast: vi.fn(() => ({
    toast: vi.fn(),
  })),
}));

// Cleanup after each test
afterEach(() => {
  cleanup();
});
