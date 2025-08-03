'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { format } from 'date-fns';
import { useSystemControls } from '@/hooks/useSystemControls';
import type { WindowType } from '@/types/desktop';
import { useVolume } from '@/contexts/VolumeContext';
import {
  Search,
  Wifi,
  Volume2,
  Menu,
  BatteryCharging,
  VolumeX,
  Bell,
} from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import WifiControl from './Wifi-Control';
import Image from 'next/image';

interface TaskbarProps {
  windows: WindowType[];
  minimizedWindows: WindowType[];
  activeWindow: string | null;
  onWindowClick: (id: string) => void;
  onStartClick: () => void;
  showStartMenu: boolean;
  systemState: ReturnType<typeof useSystemControls>['systemState'];
  systemControls: ReturnType<typeof useSystemControls>['systemControls'];
  onSearch: () => void;
  onSelectIcon: (type: string, name: string) => void;
}

export default function Taskbar({
  windows,
  minimizedWindows,
  activeWindow,
  onWindowClick,
  onStartClick,
  showStartMenu,
  systemControls,
  onSearch,
  // @ts-ignore
  icons,
  onSelectIcon,
}: TaskbarProps) {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showWifiControl, setShowWifiControl] = useState(false);
  const [showVolumeControl, setShowVolumeControl] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const {
    volume: contextVolume,
    isMuted: contextIsMuted
  } = useVolume();
  const searchInputRef = useRef<HTMLInputElement>(null);

  const filteredIcons = searchTerm
    ? icons.filter((icon: any) =>
        icon.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const getIconPathForWindow = useCallback(
    (type: string) => {
      const icon = icons.find((i: any) => i.type === type);
      return icon ? icon.icon : '/icons/default.png';
    },
    [icons]
  );

  const openWindowsOnTaskbar = windows.filter(w => !w.isMinimized);
  const allManagedWindows = [...openWindowsOnTaskbar, ...minimizedWindows];

  const uniqueWindows = allManagedWindows.reduce((acc, window) => {
    const existing = acc.find(w => w.type === window.type);
    if (!existing) {
      acc.push(window);
    }
    return acc;
  }, [] as WindowType[]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '/' && !isSearchFocused) {
        e.preventDefault();
        searchInputRef.current?.focus();
      }

      if (isSearchFocused) {
        switch (e.key) {
          case 'ArrowDown':
            e.preventDefault();
            if (filteredIcons.length > 0) {
              setShowSearchResults(true);
              setSelectedIndex(prev => (prev + 1) % filteredIcons.length);
            }
            break;
          case 'ArrowUp':
            e.preventDefault();
            if (filteredIcons.length > 0) {
              setShowSearchResults(true);
              setSelectedIndex(
                prev => (prev - 1 + filteredIcons.length) % filteredIcons.length
              );
            }
            break;
          case 'Enter':
            e.preventDefault();
            if (filteredIcons.length > 0) {
              const selected = filteredIcons[selectedIndex];
              onSelectIcon(selected.type, selected.name);
              setSearchTerm('');
              setShowSearchResults(false);
              searchInputRef.current?.blur();
            } else if (searchTerm) {
              onSearch();
              setSearchTerm('');
              searchInputRef.current?.blur();
            }
            break;
          case 'Escape':
            e.preventDefault();
            setShowSearchResults(false);
            searchInputRef.current?.blur();
            break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    isSearchFocused,
    filteredIcons,
    selectedIndex,
    onSearch,
    onSelectIcon,
    searchTerm,
  ]);

  return (
    <>
      <div
        className='absolute bottom-0 left-0 right-0 h-12 bg-surface/80 backdrop-blur-xl border-t flex items-center px-2 z-50'
        style={{ borderColor: 'var(--color-border)' }}
      >
        <button
          className={`flex items-center gap-2 h-10 px-4 rounded-md transition-all duration-200 ${
            showStartMenu ? 'bg-blue-600' : 'hover:bg-gray-700'
          }`}
          onClick={onStartClick}
        >
          <Menu className='w-5 h-5' />
          <span className='font-semibold text-lg'>Start</span>
        </button>

        <div className='relative flex items-center space-x-2 ml-2 px-3 py-1.5 bg-surface/50 hover:bg-surface/80 rounded-md transition-all duration-200 min-w-0 flex-shrink-0 group'>
          <Search className='w-4 h-4 text-text-secondary' />
          <input
            ref={searchInputRef}
            type='text'
            value={searchTerm}
            onChange={e => {
              setSearchTerm(e.target.value);
              setShowSearchResults(true);
              setSelectedIndex(0);
            }}
            placeholder='Type to search'
            className='text-sm text-text-primary bg-transparent outline-none w-24 sm:w-32 placeholder:text-text-secondary'
            onFocus={() => {
              setIsSearchFocused(true);
              setShowSearchResults(true);
            }}
            onBlur={() => {
              setIsSearchFocused(false);
              setTimeout(() => setShowSearchResults(false), 200);
            }}
          />


          {showSearchResults && filteredIcons.length > 0 && (
            <div className='absolute bottom-full left-0 w-64 mb-2 bg-surface/90 backdrop-blur-md border border-accent/10 rounded-lg shadow-xl overflow-hidden'>
              {filteredIcons.map((icon: any, index: number) => (
                <button
                  key={icon.name}
                  className={`
                    w-full px-4 py-3 flex items-center gap-3 
                    hover:bg-accent/10 transition-colors
                    ${selectedIndex === index ? 'bg-accent/20' : ''}
                  `}
                  onClick={() => {
                    onSelectIcon(getIconPathForWindow(icon.type), icon.name);
                    setSearchTerm('');
                    setShowSearchResults(false);
                  }}
                  onMouseEnter={() => setSelectedIndex(index)}
                >
                  <Image
                    src={icon.icon}
                    alt={icon.name}
                    width={24}
                    height={24}
                    className='object-contain'
                  />
                  <span className='text-text-primary font-serif'>
                    {icon.name}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className='flex-1 flex justify-center items-center space-x-1 mx-4'>
          {uniqueWindows.map(window => (
            <button
              key={window.id}
              onClick={() => onWindowClick(window.id)}
              className={`flex items-center space-x-2 px-3 py-1.5 rounded-md transition-all duration-200 max-w-48 min-w-0 ${
                activeWindow === window.id && !window.isMinimized
                  ? 'bg-accent/20 border-b-2 border-accent'
                  : 'hover:bg-accent/10'
              } ${window.isMinimized ? 'opacity-70' : ''}`}
            >
              <span className='text-lg'>
                {window.type === 'about'
                  ? '👤'
                  : window.type === 'projects'
                    ? '📁'
                    : window.type === 'experience'
                      ? '💼'
                      : window.type === 'education'
                        ? '🎓'
                        : window.type === 'skills'
                          ? '⚙️'
                          : window.type === 'contact'
                            ? '📧'
                            : window.type === 'github'
                              ? '🐙'
                              : window.type === 'spotify'
                                ? '🎵'
                                : window.type === 'weather'
                                  ? '🌤️'
                                  : '📄'}
              </span>
              <span className='text-sm text-text-primary truncate font-serif'>
                {window.title}
              </span>
              {window.isMinimized && (
                <span className='w-2 h-2 bg-blue-500 rounded-full border border-gray-900'></span>
              )}
            </button>
          ))}
        </div>

        <div className='flex items-center gap-3 pr-2'>
          <TooltipProvider delayDuration={300}>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  className='relative p-1.5 hover:bg-gray-700 rounded-md transition-all duration-200'
                  title='Notifications'
                >
                  <Bell className='w-5 h-5 text-white' />
                  <div className='absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full animate-pulse'></div>
                </button>
              </TooltipTrigger>
              <TooltipContent
                side='top'
                className='bg-gray-700 text-white text-xs px-2 py-1 rounded'
              >
                Notifications
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider delayDuration={300}>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  className='p-1.5 hover:bg-gray-700 rounded-md'
                  onClick={() => setShowVolumeControl(!showVolumeControl)}
                  title={contextIsMuted ? 'Unmute' : 'Mute'}
                >
                  {contextIsMuted || contextVolume === 0 ? (
                    <VolumeX className='w-5 h-5' />
                  ) : (
                    <Volume2 className='w-5 h-5' />
                  )}
                </button>
              </TooltipTrigger>
              <TooltipContent
                side='top'
                className='bg-gray-700 text-white text-xs px-2 py-1 rounded'
              >
                Volume: {contextIsMuted ? 'Muted' : `${contextVolume}%`}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider delayDuration={300}>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={() => setShowWifiControl(!showWifiControl)}
                  className='p-1.5 text-white/70 hover:text-white transition-colors'
                >
                  <Wifi className='w-5 h-5' />
                </button>
              </TooltipTrigger>
              <TooltipContent
                side='top'
                className='bg-gray-700 text-white text-xs px-2 py-1 rounded'
              >
                Wi-Fi
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          {showWifiControl && (
            <WifiControl onClose={() => setShowWifiControl(false)} />
          )}

          <TooltipProvider delayDuration={300}>
            <Tooltip>
              <TooltipTrigger asChild>
                <span className='p-1.5 text-white/70'>
                  <BatteryCharging className='w-5 h-5' />
                </span>
              </TooltipTrigger>
              <TooltipContent
                side='top'
                className='bg-gray-700 text-white text-xs px-2 py-1 rounded'
              >
                Battery: 90%
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <div className='text-sm text-gray-300 font-mono text-right flex flex-col items-end'>
            <span>{format(currentTime, 'hh:mm aa')}</span>
            <span className='text-xs'>{format(currentTime, 'MM/dd/yyyy')}</span>
          </div>
        </div>
      </div>

      {showVolumeControl && (
        <div className='absolute bottom-16 right-2 bg-[var(--color-surface-primary)]/90 backdrop-blur-xl border border-[var(--color-accent-primary)]/15 rounded-xl p-4 shadow-2xl min-w-[200px] z-[60] transition-all duration-300'>
          <div className='flex items-center justify-between mb-3'>
            <span className='text-sm font-medium text-[var(--color-text-primary)]'>
              Volume
            </span>
            <span className='text-xs text-[var(--color-text-secondary)] font-mono'>
              {contextVolume}%
            </span>
          </div>
          <div className='relative'>
            <input
              type='range'
              min='0'
              max='100'
              value={contextVolume}
              onChange={e => systemControls.setVolume(Number(e.target.value))}
              className='w-full h-1.5 bg-[var(--color-surface-secondary)]/20 rounded-full appearance-none cursor-pointer
                [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 
                [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[var(--color-accent-primary)]/30
                [&::-webkit-slider-thumb]:border [&::-webkit-slider-thumb]:border-[var(--color-accent-primary)]/50
                [&::-webkit-slider-thumb]:shadow-[0_0_5px_color-mix(in_srgb,var(--color-accent-primary)_20%,transparent)]
                [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:transition-all [&::-webkit-slider-thumb]:duration-300
                [&::-webkit-slider-thumb]:hover:bg-[var(--color-accent-primary)]/50 [&::-webkit-slider-thumb]:hover:shadow-[0_0_15px_color-mix(in_srgb,var(--color-accent-primary)_50%,transparent)]
                [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:h-5
                [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-[var(--color-accent-primary)]/30
                [&::-moz-range-thumb]:border [&::-moz-range-thumb]:border-[var(--color-accent-primary)]/50
                [&::-moz-range-thumb]:shadow-[0_0_5px_color-mix(in_srgb,var(--color-accent-primary)_20%,transparent)]
                [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:transition-all [&::-moz-range-thumb]:duration-300
                [&::-moz-range-thumb]:hover:bg-[var(--color-accent-primary)]/50 [&::-moz-range-thumb]:hover:shadow-[0_0_15px_color-mix(in_srgb,var(--color-accent-primary)_50%,transparent)]
                focus:outline-none focus:ring-2 focus:ring-[var(--color-accent-primary)]/20 focus:ring-offset-2 focus:ring-offset-[var(--color-surface-primary)]'
            />
            <div
              className='absolute top-0 left-0 h-1.5 bg-gradient-to-r from-[var(--color-accent-primary)]/40 to-[var(--color-accent-secondary)]/40 rounded-full pointer-events-none transition-all duration-300'
              style={{ width: `${contextVolume}%` }}
            />
          </div>
          <div className='flex items-center justify-between mt-2 text-xs text-[var(--color-text-secondary)]'>
            <span>0%</span>
            <span>100%</span>
          </div>
        </div>
      )}
    </>
  );
}
