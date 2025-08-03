'use client';

import type { WindowType, DragState, ResizeState } from '@/types/desktop';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Minus } from 'lucide-react';
import WindowContent from './window-content';
import { useState, useEffect, useCallback, useRef } from 'react';

interface WindowManagerProps {
  windows: WindowType[];
  minimizedWindows: WindowType[];
  activeWindow: string | null;
  onClose: (id: string) => void;
  onMinimize: (id: string) => void;
  onFocus: (id: string) => void;
  setWindows: React.Dispatch<React.SetStateAction<WindowType[]>>;
}

export default function WindowManager({
  windows,
  activeWindow,
  onClose,
  onMinimize,
  onFocus,
  setWindows,
}: WindowManagerProps) {
  const [dragState, setDragState] = useState<DragState>({
    isDragging: false,
    startPosition: { x: 0, y: 0 },
    startMousePosition: { x: 0, y: 0 },
    windowId: null,
  });

  const [resizeState, setResizeState] = useState<ResizeState>({
    isResizing: false,
    resizeHandle: null,
    startSize: { width: 0, height: 0 },
    startMousePosition: { x: 0, y: 0 },
    windowId: null,
  });

  const animationFrameRef = useRef<number>();

  const getScreenConstraints = useCallback(() => {
    const taskbarHeight = 48;
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;
    const minVisible = 50;

    return {
      minX: -(1200 - minVisible),
      maxX: screenWidth - minVisible,
      minY: 0,
      maxY: screenHeight - taskbarHeight - minVisible,
    };
  }, []);

  const updateWindowPosition = useCallback(
    (windowId: string, newPosition: { x: number; y: number }) => {
      const constraints = getScreenConstraints();
      const window = windows.find(w => w.id === windowId);
      if (!window) return;

      const clampedPosition = {
        x: Math.max(
          constraints.minX,
          Math.min(newPosition.x, constraints.maxX)
        ),
        y: Math.max(
          constraints.minY,
          Math.min(newPosition.y, constraints.maxY)
        ),
      };

      setWindows(prev =>
        prev.map(w =>
          w.id === windowId ? { ...w, position: clampedPosition } : w
        )
      );
    },
    [windows, setWindows, getScreenConstraints]
  );

  const updateWindowSize = useCallback(
    (windowId: string, newSize: { width: number; height: number }) => {
      const window = windows.find(w => w.id === windowId);
      if (!window) return;

      const constraints = window.constraints || {
        minWidth: 400,
        minHeight: 300,
        maxWidth: globalThis.window.innerWidth * 0.95,
        maxHeight: globalThis.window.innerHeight * 0.9,
      };

      const clampedSize = {
        width: Math.max(
          constraints.minWidth,
          Math.min(newSize.width, constraints.maxWidth || Infinity)
        ),
        height: Math.max(
          constraints.minHeight,
          Math.min(newSize.height, constraints.maxHeight || Infinity)
        ),
      };

      setWindows(prev =>
        prev.map(w => (w.id === windowId ? { ...w, size: clampedSize } : w))
      );
    },
    [windows, setWindows]
  );

  const handleDragStart = useCallback(
    (e: React.MouseEvent, windowId: string) => {
      const target = e.target as HTMLElement;

      const isHeader =
        target.classList.contains('window-header') ||
        target.closest('.window-header') ||
        target.closest('[data-drag-handle]');

      const isButton =
        target.closest('button') || target.closest('[data-no-drag]');

      if (isHeader && !isButton) {
        e.preventDefault();
        e.stopPropagation();

        const window = windows.find(w => w.id === windowId);
        if (!window) return;

        setDragState({
          isDragging: true,
          startPosition: { ...window.position },
          startMousePosition: { x: e.clientX, y: e.clientY },
          windowId,
        });

        onFocus(windowId);
      }
    },
    [windows, onFocus]
  );

  const handleResizeStart = useCallback(
    (e: React.MouseEvent, windowId: string, handle: string) => {
      e.preventDefault();
      e.stopPropagation();

      const window = windows.find(w => w.id === windowId);
      if (!window) return;

      setResizeState({
        isResizing: true,
        resizeHandle: handle,
        startSize: { ...window.size },
        startMousePosition: { x: e.clientX, y: e.clientY },
        windowId,
      });

      onFocus(windowId);
    },
    [windows, onFocus]
  );

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!dragState.isDragging && !resizeState.isResizing) return;

      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }

      animationFrameRef.current = requestAnimationFrame(() => {
        if (dragState.isDragging && dragState.windowId) {
          const deltaX = e.clientX - dragState.startMousePosition.x;
          const deltaY = e.clientY - dragState.startMousePosition.y;

          const newPosition = {
            x: dragState.startPosition.x + deltaX,
            y: dragState.startPosition.y + deltaY,
          };

          updateWindowPosition(dragState.windowId, newPosition);
        }

        if (resizeState.isResizing && resizeState.windowId) {
          const deltaX = e.clientX - resizeState.startMousePosition.x;
          const deltaY = e.clientY - resizeState.startMousePosition.y;

          let newSize = { ...resizeState.startSize };

          switch (resizeState.resizeHandle) {
            case 'right':
              newSize.width = resizeState.startSize.width + deltaX;
              break;
            case 'bottom':
              newSize.height = resizeState.startSize.height + deltaY;
              break;
            case 'bottom-right':
              newSize.width = resizeState.startSize.width + deltaX;
              newSize.height = resizeState.startSize.height + deltaY;
              break;
            case 'left':
              newSize.width = resizeState.startSize.width - deltaX;
              break;
            case 'top':
              newSize.height = resizeState.startSize.height - deltaY;
              break;
            case 'top-left':
              newSize.width = resizeState.startSize.width - deltaX;
              newSize.height = resizeState.startSize.height - deltaY;
              break;
            case 'top-right':
              newSize.width = resizeState.startSize.width + deltaX;
              newSize.height = resizeState.startSize.height - deltaY;
              break;
            case 'bottom-left':
              newSize.width = resizeState.startSize.width - deltaX;
              newSize.height = resizeState.startSize.height + deltaY;
              break;
          }

          updateWindowSize(resizeState.windowId, newSize);
        }
      });
    },
    [dragState, resizeState, updateWindowPosition, updateWindowSize]
  );

  const handleMouseUp = useCallback(() => {
    setDragState(prev => ({ ...prev, isDragging: false, windowId: null }));
    setResizeState(prev => ({ ...prev, isResizing: false, windowId: null }));
  }, []);

  useEffect(() => {
    if (dragState.isDragging || resizeState.isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);

      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
        }
      };
    } return;
  }, [
    dragState.isDragging,
    resizeState.isResizing,
    handleMouseMove,
    handleMouseUp,
  ]);
  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  return (
    <AnimatePresence>
      {windows.map(window => {
        const shouldRender = !window.isMinimized || window.type === 'spotify';
        if (!shouldRender) return null;

        const isFocused = window.id === activeWindow;
        const isSpotify = window.type === 'spotify';
        const isDragging = dragState.windowId === window.id;
        const isResizing = resizeState.windowId === window.id;

        const windowVariants = {
          hidden: {
            opacity: 0,
            scale: 0.8,
            y: 50,
          },
          visible: {
            opacity: 1,
            scale: 1,
            y: 0,
          },
          minimized: {
            opacity: 0,
            scale: isSpotify ? 1 : 0.2,
            y: isSpotify ? 0 : globalThis.window.innerHeight - 48,
          },
        };

        return (
          <motion.div
            key={window.id}
            data-window-id={window.type}
            initial='hidden'
            animate={window.isMinimized ? 'minimized' : 'visible'}
            exit='minimized'
            variants={windowVariants}
            transition={{
              duration: 0.3,
              ease: 'easeOut',
              scale: { duration: 0.2 },
            }}
            className={`
              absolute shadow-2xl rounded-lg overflow-hidden border
              ${isFocused ? 'z-50' : 'z-40'}
              ${isDragging ? 'cursor-grabbing' : 'cursor-default'}
              ${isResizing ? 'select-none' : ''}
            `}
            style={{
              left: window.position.x,
              top: window.position.y,
              width: window.size.width,
              height: window.size.height,
              borderColor: 'var(--color-border)',
              backgroundColor: 'var(--color-background-primary)',
              transform: isDragging ? 'scale(1.02)' : 'scale(1)',
              transition:
                isDragging || isResizing ? 'none' : 'transform 0.2s ease-out',
            }}
            onMouseDown={() => onFocus(window.id)}
          >
            <div
              className='window-header flex items-center justify-between px-4 py-3 cursor-grab active:cursor-grabbing'
              data-drag-handle
              style={{
                backgroundColor: 'var(--color-surface-primary)',
                color: 'var(--color-text-primary)',
                borderBottom: '1px solid var(--color-border)',
              }}
              onMouseDown={e => handleDragStart(e, window.id)}
            >
              <span className='font-medium text-sm truncate flex-1'>
                {window.title}
              </span>
              <div className='flex items-center space-x-1 ml-4'>
                <button
                  data-no-drag
                  onClick={() => onMinimize(window.id)}
                  className='w-6 h-6 flex items-center justify-center rounded hover:bg-[var(--color-interactive-hover)] transition-colors'
                >
                  <Minus className='w-3 h-3' />
                </button>
                <button
                  data-no-drag
                  onClick={() => onClose(window.id)}
                  className='w-6 h-6 flex items-center justify-center rounded hover:bg-red-500/20 transition-colors group'
                >
                  <X className='w-3 h-3 group-hover:text-red-400' />
                </button>
              </div>
            </div>

            <div className='flex-1 overflow-hidden'>
              <WindowContent
                type={window.type as any}
                minimized={window.isMinimized}
              />
            </div>

            <>
              <div
                className='absolute top-0 right-0 w-1 h-full cursor-e-resize hover:bg-[var(--color-accent-primary)]/30 transition-colors'
                onMouseDown={e => handleResizeStart(e, window.id, 'right')}
              />

              <div
                className='absolute bottom-0 left-0 w-full h-1 cursor-s-resize hover:bg-[var(--color-accent-primary)]/30 transition-colors'
                onMouseDown={e => handleResizeStart(e, window.id, 'bottom')}
              />

              <div
                className='absolute bottom-0 right-0 w-3 h-3 cursor-se-resize hover:bg-[var(--color-accent-primary)]/50 transition-colors'
                onMouseDown={e =>
                  handleResizeStart(e, window.id, 'bottom-right')
                }
              />

              <div
                className='absolute top-0 left-0 w-1 h-full cursor-w-resize hover:bg-[var(--color-accent-primary)]/30 transition-colors'
                onMouseDown={e => handleResizeStart(e, window.id, 'left')}
              />

              <div
                className='absolute top-0 left-0 w-full h-1 cursor-n-resize hover:bg-[var(--color-accent-primary)]/30 transition-colors'
                onMouseDown={e => handleResizeStart(e, window.id, 'top')}
              />

              <div
                className='absolute top-0 left-0 w-3 h-3 cursor-nw-resize hover:bg-[var(--color-accent-primary)]/50 transition-colors'
                onMouseDown={e => handleResizeStart(e, window.id, 'top-left')}
              />
              <div
                className='absolute top-0 right-0 w-3 h-3 cursor-ne-resize hover:bg-[var(--color-accent-primary)]/50 transition-colors'
                onMouseDown={e => handleResizeStart(e, window.id, 'top-right')}
              />
              <div
                className='absolute bottom-0 left-0 w-3 h-3 cursor-sw-resize hover:bg-[var(--color-accent-primary)]/50 transition-colors'
                onMouseDown={e =>
                  handleResizeStart(e, window.id, 'bottom-left')
                }
              />
            </>
          </motion.div>
        );
      })}
    </AnimatePresence>
  );
}
