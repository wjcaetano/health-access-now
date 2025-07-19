
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useAppState } from '@/hooks/useAppState';

describe('useAppState', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Limpar localStorage
    localStorage.clear();
  });

  it('should initialize with default state', () => {
    const { result } = renderHook(() => useAppState('test', { value: 0 }));

    expect(result.current.state).toEqual({ value: 0 });
    expect(typeof result.current.setState).toBe('function');
    expect(typeof result.current.resetState).toBe('function');
  });

  it('should update state correctly', () => {
    const { result } = renderHook(() => useAppState('test', { value: 0 }));

    act(() => {
      result.current.setState({ value: 1 });
    });

    expect(result.current.state).toEqual({ value: 1 });
  });

  it('should reset state to initial value', () => {
    const { result } = renderHook(() => useAppState('test', { value: 0 }));

    act(() => {
      result.current.setState({ value: 1 });
    });

    expect(result.current.state).toEqual({ value: 1 });

    act(() => {
      result.current.resetState();
    });

    expect(result.current.state).toEqual({ value: 0 });
  });

  it('should persist state in localStorage', () => {
    const { result } = renderHook(() => useAppState('test-persist', { value: 0 }));

    act(() => {
      result.current.setState({ value: 42 });
    });

    // Verificar se foi salvo no localStorage
    const stored = localStorage.getItem('appState_test-persist');
    expect(JSON.parse(stored || '{}')).toEqual({ value: 42 });
  });

  it('should load state from localStorage on initialization', () => {
    // Pré-popular localStorage
    localStorage.setItem('appState_test-load', JSON.stringify({ value: 99 }));

    const { result } = renderHook(() => useAppState('test-load', { value: 0 }));

    expect(result.current.state).toEqual({ value: 99 });
  });
});
