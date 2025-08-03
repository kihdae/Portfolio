'use client';

import React, {
  createContext,
  useState,
  useEffect,
  useCallback,
  useContext,
  useMemo,
} from 'react';
import { performanceUtils } from '@/lib/performanceUtils';

export const backgroundGifs = {
  none: { name: 'No Background', size: 0, extension: '.gif' },
  hxh: { name: 'Hunter x Hunter', size: 10000, extension: '.gif' },
  lain: { name: 'Lain', size: 1024, extension: '.gif' },
  evangelion: { name: 'Evangelion', size: 10000, extension: '.jpg' },
  evang: { name: 'Evangelion 2', size: 10000, extension: '.jpg' },
  asylum: { name: 'Asylum', size: 10000, extension: '.jpg' },
  paper: { name: 'bit', size: 837, extension: '.gif' },
  raven: { name: 'Raven', size: 722, extension: '.gif' },
  animated_cat_city: { name: 'Cat City', size: 2700, extension: '.gif' },
  'CodeNation-optimized': { name: 'Snake', size: 13000, extension: '.gif' },
  restart: { name: 'Restart', size: 2800, extension: '.gif' },
};

export type BackgroundName = keyof typeof backgroundGifs;

interface BackgroundContextType {
  background: BackgroundName;
  setBackground: (background: BackgroundName) => void;
  availableBackgrounds: typeof backgroundGifs;
  getBackgroundUrl: (background: BackgroundName) => string | null;
  isLoading: boolean;
  preloadBackground: (background: BackgroundName) => Promise<void>;
}
  
export const BackgroundContext = createContext<
  BackgroundContextType | undefined
>(undefined);

export const BackgroundProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [background, setBackgroundState] =
    useState<BackgroundName>('animated_cat_city');
  const [isLoading, setIsLoading] = useState(false);
  const [preloadedImages, setPreloadedImages] = useState<Set<string>>(
    new Set()
  );

  useEffect(() => {
    try {
      const storedBackground = localStorage.getItem(
        'app-background'
      ) as BackgroundName;
      if (storedBackground && backgroundGifs[storedBackground]) {
        setBackgroundState(storedBackground);
        preloadBackground(storedBackground);
      } else {
        setBackgroundState('animated_cat_city');
        preloadBackground('animated_cat_city');
      }
    } catch (error) {
      console.warn('Could not access localStorage. Using default background.');
      setBackgroundState('animated_cat_city');
      preloadBackground('animated_cat_city');
    }
  }, []);

  const preloadBackground = useCallback(
    async (bg: BackgroundName): Promise<void> => {
      if (bg === 'none' || preloadedImages.has(bg)) return;

      const backgroundInfo = backgroundGifs[bg];
      if (!backgroundInfo) return;

      const url = `/assets/${bg}${backgroundInfo.extension}`;

      return new Promise((resolve, reject) => {
        const img = new Image();

        img.onload = () => {
          setPreloadedImages(prev => new Set(prev).add(bg));
          resolve();
        };

        img.onerror = () => {
          console.warn(`Failed to preload background: ${bg}`);
          reject(new Error(`Failed to load background: ${bg}`));
        };

        img.src = url;
      });
    },
    [preloadedImages]
  );

  const setBackground = useCallback(
    async (newBackground: BackgroundName) => {
      if (backgroundGifs[newBackground] && newBackground !== background) {
        const startTime = performance.now();
        const fileSize = backgroundGifs[newBackground].size;
        setIsLoading(true);

        try {
          requestAnimationFrame(async () => {
            try {
              if (!preloadedImages.has(newBackground)) {
                await preloadBackground(newBackground);
              }

              setBackgroundState(newBackground);
              try {
                localStorage.setItem('app-background', newBackground);
              } catch (error) {
                console.warn('Could not save background to localStorage.');
              }

              performanceUtils.monitorBackgroundChange(
                newBackground,
                fileSize,
                startTime
              );
            } catch (error) {
              console.error('Error changing background:', error);
              setBackgroundState('paper');
            } finally {
              setIsLoading(false);
            }
          });
        } catch (error) {
          console.error('Error in setBackground:', error);
          setIsLoading(false);
        }
      }
    },
    [background, preloadedImages, preloadBackground]
  );

  const getBackgroundUrl = useCallback((bg: BackgroundName): string | null => {
    if (bg === 'none') return null;

    const backgroundInfo = backgroundGifs[bg];
    if (!backgroundInfo) return null;

    return `/assets/${bg}${backgroundInfo.extension}`;
  }, []);

  const contextValue = useMemo(
    () => ({
      background,
      setBackground,
      availableBackgrounds: backgroundGifs,
      getBackgroundUrl,
      isLoading,
      preloadBackground,
    }),
    [background, setBackground, getBackgroundUrl, isLoading, preloadBackground]
  );

  return (
    <BackgroundContext.Provider value={contextValue}>
      {children}
    </BackgroundContext.Provider>
  );
};

export const useBackground = (): BackgroundContextType => {
  const context = useContext(BackgroundContext);
  if (context === undefined) {
    throw new Error('useBackground must be used within a BackgroundProvider');
  }
  return context;
};
