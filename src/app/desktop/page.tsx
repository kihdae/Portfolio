'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import DesktopIcon from '@/components/desktop/DesktopIcon';
import Taskbar from '@/components/desktop/Taskbar';
import StartMenu from '@/components/desktop/StartMenu';
import WindowManager from '@/components/desktop/Window-Manager';
import LoadingScreen from '@/components/desktop/Loading-Screen';
import RestartScreen from '@/components/desktop/Restart-Screen';
import ShutdownScreen from '@/components/desktop/Shutdown-Screen';
import SleepOverlay from '@/components/desktop/Sleep-Overlay';
import { usePower } from '@/contexts/PowerContext';
import { useBackground } from '@/contexts/BackgroundContext';
import { useSystemControls } from '@/hooks/useSystemControls';
import type { WindowType } from '@/types/desktop';
import { getWindowDefaults } from '@/lib/windowDefaults';
import GlobalContextMenu from '@/components/desktop/GlobalContextMenu';

const DESKTOP_ICONS = [
  {
    name: 'About',
    icon: '/icons/user.png',
    type: 'about',
    position: { x: 50, y: 50 },
  },
  {
    name: 'Projects',
    icon: '/icons/folder.png',
    type: 'projects',
    position: { x: 50, y: 150 },
  },
  {
    name: 'Previous Work',
    icon: '/icons/briefcase.png',
    type: 'experience',
    position: { x: 50, y: 250 },
  },
  {
    name: 'Skills',
    icon: '/icons/code.png',
    type: 'skills',
    position: { x: 50, y: 350 },
  },
  {
    name: 'Contact',
    icon: '/icons/mail.png',
    type: 'contact',
    position: { x: 50, y: 450 },
  },
  {
    name: 'Media Player',
    icon: '/icons/spotify.png',
    type: 'spotify',
    position: { x: 50, y: 550 },
  },
  {
    name: 'Weather',
    icon: '/icons/weather.png',
    type: 'weather',
    position: { x: 50, y: 650 },
  },
];

