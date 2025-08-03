'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Music, Volume2 } from 'lucide-react';

interface AudioLoadingIndicatorProps {
  isLoading: boolean;
  progress: number;
  message: string;
  isFullscreen?: boolean;
}

export default function AudioLoadingIndicator({
  isLoading,
  progress,
  message,
  isFullscreen = false,
}: AudioLoadingIndicatorProps) {
  if (!isLoading) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className={`fixed inset-0 z-[9999] flex items-center justify-center ${
          isFullscreen ? 'bg-black/80' : 'bg-black/60'
        } backdrop-blur-sm`}
      >
        <div className='relative bg-surface/95 backdrop-blur-xl border border-accent/20 rounded-2xl p-8 shadow-2xl max-w-md w-full mx-4'>
          <div className='flex items-center justify-center mb-6'>
            <div className='relative'>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                className='w-16 h-16 border-4 border-accent/20 border-t-accent-primary rounded-full'
              />
              <div className='absolute inset-0 flex items-center justify-center'>
                <Music className='w-6 h-6 text-accent-primary' />
              </div>
            </div>
          </div>

          <div className='mb-4'>
            <div className='flex items-center justify-between text-sm text-text-secondary mb-2'>
              <span>Loading Audio</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <div className='w-full bg-accent/10 rounded-full h-2 overflow-hidden'>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
                className='h-full bg-gradient-to-r from-accent-primary to-accent-secondary rounded-full'
              />
            </div>
          </div>

          <div className='text-center'>
            <p className='text-text-primary font-medium mb-2'>{message}</p>
            <div className='flex items-center justify-center gap-2 text-text-secondary text-sm'>
              <Volume2 className='w-4 h-4' />
              <span>Audio processing...</span>
            </div>
          </div>

          <div className='flex justify-center mt-4 space-x-1'>
            {[0, 1, 2].map(i => (
              <motion.div
                key={i}
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.5, 1, 0.5],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  delay: i * 0.2,
                  ease: 'easeInOut',
                }}
                className='w-2 h-2 bg-accent-primary rounded-full'
              />
            ))}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
