import dynamic from 'next/dynamic';

const MediaPlayer = dynamic(() => import('./media-player'), {
  loading: () => (
    <div className='flex items-center justify-center h-full'>
      <div className='text-center'>
        <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--color-accent-primary)] mx-auto mb-4'></div>
        <p className='text-[var(--color-text-secondary)]'>Loading player...</p>
      </div>
    </div>
  ),
  ssr: false,
});

interface DynamicMediaPlayerProps {
  onMinimize?: () => void;
  onClose?: () => void;
  minimized?: boolean;
}

export default function DynamicMediaPlayer(props: DynamicMediaPlayerProps) {
  return <MediaPlayer {...props} />;
}