export default function DesktopPage() {
  const {
    isLoading,
    isSleeping,
    isRestarting,
    isShuttingDown,
    handleWake,
    setIsLoading,
  } = usePower();
  const {
    background,
    getBackgroundUrl,
    isLoading: isBackgroundLoading,
  } = useBackground();
  const { systemState, systemControls } = useSystemControls();

  const [windows, setWindows] = useState<WindowType[]>([]);
  const [activeWindow, setActiveWindow] = useState<string | null>(null);
  const [showStartMenu, setShowStartMenu] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [minimizedWindows, setMinimizedWindows] = useState<WindowType[]>([]);
  
  const clampWindowPosition = useCallback(
    (
      position: { x: number; y: number },
      size: { width: number; height: number }
    ) => {
      const taskbarHeight = 48;
      const screenWidth = globalThis.window.innerWidth;
      const screenHeight = window.innerHeight;
      const minVisible = 20;

      return {
        x: Math.max(
          -(size.width - minVisible),
          Math.min(position.x, screenWidth - minVisible)
        ),
        y: Math.max(
          -(size.height - minVisible),
          Math.min(position.y, screenHeight - taskbarHeight - minVisible)
        ),
      };
    },
    []
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, [setIsLoading]);

  useEffect(() => {
    if (!isRestarting) {
      const restartCompleted = sessionStorage.getItem('restartCompleted');
      if (restartCompleted) {
        setWindows([]);
        setActiveWindow(null);
        sessionStorage.removeItem('restartCompleted');
      }
    } else {
      sessionStorage.setItem('restartCompleted', 'true');
    }
  }, [isRestarting]);

  const handleWindowOpen = useCallback(
    (type: string, title: string) => {
      const existingActiveWindow = windows.find(
        w => w.type === type && !w.isMinimized
      );
      if (existingActiveWindow) {
        setActiveWindow(existingActiveWindow.id);
        setShowStartMenu(false);
        return;
      }

      const existingMinimizedWindow = minimizedWindows.find(
        w => w.type === type
      );
      if (existingMinimizedWindow) {
        setMinimizedWindows(prev =>
          prev.filter(w => w.id !== existingMinimizedWindow.id)
        );
        setWindows(prev =>
          prev.map(w =>
            w.id === existingMinimizedWindow.id
              ? { ...w, isMinimized: false }
              : w
          )
        );
        setActiveWindow(existingMinimizedWindow.id);
        setShowStartMenu(false);
        return;
      }

      const screenWidth = globalThis.window.innerWidth;
      const screenHeight = window.innerHeight;

      let size, position, constraints;

      if (type === 'spotify') {
        const standardWidth = Math.min(screenWidth * 0.75, 1200);
        const standardHeight = Math.min(screenHeight * 0.8, 900);
        const width = Math.min(standardWidth * 1.5, screenWidth * 0.95);
        const height = Math.min(standardHeight * 1.5, screenHeight * 0.95);
        size = { width, height };
        position = {
          x: (screenWidth - width) / 2,
          y: (screenHeight - height) / 2,
        };
        constraints = {
          minWidth: width,
          minHeight: height,
          maxWidth: width,
          maxHeight: height,
        };
      } else {
        const defaults = getWindowDefaults(type);
        size = defaults.size;
        position = defaults.position;

        if (windows.some(w => w.type === type)) {
          position = {
            x: position.x + windows.length * 30,
            y: position.y + windows.length * 30,
          };
        }
        constraints = {
          minWidth: 400,
          minHeight: 300,
          maxWidth: screenWidth * 0.95,
          maxHeight: screenHeight * 0.9,
        };
      }

      const newWindow: WindowType = {
        id: `${type}-${Date.now()}`,
        type,
        title,
        isMinimized: false,
        position: clampWindowPosition(position, size),
        size,
        constraints,
      };

      setWindows(prev => [...prev, newWindow]);
      setActiveWindow(newWindow.id);
      setShowStartMenu(false);
    },
    [windows, minimizedWindows, clampWindowPosition]
  );

  const handleWindowClose = useCallback(
    (id: string) => {
      setWindows(prev => prev.filter(w => w.id !== id));
      setMinimizedWindows(prev => prev.filter(w => w.id !== id));
      if (activeWindow === id) {
        setActiveWindow(null);
      }
    },
    [activeWindow]
  );

  const handleWindowMinimize = useCallback(
    (id: string) => {
     

      setWindows(prev => {
        const windowToMinimize = prev.find(w => w.id === id);
        if (!windowToMinimize) return prev;


        setMinimizedWindows(current => {
          if (!current.some(minW => minW.id === id)) {
            return [...current, { ...windowToMinimize, isMinimized: true }];
          }
          return current;
        });

        const updatedWindows = prev.map(w => {
          if (w.id === id) {
            return { ...w, isMinimized: true };
          }
          return w;
        });
        return updatedWindows;
      });

      if (activeWindow === id) {
        setActiveWindow(null);
      }
    },
    [activeWindow]
  );

  const handleWindowClick = useCallback(
    (id: string) => {
      setMinimizedWindows(prev => prev.filter(w => w.id !== id));
      setWindows(prev =>
        prev.map(w => {
          if (w.id === id && w.isMinimized) {
            const defaults = getWindowDefaults(w.type);

            return {
              ...w,
              isMinimized: false,
              position: clampWindowPosition(defaults.position, w.size),
            };
          }
          return w;
        })
      );
      setActiveWindow(id);
    },
    [clampWindowPosition]
  );

  const handleIconSelect = useCallback(
    (type: string, name: string) => {
      const existingWindow = windows.find(w => w.type === type);
      const existingMinimizedWindow = minimizedWindows.find(
        w => w.type === type
      );

      if (existingWindow && !existingWindow.isMinimized) {
        setActiveWindow(existingWindow.id);
      } else if (existingMinimizedWindow) {
        handleWindowClick(existingMinimizedWindow.id);
      } else {
        handleWindowOpen(type, name);
      }
      setShowStartMenu(false);
    },
    [windows, minimizedWindows, handleWindowClick, handleWindowOpen]
  );

  const handleSearch = () => {
    setShowSearch(!showSearch);
  };

  const getBackgroundStyle = useCallback(() => {
    const backgroundUrl = getBackgroundUrl(background);
    if (!backgroundUrl) {
      return {};
    }
    return {
      backgroundImage: `url(${backgroundUrl})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      transition: 'background-image 0.3s ease-in-out',
    };
  }, [background, getBackgroundUrl]);

  if (isRestarting) {
    return <RestartScreen />;
  }

  if (isLoading) {
    return <LoadingScreen onComplete={() => setIsLoading(false)} />;
  }

  if (isShuttingDown) {
    return <ShutdownScreen onComplete={() => {}} />;
  }

  return (
    <GlobalContextMenu
      windows={windows}
      minimizedWindows={minimizedWindows}
      onWindowOpen={handleWindowOpen}
      onWindowClose={handleWindowClose}
      onWindowRestore={handleWindowClick}
    >
      <div
        className='relative w-screen h-screen overflow-hidden'
        style={getBackgroundStyle()}
      >
        <div className='absolute inset-0 pointer-events-none z-10 overflow-y-auto'>
          {DESKTOP_ICONS.map(icon => (
            <div key={icon.name} className='pointer-events-auto'>
              <DesktopIcon
                name={icon.name}
                icon={icon.icon}
                position={icon.position}
                isActive={windows.some(
                  w => w.type === icon.type && !w.isMinimized
                )}
                onClick={() => handleIconSelect(icon.type, icon.name)}
              />
            </div>
          ))}
        </div>

        <WindowManager
          windows={windows}
          minimizedWindows={minimizedWindows}
          activeWindow={activeWindow}
          onClose={handleWindowClose}
          onMinimize={handleWindowMinimize}
          onFocus={handleWindowClick}
          setWindows={setWindows}
        />

        <Taskbar
          windows={windows}
          minimizedWindows={minimizedWindows}
          activeWindow={activeWindow}
          onWindowClick={handleWindowClick}
          onStartClick={() => setShowStartMenu(!showStartMenu)}
          showStartMenu={showStartMenu}
          systemState={systemState}
          systemControls={systemControls}
          onSearch={handleSearch}
          // @ts-ignore
          icons={DESKTOP_ICONS}
          onSelectIcon={handleIconSelect}
        />

        <AnimatePresence>
          {showStartMenu && (
            <StartMenu
              isOpen={showStartMenu}
              onClose={() => setShowStartMenu(false)}
              onOpenApp={handleIconSelect}
              onAction={() => setShowStartMenu(false)}
            />
          )}
        </AnimatePresence>

        <AnimatePresence>
          {isSleeping && <SleepOverlay onWake={handleWake} />}
        </AnimatePresence>
        <AnimatePresence>
          {isBackgroundLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className='absolute inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center'
            >
              <div className='bg-surface/90 rounded-lg p-4 shadow-lg'>
                <div className='flex items-center gap-3'>
                  <div className='w-4 h-4 border-2 border-primary-accent border-t-transparent rounded-full animate-spin'></div>
                  <span className='text-text-primary'>
                    Loading background...
                  </span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </GlobalContextMenu>
  );
}
