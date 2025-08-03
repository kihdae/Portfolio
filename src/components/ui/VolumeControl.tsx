'use client';

import { useState, useEffect, useRef } from 'react';
import { useVolume } from '@/contexts/VolumeContext';
import { Volume2, VolumeX, Plus, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function VolumeControl() {
  const { volume, isMuted, setVolume, toggleMute } = useVolume();
  const [showPanel, setShowPanel] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  const handleClickOutside = (event: MouseEvent) => {
    if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
      setShowPanel(false);
    }
  };

  useEffect(() => {
    if (showPanel) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showPanel]);

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVolume(parseFloat(e.target.value));
  };

  const incrementVolume = () => {
    setVolume(Math.min(volume + 1, 100));
  };

  const decrementVolume = () => {
    setVolume(Math.max(volume - 1, 0));
  };

  return (
    <div className='relative'>
      <button
        className='wmp-control-button'
        onClick={() => setShowPanel(!showPanel)}
        title={isMuted ? 'Unmute' : 'Mute'}
      >
        {isMuted ? (
          <VolumeX className='w-4 h-4' />
        ) : (
          <Volume2 className='w-4 h-4' />
        )}
      </button>
      {showPanel && (
        <div
          ref={panelRef}
          className='absolute bottom-full mb-2 w-24 p-4 bg-surface/90 backdrop-blur-xl border border-accent/10 rounded-lg shadow-lg'
        >
          <div className='flex flex-col items-center'>
            <div className='relative h-32 w-full'>
              {/* Volume level indicator */}
              <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rotate-[-90deg] w-32 h-4 bg-surface/30 rounded-full overflow-hidden'>
                <div
                  className='h-full bg-accent transition-all duration-150 ease-out'
                  style={{ width: `${volume}%` }}
                />
              </div>
              <input
                type='range'
                min='0'
                max='100'
                step='0.1'
                value={volume}
                onChange={handleVolumeChange}
                className='w-32 h-4 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rotate-[-90deg] wmp-volume-slider opacity-0 hover:opacity-100 transition-opacity'
              />
            </div>
            <div className='flex items-center justify-between w-full mt-2'>
              <button onClick={decrementVolume} className='wmp-control-button'>
                <Minus className='w-3 h-3' />
              </button>
              <span className='text-text-primary text-xs font-medium'>
                {isMuted ? 'Muted' : `${Math.round(volume)}%`}
              </span>
              <button onClick={incrementVolume} className='wmp-control-button'>
                <Plus className='w-3 h-3' />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
