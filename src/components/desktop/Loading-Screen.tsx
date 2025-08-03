'use client';

import { useEffect, useState } from 'react';
import { usePower } from '@/contexts/PowerContext';

interface LoadingScreenProps {
  onComplete: () => void;
}

export default function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const { isRestarting } = usePower();
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [loadingText, setLoadingText] = useState('Initializing...');
  const [isComplete, setIsComplete] = useState(false);

  if (isRestarting) {``
    return null;
  }

  useEffect(() => {
    let progressInterval: NodeJS.Timeout;

    if (!isComplete) {
      const loadingStates = isRestarting
        ? [
            { progress: 20, text: 'Preparing to restart...' },
            { progress: 40, text: 'Saving your settings...' },
            { progress: 60, text: 'Restarting system components...' },
            { progress: 80, text: 'Reinitializing desktop environment...' },
            { progress: 100, text: 'Almost ready...' },
          ]
        : [
            { progress: 20, text: 'Loading system components...' },
            { progress: 40, text: 'Initializing desktop environment...' },
            { progress: 60, text: 'Loading applications...' },
            { progress: 80, text: 'Preparing workspace...' },
            { progress: 100, text: 'Ready' },
          ];

      let currentState = 0;
      progressInterval = setInterval(() => {
        if (currentState < loadingStates.length) {
          const { progress, text } = loadingStates[currentState];
          setLoadingProgress(progress);
          setLoadingText(text);
          currentState++;

          if (currentState === loadingStates.length) {
            setIsComplete(true);
            clearInterval(progressInterval);
            setTimeout(() => {
              onComplete();
            }, 500);
          }
        }
      }, 600);
    }

    return () => {
      if (progressInterval) clearInterval(progressInterval);
    };
  }, [isRestarting, onComplete, isComplete]);

  return (
    <div className='fixed inset-0 bg-black z-[9999] flex items-center justify-center'>
      <div className='relative w-full h-full flex flex-col items-center justify-center'>
        <div className='absolute inset-0'>
          <img
            src='/assets/lain.gif'
            alt={isRestarting ? 'Restart animation' : 'Loading animation'}
            className='w-full h-full object-cover'
          />
          <div className='absolute inset-0 bg-black/30' />
        </div>
        <div className='relative z-10 flex flex-col items-center'>
          <div className='w-64 h-1 bg-white/20 rounded-full overflow-hidden mb-4'>
            <div
              className='h-full bg-white rounded-full transition-all duration-300 ease-out'
              style={{ width: `${loadingProgress}%` }}
            />
          </div>
          <p className='text-white/80 text-sm font-light min-h-[1.5rem] text-shadow-lg'>
            {loadingText}
          </p>
          <div className='flex justify-center space-x-2 mt-4'>
            <div
              className='w-1.5 h-1.5 bg-white/40 rounded-full animate-bounce'
              style={{ animationDelay: '0ms' }}
            />
            <div
              className='w-1.5 h-1.5 bg-white/40 rounded-full animate-bounce'
              style={{ animationDelay: '200ms' }}
            />
            <div
              className='w-1.5 h-1.5 bg-white/40 rounded-full animate-bounce'
              style={{ animationDelay: '400ms' }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
