export interface Position {
  x: number;
  y: number;
}

export interface Size {
  width: number;
  height: number;
}

export interface WindowType {
  id: string;
  title: string;
  type: string;
  position: {
    x: number;
    y: number;
  };
  lastPosition?: {
    x: number;
    y: number;
  };
  size: {
    width: number;
    height: number;
  };
  isMinimized: boolean;
  isDragging?: boolean;
  isResizing?: boolean;
  zIndex?: number;
  constraints?: {
    minWidth: number;
    minHeight: number;
    maxWidth?: number;
    maxHeight?: number;
  };
}

export interface DesktopIcon {
  id: string;
  title: string;
  icon: string;
  onClick: () => void;
  position?: Position;
}

export interface WindowState {
  windows: WindowType[];
  activeWindow: string | null;
  minimizedWindows: WindowType[];
  maxZIndex: number;
}

export interface DragState {
  isDragging: boolean;
  startPosition: Position;
  startMousePosition: Position;
  windowId: string | null;
}

export interface ResizeState {
  isResizing: boolean;
  resizeHandle: string | null;
  startSize: Size;
  startMousePosition: Position;
  windowId: string | null;
}
