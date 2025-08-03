import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';

interface VolumeContextType {
  volume: number;
  isMuted: boolean;
  setVolume: (volume: number) => void;
  toggleMute: () => void;
  normalizedVolume: number;
}

const DEFAULT_VOLUME = 50;

const VolumeContext = createContext<VolumeContextType | undefined>(undefined);

export function VolumeProvider({ children }: { children: ReactNode }) {
  const [volume, setVolumeState] = useState<number>(() => {
    try {
      if (typeof window !== 'undefined') {
        const saved = localStorage.getItem('system-volume');
        if (saved) {
          const parsed = parseFloat(saved);
          if (!isNaN(parsed) && parsed >= 0 && parsed <= 100) {
            return parsed;
          }
        }
      }
    } catch (error) {
      console.error('Error loading volume from localStorage:', error);
    }
    return DEFAULT_VOLUME;
  });

  const [isMuted, setIsMuted] = useState<boolean>(() => {
    try {
      if (typeof window !== 'undefined') {
        const saved = localStorage.getItem('system-muted');
        return saved === 'true';
      }
    } catch (error) {
      console.error('Error loading mute state from localStorage:', error);
    }
    return false;
  });

  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem('system-volume', volume.toString());
        localStorage.setItem('system-muted', isMuted.toString());

        window.dispatchEvent(
          new CustomEvent('system-volume-change', {
            detail: {
              volume,
              isMuted,
              normalizedVolume: isMuted ? 0 : volume / 100,
            },
          })
        );
      }
    } catch (error) {
      console.error('Error saving volume settings to localStorage:', error);
    }
  }, [volume, isMuted]);

  const setVolume = (newVolume: number) => {
    if (newVolume >= 0 && newVolume <= 100) {
      const roundedVolume = Math.round(newVolume);
      setVolumeState(roundedVolume);
      if (isMuted && roundedVolume > 0) {
        setIsMuted(false);
      }
    }
  };

  const toggleMute = () => {
    if (isMuted && volume === 0) {
      setVolumeState(DEFAULT_VOLUME);
    }
    setIsMuted(!isMuted);
  };

  const normalizedVolume = isMuted ? 0 : volume / 100;

  return (
    <VolumeContext.Provider
      value={{
        volume,
        isMuted,
        setVolume,
        toggleMute,
        normalizedVolume,
      }}
    >
      {children}
    </VolumeContext.Provider>
  );
}

export function useVolume() {
  const context = useContext(VolumeContext);
  if (context === undefined) {
    throw new Error('useVolume must be used within a VolumeProvider');
  }
  return context;
}
