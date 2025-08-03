import AboutMeWindow from '@/components/window-content/AboutMeWindow';
import ContactMeWindow from '@/components/window-content/ContactMeWindow';
import WeatherWindow from '@/components/window-content/WeatherWindow';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

import type { WindowType } from '@/types/desktop';
import dynamic from 'next/dynamic';
import PlayerErrorBoundary from '@/components/window-content/PlayerErrorBoundary';
import SkillsWindow from '@/components/window-content/SkillsWindow';
import ExperienceWindow from '@/components/window-content/ExperienceWindow';
import Link from 'next/link';
import Image from 'next/image';
import ProjectsWindow from '../window-content/ProjectsWindow';
const SpotifyPlayer = dynamic(
  () => import('@/components/window-content/media-player'),
  {
    ssr: false,
  }
);

interface WindowContentProps {
  type: WindowType['title'];
  onMinimize?: () => void;
  onClose?: () => void;
  minimized?: boolean;
}

export default function WindowContent({
  type,
  onMinimize,
  onClose,
  minimized = false,
}: WindowContentProps) {
  const renderContent = () => {
    switch (type) {
      case 'spotify':
        return (
          <PlayerErrorBoundary>
            <SpotifyPlayer
              onMinimize={onMinimize}
              onClose={onClose}
              minimized={minimized}
            />
          </PlayerErrorBoundary>
        );

      case 'about':
        return <AboutMeWindow />;

      case 'projects':
        return <ProjectsWindow />;

      case 'experience':
        return <ExperienceWindow />;

      case 'education':
        return (
          <div className='p-6'>
            <h2 className='text-2xl font-bold text-[var(--color-text-primary)] mb-4'>
              Education
            </h2>
            <div className='space-y-4'>
              <div
                className='border rounded-lg p-4'
                style={{ borderColor: 'var(--color-border)' }}
              >
                <h3 className='font-semibold text-[var(--color-text-primary)]'>
                  Bachelor of Science in Computer Science
                </h3>
                <p className='text-[var(--color-text-secondary)] text-sm'>
                  University Name • 2018 - 2022
                </p>
                <p className='text-[var(--color-text-secondary)] text-sm mt-2'>
                  Relevant coursework: Data Structures, Algorithms, Web
                  Development, Database Systems, Software Engineering
                </p>
              </div>

              <div
                className='border rounded-lg p-4'
                style={{ borderColor: 'var(--color-border)' }}
              >
                <h3 className='font-semibold text-[var(--color-text-primary)]'>
                  Certifications
                </h3>
                <ul className='text-[var(--color-text-secondary)] text-sm mt-2 space-y-1'>
                  <li>• AWS Certified Developer Associate</li>
                  <li>• Google Cloud Professional Developer</li>
                  <li>• MongoDB Certified Developer</li>
                </ul>
              </div>
            </div>
          </div>
        );

      case 'skills':
        return <SkillsWindow />;

      case 'contact':
        return <ContactMeWindow />;

      case 'weather':
        return <WeatherWindow />;

      case 'github':
        return (
          <div className='p-6'>
            <h2 className='text-2xl font-bold text-[var(--color-text-primary)] mb-4'>
              GitHub Profile
            </h2>
            <div className='text-center py-8'>
              <div className='text-6xl mb-4'>🐙</div>
              <p className='text-[var(--color-text-secondary)] mb-4'>
                Visit my GitHub profile to see my latest projects and
                contributions
              </p>
              <button className='bg-[var(--color-accent-primary)] text-[var(--color-background-primary)] px-6 py-2 rounded hover:opacity-90 transition-opacity'>
                Open GitHub
                <Link href='https://github.com/kihdae' target='_blank'></Link>
              </button>
            </div>
          </div>
        );

      default:
        return (
          <div className='p-6'>
            <h2 className='text-2xl font-bold text-[var(--color-text-primary)] mb-4'>
              Window Content
            </h2>
            <p className='text-[var(--color-text-secondary)]'>
              Content for {type} window
            </p>
          </div>
        );
    }
  };

  return renderContent();
}
