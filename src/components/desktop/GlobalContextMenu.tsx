'use client';

import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
  ContextMenuSeparator,
} from '@/components/ui/context-menu';
import {
  Eye,
  X,
  User,
  FolderOpen,
  Briefcase,
  Code,
  Mail,
  Cloud,
} from 'lucide-react';

interface WindowType {
  id: string;
  type: string;
  title: string;
  isMinimized: boolean;
  position: { x: number; y: number };
  size: { width: number; height: number };
  constraints?: any;
}

interface GlobalContextMenuProps {
  children: React.ReactNode;
  windows: WindowType[];
  minimizedWindows: WindowType[];
  onWindowOpen: (type: string, title: string) => void;
  onWindowClose: (id: string) => void;
  onWindowRestore: (id: string) => void;
}

const DESKTOP_ICONS = [
  {
    name: 'About',
    type: 'about',
    icon: User,
  },
  {
    name: 'Projects',
    type: 'projects',
    icon: FolderOpen,
  },
  {
    name: 'Previous Work',
    type: 'experience',
    icon: Briefcase,
  },
  {
    name: 'Skills',
    type: 'skills',
    icon: Code,
  },
  {
    name: 'Contact',
    type: 'contact',
    icon: Mail,
  },
  {
    name: 'Weather',
    type: 'weather',
    icon: Cloud,
  },
];

export default function GlobalContextMenu({
  children,
  windows,
  minimizedWindows,
  onWindowOpen,
  onWindowClose,
  onWindowRestore,
}: GlobalContextMenuProps) {
  const handleShowAllWindows = () => {
    // Restore all minimized windows
    minimizedWindows.forEach(window => {
      onWindowRestore(window.id);
    });
  };

  const handleCloseAllWindows = () => {
    // Close all open windows
    windows.forEach(window => {
      if (!window.isMinimized) {
        onWindowClose(window.id);
      }
    });
  };

  const handleOpenWindow = (type: string, title: string) => {
    // Ignore media player (spotify) completely in context menu
    if (type === 'spotify') {
      return;
    }

    // Check if window already exists and is open
    const existingWindow = windows.find(w => w.type === type && !w.isMinimized);

    if (existingWindow) {
      return;
    }

    // Check if window is minimized
    const existingMinimizedWindow = minimizedWindows.find(w => w.type === type);

    if (existingMinimizedWindow) {
      onWindowRestore(existingMinimizedWindow.id);
      return;
    }

    // Create new window only if it doesn't exist at all
    onWindowOpen(type, title);
  };

  return (
    <ContextMenu>
      <ContextMenuTrigger className='h-full w-full'>
        {children}
      </ContextMenuTrigger>
      <ContextMenuContent
        className='w-56'
        style={{
          backgroundColor: 'var(--color-surface-primary)',
          color: 'var(--color-text-primary)',
          border: '1px solid var(--color-border)',
          boxShadow: '0 4px 6px -1px var(--color-shadow)',
          backdropFilter: 'blur(8px)',
        }}
      >
        {/* Window Management */}
        <ContextMenuItem
          onClick={e => {
            e.preventDefault();
            e.stopPropagation();
            handleShowAllWindows();
          }}
          className='flex items-center gap-2 cursor-pointer transition-colors duration-200'
          style={{
            color: 'var(--color-text-primary)',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.backgroundColor =
              'var(--color-interactive-hover)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.backgroundColor = 'transparent';
          }}
        >
          <Eye
            className='w-4 h-4'
            style={{ color: 'var(--color-accent-primary)' }}
          />
          Show All Windows
        </ContextMenuItem>
        <ContextMenuItem
          onClick={e => {
            e.preventDefault();
            e.stopPropagation();
            handleCloseAllWindows();
          }}
          className='flex items-center gap-2 cursor-pointer transition-colors duration-200'
          variant='destructive'
          style={{
            color: 'var(--color-error)',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.backgroundColor = 'rgba(255, 83, 73, 0.1)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.backgroundColor = 'transparent';
          }}
        >
          <X className='w-4 h-4' style={{ color: 'var(--color-error)' }} />
          Close All Windows
        </ContextMenuItem>

        <ContextMenuSeparator
          style={{ backgroundColor: 'var(--color-border)' }}
        />

        {/* Desktop Applications */}
        <div
          className='px-2 py-1.5 text-xs font-medium'
          style={{ color: 'var(--color-text-secondary)' }}
        >
          Applications
        </div>

        {DESKTOP_ICONS.map(icon => {
          const IconComponent = icon.icon;
          return (
            <ContextMenuItem
              key={icon.type}
              onClick={e => {
                e.preventDefault();
                e.stopPropagation();
                handleOpenWindow(icon.type, icon.name);
              }}
              className='flex items-center gap-2 cursor-pointer transition-colors duration-200'
              style={{
                color: 'var(--color-text-primary)',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.backgroundColor =
                  'var(--color-interactive-hover)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              <IconComponent
                className='w-4 h-4'
                style={{ color: 'var(--color-accent-primary)' }}
              />
              {icon.name}
            </ContextMenuItem>
          );
        })}

        <ContextMenuSeparator
          style={{ backgroundColor: 'var(--color-border)' }}
        />
      </ContextMenuContent>
    </ContextMenu>
  );
}
