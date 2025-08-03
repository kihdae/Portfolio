import React, { useRef, useEffect, useState } from 'react';

interface AnimatedTrackInfoProps {
  title: string;
  artist: string;
  isPlaying: boolean;
}

export function AnimatedTrackInfo({
  title,
  artist,
  isPlaying,
}: AnimatedTrackInfoProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);
  const [isOverflowing, setIsOverflowing] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    const text = textRef.current;

    if (container && text) {
      const checkOverflow = () => {
        const hasOverflow = text.scrollWidth > container.clientWidth;
        setIsOverflowing(hasOverflow);
      };

      checkOverflow();
      window.addEventListener('resize', checkOverflow);
      return () => window.removeEventListener('resize', checkOverflow);
    }
  }, [title]);

  const animationClassName = isPlaying && isOverflowing ? 'animate-slide' : '';

  return (
    <div className='flex flex-col w-full'>
      <div
        ref={containerRef}
        className='relative h-6 w-full overflow-hidden'
        style={{
          maskImage:
            'linear-gradient(to right, transparent, black 5%, black 95%, transparent)',
          WebkitMaskImage:
            'linear-gradient(to right, transparent, black 5%, black 95%, transparent)',
        }}
      >
        <div
          className={`
            absolute top-0 left-0 h-full
            flex items-center
            text-[14px] font-medium text-[a4bcc4] font-cyber-title tracking-wider
            ${animationClassName}
          `}
        >
          <span ref={textRef} className='whitespace-nowrap px-4'>
            {title}
          </span>
        </div>
      </div>

      <div
        className={`
          text-[#a4bcc4] text-[10px] font-cyber tracking-wide
          ${isPlaying ? 'animate-subtle-shake' : ''}
        `}
      >
        {artist}
      </div>

      <style jsx>{`
        .animate-slide {
          animation: slide-elegant 15s ease-in-out infinite;
        }

        @keyframes slide-elegant {
          0% {
            transform: translateX(0);
          }
          15% {
            transform: translateX(0);
          }
          45% {
            transform: translateX(calc(-100% + 80px));
          }
          65% {
            transform: translateX(calc(-100% + 80px));
          }
          85% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(0);
          }
        }

        @keyframes subtle-shake {
          0%,
          100% {
            transform: translateX(0);
          }
          25% {
            transform: translateX(-1px);
          }
          50% {
            transform: translateX(1px);
          }
          75% {
            transform: translateX(-0.5px);
          }
        }

        .animate-subtle-shake {
          animation: subtle-shake 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
