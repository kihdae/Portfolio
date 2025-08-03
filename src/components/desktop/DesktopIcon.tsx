'use client';

import Image from 'next/image';

interface DesktopIconProps {
  name: string;
  icon: string;
  position: { x: number; y: number };
  isActive: boolean;
  onClick: () => void;
}

export default function DesktopIcon({
  name,
  icon,
  position,
  isActive,
  onClick,
}: DesktopIconProps) {
  return (
    <button
      onClick={onClick}
      className={`
        absolute flex flex-col items-center
        min-w-[76px] max-w-[76px] p-2
        transition-all duration-200 ease-out
        rounded-lg
        hover:bg-white/10 active:bg-white/20
        ${isActive ? 'bg-white/20' : ''}
        backdrop-blur-sm
      `}
      style={{
        left: position.x,
        top: position.y,
      }}
    >
      <div
        className={`
          relative flex items-center justify-center
          w-10 h-10
          transition-transform duration-200
          ${isActive ? 'scale-105' : 'scale-100'}
          group-hover:scale-105
        `}
      >
        <Image
          src={icon}
          alt={name}
          width={32}
          height={32}
          className='
            select-none
            pointer-events-none
            object-contain
            transition-opacity duration-200
            group-hover:opacity-90
          '
          style={{
            filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))',
          }}
          priority
        />
      </div>

      <span
        className='
          mt-1.5
          text-sm text-white/90 text-center
          leading-tight
          w-full
          select-none break-words
          font-sans
          tracking-wide
          transition-colors duration-200
          group-hover:text-white
        '
      >
        {name}
      </span>
    </button>
  );
}
