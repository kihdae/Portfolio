'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '@/contexts/ThemeContext';
import { useBackground } from '@/contexts/BackgroundContext';
import { getThemeDebugInfo, logThemeDebugInfo } from '@/lib/themeValidator';
import { Settings, Palette, RotateCcw, Image, Bug, Info } from 'lucide-react';

interface SettingsMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SettingsMenu({ isOpen, onClose }: SettingsMenuProps) {
  const { theme, setTheme, availableThemes } = useTheme();
  const { background, setBackground, availableBackgrounds } = useBackground();

  const handleThemeChange = (newTheme: string) => {
    setTheme(newTheme as keyof typeof availableThemes);
  };

  const handleBackgroundChange = (newBackground: string) => {
    setBackground(newBackground as keyof typeof availableBackgrounds);
  };

  const handleReset = () => {
    setTheme('plasma');
    setBackground('animated_cat_city');
  };

  const handleDebugTheme = () => {
    logThemeDebugInfo();
  };

  const handleShowThemeInfo = () => {
    const debugInfo = getThemeDebugInfo();
   
    alert(
      `Current Theme: ${debugInfo.currentTheme}\nApplied Variables: ${debugInfo.validationResult.appliedVariables.length}\nMissing Variables: ${debugInfo.validationResult.missingVariables.length}\nCheck console for detailed information.`
    );
  };

  return (
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
          className='absolute bottom-12 left-2 w-[320px] bg-[#0D1117]/80 backdrop-blur-xl rounded-lg overflow-hidden z-50 shadow-2xl border border-white/5'
        >
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className='p-4 flex items-center justify-between border-b border-white/5'
          >
            <div className='flex items-center gap-3'>
              <Settings className='w-5 h-5 text-white/70' />
              <h3 className='text-white/90 font-medium'>Theme Settings</h3>
            </div>
            <button
              onClick={onClose}
              className='text-white/50 hover:text-white/70 transition-colors'
            >
              ×
            </button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className='p-4 border-b border-white/5'
          >
            <div className='flex items-center gap-2 mb-3'>
              <Palette className='w-4 h-4 text-white/70' />
              <h4 className='text-white/80 text-sm font-medium'>Theme</h4>
            </div>
            <div className='space-y-2'>
              {Object.entries(availableThemes).map(([key, name]) => (
                <button
                  key={key}
                  onClick={() => handleThemeChange(key)}
                  className={`w-full flex items-center justify-between p-3 rounded-lg border transition-all duration-200 ${
                    theme === key
                      ? 'border-white/50 bg-white/10'
                      : 'border-white/10 hover:border-white/30 hover:bg-white/5'
                  }`}
                >
                  <span className='text-white/80 text-sm'>{name}</span>
                  {theme === key && (
                    <div className='w-3 h-3 bg-white rounded-full' />
                  )}
                </button>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className='p-4 border-b border-white/5'
          >
            <div className='flex items-center gap-2 mb-3'>
              <Image className='w-4 h-4 text-white/70' />
              <h4 className='text-white/80 text-sm font-medium'>Background</h4>
            </div>
            <div className='space-y-2 max-h-40 overflow-y-auto'>
              {Object.entries(availableBackgrounds).map(
                ([key, backgroundInfo]) => (
                  <button
                    key={key}
                    onClick={() => handleBackgroundChange(key)}
                    className={`w-full flex items-center justify-between p-3 rounded-lg border transition-all duration-200 ${
                      background === key
                        ? 'border-white/50 bg-white/10'
                        : 'border-white/10 hover:border-white/30 hover:bg-white/5'
                    }`}
                  >
                    <span className='text-white/80 text-sm'>
                      {backgroundInfo.name}
                    </span>
                    {background === key && (
                      <div className='w-3 h-3 bg-white rounded-full' />
                    )}
                  </button>
                )
              )}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className='p-4 border-b border-white/5'
          >
            <div className='flex items-center gap-2 mb-3'>
              <Bug className='w-4 h-4 text-white/70' />
              <h4 className='text-white/80 text-sm font-medium'>Debug Tools</h4>
            </div>
            <div className='space-y-2'>
              <button
                onClick={handleDebugTheme}
                className='w-full flex items-center justify-center gap-2 p-3 text-white/70 hover:text-white/90 hover:bg-white/5 rounded-lg transition-colors'
              >
                <Bug className='w-4 h-4' />
                <span className='text-sm'>Log Theme Debug Info</span>
              </button>
              <button
                onClick={handleShowThemeInfo}
                className='w-full flex items-center justify-center gap-2 p-3 text-white/70 hover:text-white/90 hover:bg-white/5 rounded-lg transition-colors'
              >
                <Info className='w-4 h-4' />
                <span className='text-sm'>Show Theme Status</span>
              </button>
            </div>
          </motion.div>
            
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className='p-4'
          >
            <button
              onClick={handleReset}
              className='w-full flex items-center justify-center gap-2 p-3 text-white/70 hover:text-white/90 hover:bg-white/5 rounded-lg transition-colors'
            >
              <RotateCcw className='w-4 h-4' />
              <span className='text-sm'>Reset to Default</span>
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
