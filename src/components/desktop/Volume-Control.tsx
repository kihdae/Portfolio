'use client';

import { Volume2, VolumeX } from 'lucide-react';

interface VolumeControlProps {
  onClose: () => void;
  volume: number;
  isMuted: boolean;
  onVolumeChange: (volume: number) => void;
  onToggleMute: () => void;
}

export default function VolumeControl({
  onClose,
  volume,
  isMuted,
  onVolumeChange,
  onToggleMute,
}: VolumeControlProps) {
  const volumePercentage = Math.round(volume);

  return (
    <div className='absolute bottom-14 right-16 w-80 bg-black/80 backdrop-blur-xl rounded-lg border border-white/20 shadow-2xl z-40 animate-in slide-in-from-bottom-2 duration-200'>
      <div className='p-4'>
        <div className='flex items-center justify-between mb-4'>
          <h3 className='text-white font-medium'>Volume</h3>
          <button
            onClick={onToggleMute}
            className='text-white/70 hover:text-white transition-colors'
          >
            {isMuted ? (
              <VolumeX className='w-4 h-4' />
            ) : (
              <Volume2 className='w-4 h-4' />
            )}
          </button>
        </div>

        <div className='flex items-center gap-4'>
          <input
            type='range'
            min='0'
            max='100'
            value={isMuted ? 0 : volumePercentage}
            onChange={e => onVolumeChange(Number(e.target.value))}
            className='flex-1 h-1 bg-white/20 rounded-full accent-white'
          />
          <span className='text-white/70 text-sm w-12 text-right'>
            {isMuted ? 0 : volumePercentage}%
          </span>
        </div>
      </div>
    </div>
  );
}
