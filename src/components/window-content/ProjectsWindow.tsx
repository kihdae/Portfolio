import { motion } from 'framer-motion';
import { FolderGit2 } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useState, useEffect } from 'react';
import { ClientSideAnimations } from './ClientSideAnimations';

export const DeploymentEffect = ({
  text = '🫣 Nothing to show here just yet! Deployed apps coming…',
  speed = 50,
  className = '',
}: {
  text?: string;
  speed?: number;
  className?: string;
}) => {
  const [displayedText, setDisplayedText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [loopNum, setLoopNum] = useState(0);

  useEffect(() => {
    const handleTyping = () => {
      const fullText = text;
      const updatedText = isDeleting
        ? fullText.substring(0, displayedText.length - 1)
        : fullText.substring(0, displayedText.length + 1);

      setDisplayedText(updatedText);

      if (!isDeleting && updatedText === fullText) {
        setTimeout(() => setIsDeleting(true), 2000);
      } else if (isDeleting && updatedText === '') {
        setIsDeleting(false);
        setLoopNum(loopNum + 1);
      }
    };

    const ticker = setTimeout(handleTyping, speed);
    return () => clearTimeout(ticker);
  }, [displayedText, isDeleting, text, loopNum, speed]);

  return (
    <span
      className={`text-[var(--color-text-secondary)] text-center mt-2 ${className}`}
    >
      {displayedText}
      <span className='animate-ping'>|</span>
    </span>
  );
};

function ProjectsWindowClient() {
  return (
    <ScrollArea className='h-full'>
      <div className='p-6 md:p-8 lg:p-10 flex flex-col items-center justify-center h-full'>
        <ClientSideAnimations>
          <div className='text-center mb-8'>
            <h1 className='text-3xl md:text-4xl font-bold text-[var(--color-text-primary)]'>
              Projects
            </h1>
            <p className='text-lg md:text-xl text-[var(--color-accent-primary)] font-medium'>
              Soon to be a curated selection of my work
            </p>
          </div>
        </ClientSideAnimations>

        <ClientSideAnimations delay={0.2}>
          <div className='flex flex-col items-center justify-center p-6 bg-[var(--color-surface-secondary)] rounded-lg shadow-lg'>
            <FolderGit2 className='w-16 h-16 text-[var(--color-accent-primary)] mb-4' />
            <h1 className='text-xl font-semibold text-[var(--color-text-primary)]'>
              Huh, nothing here?
            </h1>
            <DeploymentEffect
              text='🫣 Nothing to show here just yet! Deployed MVPs coming soon…'
              className='text-xl font-bold text-[var(--color-text-secondary)] mt-2 mb-2 text-center'
            />
          </div>
        </ClientSideAnimations>
      </div>
    </ScrollArea>
  );
}

export default function ProjectsWindow() {
  return <ProjectsWindowClient />;
}
