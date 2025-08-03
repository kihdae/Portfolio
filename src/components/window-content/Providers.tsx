'use client';

import { ThemeProvider } from '@/contexts/ThemeContext';
import { BackgroundProvider } from '@/contexts/BackgroundContext';
import { VolumeProvider } from '@/contexts/VolumeContext';
import { PowerProvider } from '@/contexts/PowerContext';
import { initializeThemeValidation } from '@/lib/themeValidator';
import type { ReactNode } from 'react';
import { useEffect } from 'react';
import AOS from 'aos';

interface ProvidersProps {
  children: ReactNode;
}

export default function Providers({ children }: ProvidersProps) {
  useEffect(() => {
    initializeThemeValidation();
  }, []);

  useEffect(() => {
    AOS.init({
      duration: 800,
      easing: 'ease-in-out',
      once: true,
      offset: 50,
      delay: 0,
    });
  }, []);

  return (
    <ThemeProvider>
      <PowerProvider>
        <BackgroundProvider>
          <VolumeProvider>{children}</VolumeProvider>
        </BackgroundProvider>
      </PowerProvider>
    </ThemeProvider>
  );
}
