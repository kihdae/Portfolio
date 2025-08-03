'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

interface ShutdownScreenProps {
  onComplete: () => void;
}

export default function ShutdownScreen({ onComplete }: ShutdownScreenProps) {
  const [phase, setPhase] = useState<'gif' | 'black'>('gif');

  useEffect(() => {
    const gifTimer = setTimeout(() => {
      setPhase('black');
    }, 5000);

    const shutdownTimer = setTimeout(() => {
      if (typeof window !== 'undefined') {
        const closeEvent = new KeyboardEvent('keydown', {
          key: 'w',
          code: 'KeyW',
          ctrlKey: true,
          bubbles: true,
        });
        window.dispatchEvent(closeEvent);

        setTimeout(() => {
          window.close();
          setTimeout(() => {
            window.location.href = 'about:blank';
          }, 100);
        }, 100);
      }
    }, 10000);

    return () => {
      clearTimeout(gifTimer);
      clearTimeout(shutdownTimer);
    };
  }, []);

  return (
    <div className='fixed inset-0 bg-black z-[9999] flex items-center justify-center'>
      {phase === 'gif' && (
        <div className='w-full h-full relative'>
          <img
            src='/assets/raven.gif'
            alt='Shutdown animation'
            className='w-full h-full object-cover'
          />
          <div className='absolute inset-0 bg-black/30' />
        </div>
      )}
    </div>
  );
}
