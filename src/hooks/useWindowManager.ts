import { create } from 'zustand';
import { nanoid } from 'nanoid';

interface Position {
  x: number;
  y: number;
}

interface Size {
  width: number;
  height: number;
}

interface Window {
  id: string;
  type: string;
  title: string;
  position: Position;
  size: Size;
  isMinimized: boolean;
  isActive: boolean;
  zIndex: number;
}

interface WindowState {
  windows: Window[];
  activeWindow: string | null;
  lastZIndex: number;
  addWindow: (window: Omit<Window, 'id' | 'isActive' | 'zIndex'>) => void;
  removeWindow: (id: string) => void;
  focusWindow: (id: string) => void;
  minimizeWindow: (id: string) => void;
  restoreWindow: (id: string) => void;
  updateWindow: (id: string, updates: Partial<Window>) => void;
  bringToFront: (id: string) => void;
}

export const useWindowManager = create<WindowState>()(set => ({
  windows: [],
  activeWindow: null,
  lastZIndex: 0,

  addWindow: window =>
    set(state => {
      const newZIndex = state.lastZIndex + 1;
      const newWindow = {
        ...window,
        id: nanoid(),
        isActive: true,
        zIndex: newZIndex,
      };

      return {
        windows: [...state.windows, newWindow],
        activeWindow: newWindow.id,
        lastZIndex: newZIndex,
      };
    }),

  removeWindow: id =>
    set(state => ({
      windows: state.windows.filter(w => w.id !== id),
      activeWindow:
        state.activeWindow === id
          ? state.windows.length > 1
            ? state.windows[state.windows.length - 2]?.id ?? null
            : null
          : state.activeWindow,
      lastZIndex: state.lastZIndex,
    })),

  focusWindow: id =>
    set(state => {
      const newZIndex = state.lastZIndex + 1;
      return {
        windows: state.windows.map(w => ({
          ...w,
          isActive: w.id === id,
          zIndex: w.id === id ? newZIndex : w.zIndex,
        })),
        activeWindow: id,
        lastZIndex: newZIndex,
      };
    }),

  minimizeWindow: id =>
    set(state => ({
      windows: state.windows.map(w =>
        w.id === id ? { ...w, isMinimized: true, isActive: false } : w
      ),
      activeWindow: state.activeWindow === id ? null : state.activeWindow,
      lastZIndex: state.lastZIndex,
    })),

  restoreWindow: id =>
    set(state => {
      const newZIndex = state.lastZIndex + 1;
      return {
        windows: state.windows.map(w =>
          w.id === id
            ? { ...w, isMinimized: false, isActive: true, zIndex: newZIndex }
            : { ...w, isActive: false }
        ),
        activeWindow: id,
        lastZIndex: newZIndex,
      };
    }),

  updateWindow: (id, updates) =>
    set(state => ({
      windows: state.windows.map(w => (w.id === id ? { ...w, ...updates } : w)),
      lastZIndex: state.lastZIndex,
    })),

  bringToFront: id =>
    set(state => {
      const newZIndex = state.lastZIndex + 1;
      return {
        windows: state.windows.map(w => ({
          ...w,
          zIndex: w.id === id ? newZIndex : w.zIndex,
          isActive: w.id === id,
        })),
        activeWindow: id,
        lastZIndex: newZIndex,
      };
    }),
}));
