'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePower } from '@/contexts/PowerContext';

interface RestartScreenProps {
  onComplete?: () => void;
}

export default function RestartScreen({ onComplete }: RestartScreenProps) {
  const { isRestarting, restartMessage, restartProgress } = usePower();
  const [showMessage, setShowMessage] = useState(false);

  useEffect(() => {
    if (restartMessage) {
      setShowMessage(true);
    }
  }, [restartMessage]);

  if (!isRestarting) {
    return null;
  }

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
          <motion.div
            className='w-80 h-2 bg-white/20 rounded-full overflow-hidden mb-6'
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div
              className='h-full bg-gradient-to-r from-blue-400 to-green-400 rounded-full'
              initial={{ width: 0 }}
              animate={{ width: `${restartProgress}%` }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
            />
          </motion.div>

          <AnimatePresence mode='wait'>
            {showMessage && (
              <motion.div
                key={restartMessage}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className='text-center'
              >
                <motion.p
                  className='text-white/90 text-lg font-light mb-2 text-shadow-lg'
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.1 }}
                >
                  {restartMessage}
                </motion.p>

                <motion.p
                  className='text-white/60 text-sm font-mono'
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  {restartProgress}%
                </motion.p>
              </motion.div>
            )}
          </AnimatePresence>

          <motion.div
            className='flex justify-center space-x-2 mt-6'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <motion.div
              className='w-2 h-2 bg-white/60 rounded-full'
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.6, 1, 0.6],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
            <motion.div
              className='w-2 h-2 bg-white/60 rounded-full'
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.6, 1, 0.6],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: 0.2,
              }}
            />
            <motion.div
              className='w-2 h-2 bg-white/60 rounded-full'
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.6, 1, 0.6],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: 0.4,
              }}
            />
          </motion.div>

          <motion.div
            className='absolute bottom-8 left-8 text-white/40 text-xs font-mono'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            <div>System Restart in Progress</div>
            <div>Please do not turn off your computer</div>
          </motion.div>

          <motion.div
            className='absolute bottom-8 right-8 text-white/40 text-xs font-mono'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
          >
            {new Date().toLocaleTimeString()}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
