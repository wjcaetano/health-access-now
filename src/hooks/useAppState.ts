
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AppState {
  // Estados globais da aplicação
  isLoading: boolean;
  error: string | null;
  
  // Estados de UI
  sidebarCollapsed: boolean;
  currentModule: string;
  
  // Cache temporário
  lastUpdated: Date | null;
  
  // Actions
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  setCurrentModule: (module: string) => void;
  updateLastUpdated: () => void;
  clearCache: () => void;
}

export const useAppState = create<AppState>()(
  persist(
    (set, get) => ({
      // Estados iniciais
      isLoading: false,
      error: null,
      sidebarCollapsed: false,
      currentModule: 'dashboard',
      lastUpdated: null,
      
      // Actions
      setLoading: (loading: boolean) => set({ isLoading: loading }),
      setError: (error: string | null) => set({ error }),
      setSidebarCollapsed: (collapsed: boolean) => set({ sidebarCollapsed: collapsed }),
      setCurrentModule: (module: string) => set({ currentModule: module }),
      updateLastUpdated: () => set({ lastUpdated: new Date() }),
      clearCache: () => set({ 
        lastUpdated: null,
        error: null 
      }),
    }),
    {
      name: 'agendaja-app-state',
      partialize: (state) => ({
        sidebarCollapsed: state.sidebarCollapsed,
        currentModule: state.currentModule,
      }),
    }
  )
);
