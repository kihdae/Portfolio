'use client';

import { useState, useCallback } from 'react';
import { useVolume } from '@/contexts/VolumeContext';

export interface SystemState {
  isWifiOn: boolean;
  volume: number;
  isMuted: boolean;
  networkName: string | null;
}

export function useSystemControls() {
  const {
    volume,
    isMuted,
    setVolume: setVolumeContext,
    toggleMute: toggleMuteContext,
  } = useVolume();
  const [systemState, setSystemState] = useState<SystemState>({
    isWifiOn: true,
    volume,
    isMuted,
    networkName: null,
  });

  const toggleWifi = useCallback(() => {
    setSystemState(prev => ({ ...prev, isWifiOn: !prev.isWifiOn }));
  }, []);

  const setVolume = useCallback(
    (newVolume: number) => {
      const clampedVolume = Math.max(0, Math.min(100, Math.round(newVolume)));
      setVolumeContext(clampedVolume);
      setSystemState(prev => ({
        ...prev,
        volume: clampedVolume,
        isMuted: false,
      }));
    },
    [setVolumeContext]
  );

  const toggleMute = useCallback(() => {
    toggleMuteContext();
    setSystemState(prev => ({ ...prev, isMuted: !prev.isMuted }));
  }, [toggleMuteContext]);

  const connectToNetwork = useCallback((networkName: string) => {
    setSystemState(prev => ({ ...prev, networkName }));
  }, []);

  return {
    systemState: {
      ...systemState,
      volume,
      isMuted,
    },
    systemControls: {
      toggleWifi,
      setVolume,
      toggleMute,
      connectToNetwork,
    },
  };
}
