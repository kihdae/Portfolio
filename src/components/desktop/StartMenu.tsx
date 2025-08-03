'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { usePower } from '@/contexts/PowerContext';
import Image from 'next/image';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useState } from 'react';
import SettingsMenu from './SettingsMenu';

interface StartMenuProps {
  onClose: () => void;
  onOpenApp: (type: string, title: string) => void;
  onAction: (action: string) => void;
  isOpen: boolean;
}

export default function StartMenu({
  onClose,
  onOpenApp,
  onAction,
  isOpen,
}: StartMenuProps) {
  const { handleSleep, handleRestart, handleShutdown } = usePower();
  const [showSettings, setShowSettings] = useState(false);

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 20, opacity: 0 }}
            transition={{
              type: 'spring',
              stiffness: 400,
              damping: 30,
            }}
            className='absolute bottom-12 left-2 w-[320px] bg-surface/80 backdrop-blur-xl rounded-lg overflow-hidden z-50 shadow-2xl border'
            style={{ borderColor: 'var(--color-border)' }}
          >
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className='p-4 flex items-center gap-3 border-b border-accent/10'
            >
              <div className='w-10 h-10 rounded-full bg-gradient-to-br from-accent to-purple-600 flex items-center justify-center'>
                <Image
                  src='/icons/user.png'
                  alt='User'
                  width={24}
                  height={24}
                  className='opacity-90'
                />
              </div>
              <div>
                <h3 className='text-text-primary font-serif font-medium'>
                  Emilio Arroyo
                </h3>
                <p className='text-text-secondary text-sm'>
                  Full Stack Developer
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className='mt-2 border-t border-accent/10'
            >
              <motion.button
                onClick={() => setShowSettings(true)}
                whileHover={{ scale: 1.02, x: 5 }}
                whileTap={{ scale: 0.98 }}
                className='w-full flex items-center gap-3 px-5 py-2.5 text-text-secondary hover:text-text-primary hover:bg-accent/10 transition-colors'
              >
                <motion.div
                  animate={{ rotate: showSettings ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Image
                    src='/icons/code.png'
                    alt='Settings'
                    width={16}
                    height={16}
                    className='opacity-70'
                  />
                </motion.div>
                <span className='text-sm'>Settings</span>
              </motion.button>

              <DropdownMenu>
                <DropdownMenuTrigger className='w-full'>
                  <motion.div
                    whileHover={{ scale: 1.02, x: 5 }}
                    whileTap={{ scale: 0.98 }}
                    className='flex items-center justify-between w-full px-5 py-2.5 text-text-secondary hover:text-text-primary hover:bg-accent/10 transition-colors'
                  >
                    <div className='flex items-center gap-3'>
                      <svg
                        className='w-4 h-4 opacity-70'
                        viewBox='0 0 24 24'
                        fill='none'
                        stroke='currentColor'
                        strokeWidth='2'
                      >
                        <path d='M18.36 6.64a9 9 0 1 1-12.73 0M12 2v10' />
                      </svg>
                      <span className='text-sm'>Power</span>
                    </div>
                    <svg
                      className='w-4 h-4 opacity-70'
                      viewBox='0 0 24 24'
                      fill='none'
                      stroke='currentColor'
                      strokeWidth='2'
                    >
                      <path d='M9 18l6-6-6-6' />
                    </svg>
                  </motion.div>
                </DropdownMenuTrigger>

                <DropdownMenuContent
                  align='center'
                  className='w-48 bg-surface text-text-primary shadow-xl rounded-lg overflow-hidden border'
                  style={{ borderColor: 'var(--color-border)' }}
                >
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                  >
                    <DropdownMenuItem
                      className='flex items-center px-3 py-2.5 hover:bg-accent/10 focus:bg-accent/20 cursor-pointer'
                      onClick={handleSleep}
                    >
                      <svg
                        className='w-4 h-4 mr-2 opacity-70'
                        viewBox='0 0 24 24'
                        fill='none'
                        stroke='currentColor'
                        strokeWidth='2'
                      >
                        <path d='M12 18.5a6.5 6.5 0 1 1 0-13 6.5 6.5 0 0 1 0 13zM12 2v4M12 18v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M2 12h4M18 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83' />
                      </svg>
                      Sleep
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className='flex items-center px-3 py-2.5 hover:bg-accent/10 focus:bg-accent/20 cursor-pointer'
                      onClick={handleRestart}
                    >
                      <svg
                        className='w-4 h-4 mr-2 opacity-70'
                        viewBox='0 0 24 24'
                        fill='none'
                        stroke='currentColor'
                        strokeWidth='2'
                      >
                        <path d='M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1.03 6.7 2.83L21 8' />
                        <path d='M21 3v5h-5' />
                      </svg>
                      Restart
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className='flex items-center px-3 py-2.5 hover:bg-accent/10 focus:bg-accent/20 cursor-pointer'
                      onClick={handleShutdown}
                    >
                      <svg
                        className='w-4 h-4 mr-2 opacity-70'
                        viewBox='0 0 24 24'
                        fill='none'
                        stroke='currentColor'
                        strokeWidth='2'
                      >
                        <path d='M18.36 6.64a9 9 0 1 1-12.73 0M12 2v10' />
                      </svg>
                      Shut down
                    </DropdownMenuItem>
                  </motion.div>
                </DropdownMenuContent>
              </DropdownMenu>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <SettingsMenu
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
      />
    </>
  );
}

function StartMenuItem({
  icon,
  label,
  onClick,
}: {
  icon: string;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className='flex items-center gap-3 p-2 rounded-md hover:bg-accent/10 transition-colors w-full group'
    >
      <Image
        src={icon}
        alt={label}
        width={20}
        height={20}
        className='opacity-70 group-hover:opacity-90 transition-opacity'
      />
      <span className='text-text-secondary text-sm group-hover:text-text-primary transition-colors'>
        {label}
      </span>
    </button>
  );
}
