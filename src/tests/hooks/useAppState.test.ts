
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useAppState } from '@/hooks/useAppState';

describe('useAppState', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should initialize with default state', () => {
    const { result } = renderHook(() => useAppState());

    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
    expect(result.current.currentModule).toBe('dashboard');
    expect(result.current.sidebarCollapsed).toBe(false);
  });

  it('should update loading state', () => {
    const { result } = renderHook(() => useAppState());

    act(() => {
      result.current.setLoading(true);
    });

    expect(result.current.isLoading).toBe(true);
  });

  it('should update error state', () => {
    const { result } = renderHook(() => useAppState());
    const testError = 'Test error message';

    act(() => {
      result.current.setError(testError);
    });

    expect(result.current.error).toBe(testError);
  });

  it('should update current module', () => {
    const { result } = renderHook(() => useAppState());

    act(() => {
      result.current.setCurrentModule('vendas');
    });

    expect(result.current.currentModule).toBe('vendas');
  });

  it('should toggle sidebar collapsed state', () => {
    const { result } = renderHook(() => useAppState());

    act(() => {
      result.current.setSidebarCollapsed(true);
    });

    expect(result.current.sidebarCollapsed).toBe(true);

    act(() => {
      result.current.setSidebarCollapsed(false);
    });

    expect(result.current.sidebarCollapsed).toBe(false);
  });
});
