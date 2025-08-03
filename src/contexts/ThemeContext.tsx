'use client';

import React, {
  createContext,
  useState,
  useEffect,
  useCallback,
  useContext,
  useMemo,
} from 'react';
import {
  themes,
  applyTheme,
  validateTheme,
  type ThemeConfig,
} from '@/lib/themeConfig';

export type ThemeName = keyof typeof themes;

interface ThemeContextType {
  theme: ThemeName;
  setTheme: (theme: ThemeName) => void;
  availableThemes: Record<string, string>;
  currentThemeConfig: ThemeConfig | null;
  validateCurrentTheme: () => boolean;
}

export const ThemeContext = createContext<ThemeContextType | undefined>(
  undefined
);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [theme, setThemeState] = useState<ThemeName>('plasma'); 

  const availableThemes = useMemo(
    () =>
      Object.fromEntries(
        Object.entries(themes).map(([key, config]) => [key, config.displayName])
      ),
    []
  );

  const currentThemeConfig = useMemo(() => themes[theme] || null, [theme]);

  useEffect(() => {
    try {
      const storedTheme = localStorage.getItem('app-theme') as ThemeName;
      if (storedTheme && themes[storedTheme]) {
        setThemeState(storedTheme);
        applyTheme(storedTheme);
      } else {
        applyTheme('plasma');
      }
    } catch (error) {
      console.warn('Could not access localStorage. Using default theme.');
      applyTheme('plasma');
    }
  }, []);

  const setTheme = useCallback(
    (newTheme: ThemeName) => {
      if (themes[newTheme] && newTheme !== theme) {
        requestAnimationFrame(() => {
          setThemeState(newTheme);
          try {
            localStorage.setItem('app-theme', newTheme);
          } catch (error) {
            console.warn('Could not save theme to localStorage.');
          }
          applyTheme(newTheme);
        });
      }
    },
    [theme]
  );

  const validateCurrentTheme = useCallback(() => {
    return validateTheme(theme);
  }, [theme]);

  const contextValue = useMemo(
    () => ({
      theme,
      setTheme,
      availableThemes,
      currentThemeConfig,
      validateCurrentTheme,
    }),
    [theme, setTheme, availableThemes, currentThemeConfig, validateCurrentTheme]
  );

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
