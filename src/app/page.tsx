'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function LoginPage() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isRestarting, setIsRestarting] = useState(false);
  const [restartMessage, setRestartMessage] = useState('');
  const [restartProgress, setRestartProgress] = useState(0);
  const router = useRouter();

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const restartState = localStorage.getItem('system_restart');
      if (restartState) {
        localStorage.removeItem('system_restart');
        setIsRestarting(true);
        setRestartProgress(0);
        setRestartMessage('Welcome Back!');

        const restartSequence = [
          { progress: 20, message: 'Loading system components...', delay: 400 },
          {
            progress: 40,
            message: 'Initializing desktop environment...',
            delay: 500,
          },
          { progress: 60, message: 'Loading applications...', delay: 400 },
          { progress: 80, message: 'Preparing workspace...', delay: 500 },
          { progress: 100, message: 'Ready', delay: 600 },
        ];

        let currentStep = 0;
        const updateRestartState = () => {
          if (currentStep < restartSequence.length) {
            const step = restartSequence[currentStep];
            setRestartProgress(step?.progress || 0);
            setRestartMessage(step?.message || '');
            currentStep++;

            if (currentStep < restartSequence.length) {
              setTimeout(updateRestartState, step?.delay || 0);
            } else {
              setTimeout(() => {
                setIsRestarting(false);
                setRestartMessage('');
                setRestartProgress(0);
              }, step?.delay || 0);
            }
          }
        };

        setTimeout(updateRestartState, restartSequence[0]?.delay || 0);
      }
    }

    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault();
        router.push('/desktop');
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [router]);

  if (isRestarting) {
    return (
      <div className='fixed inset-0 bg-black z-[9999] flex items-center justify-center'>
        <div className='relative w-full h-full flex flex-col items-center justify-center'>
          <div className='absolute inset-0'>
            <img
              src='/assets/restart.gif'
              alt='Restart animation'
              className='w-full h-full object-cover'
            />
            <div className='absolute inset-0 bg-black/40' />
          </div>

          <div className='relative z-10 flex flex-col items-center justify-center'>
            <div className='w-80 h-2 bg-white/20 rounded-full overflow-hidden mb-6'>
              <div
                className='h-full bg-gradient-to-r from-blue-400 to-green-400 rounded-full transition-all duration-300 ease-out'
                style={{ width: `${restartProgress}%` }}
              />
            </div>

            <div className='text-center'>
              <p className='text-white/90 text-lg font-light mb-2 text-shadow-lg'>
                {restartMessage}
              </p>

              <p className='text-white/60 text-sm font-mono'>
                {restartProgress}%
              </p>
            </div>

            <div className='flex justify-center space-x-2 mt-6'>
              <div
                className='w-2 h-2 bg-white/60 rounded-full animate-bounce'
                style={{ animationDelay: '0ms' }}
              />
              <div
                className='w-2 h-2 bg-white/60 rounded-full animate-bounce'
                style={{ animationDelay: '200ms' }}
              />
              <div
                className='w-2 h-2 bg-white/60 rounded-full animate-bounce'
                style={{ animationDelay: '400ms' }}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen relative overflow-hidden bg-[#1f222b] flex items-center justify-center select-none'>
      <div className='absolute inset-0 z-0'>
        <Image
          src='/assets/evangelion.jpg'
          alt='Animated clouds background'
          fill
          className='object-cover opacity-80'
          draggable='false'
          priority
        />
        <div className='absolute inset-0 bg-[#1f222b]/50' />
      </div>

      <div className='relative z-10 text-center text-white'>
        <div className='mb-8'>
          <div className='text-6xl md:text-8xl font-light mb-2 font-mono text-shadow-lg'>
            {currentTime.toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
              hour12: true,
            })}
          </div>
          <div className='text-xl md:text-2xl font-light opacity-80 text-shadow-lg'>
            {currentTime.toLocaleDateString([], {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </div>
        </div>

        <div className='animate-pulse'>
          <p className='text-lg md:text-xl mb-2 text-shadow-lg'>
            Press Space to Enter
          </p>
          <div className='flex justify-center'>
            <div className='px-6 py-2 border border-white/30 rounded-lg bg-white/10 backdrop-blur-sm'>
              <span className='text-sm font-mono'>SPACE</span>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .text-shadow-lg {
          text-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
        }
      `}</style>
    </div>
  );
}
