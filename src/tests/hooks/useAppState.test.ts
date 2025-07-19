
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
    expect(result.current.currentView).toBe('dashboard');
    expect(result.current.sidebarOpen).toBe(false);
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

  it('should update current view', () => {
    const { result } = renderHook(() => useAppState());

    act(() => {
      result.current.setCurrentView('vendas');
    });

    expect(result.current.currentView).toBe('vendas');
  });

  it('should toggle sidebar', () => {
    const { result } = renderHook(() => useAppState());

    act(() => {
      result.current.toggleSidebar();
    });

    expect(result.current.sidebarOpen).toBe(true);

    act(() => {
      result.current.toggleSidebar();
    });

    expect(result.current.sidebarOpen).toBe(false);
  });
});
