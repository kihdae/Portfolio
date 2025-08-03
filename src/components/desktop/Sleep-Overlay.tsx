'use client';

import { useEffect, useState, useCallback } from 'react';
import { usePower } from '@/contexts/PowerContext';

interface SleepOverlayProps {
  onWake: () => void;
}

export default function SleepOverlay({ onWake }: SleepOverlayProps) {
  const { handleWake } = usePower();
  const [isWaking, setIsWaking] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);
  const [keyPressCount, setKeyPressCount] = useState(0);
  const requiredKeyPresses = 2;

  const initiateWake = useCallback(() => {
    if (isWaking) return;
    setIsWaking(true);
    setFadeOut(true);

    setTimeout(() => {
      handleWake();
      onWake();
    }, 500);
  }, [isWaking, onWake, handleWake]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isWaking) return;
      if (!['Control', 'Alt', 'Shift', 'Meta'].includes(e.key)) {
        setKeyPressCount(prev => {
          const newCount = prev + 1;
         
          if (newCount >= requiredKeyPresses) {
            initiateWake();
          }
          return newCount;
        });
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [initiateWake, requiredKeyPresses]);

  return (
    <div
      className={`
        fixed inset-0 bg-black z-[9999] 
        transition-opacity duration-500
        ${fadeOut ? 'opacity-0' : 'opacity-100'}
      `}
    >
      <div className='absolute inset-0 flex items-center justify-center text-white/50 text-sm'>
        {isWaking
          ? 'Waking up...'
          : `Press any key ${requiredKeyPresses - keyPressCount} more times to wake`}
      </div>
    </div>
  );
}
