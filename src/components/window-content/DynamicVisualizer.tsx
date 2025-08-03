import dynamic from 'next/dynamic';
import { getPerfectPresetForType } from '@/lib/visualizerPresets';
import type { VisualizerType, AudioData } from '@/types/visualizer';

// Dynamically import the Visualizer component
const Visualizer = dynamic(() => import('./Visualizer'), {
  loading: () => (
    <div className='flex items-center justify-center h-full'>
      <div className='text-center'>
        <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--color-accent-primary)] mx-auto mb-4'></div>
        <p className='text-[var(--color-text-secondary)]'>
          Loading visualizer...
        </p>
      </div>
    </div>
  ),
  ssr: false,
});

interface DynamicVisualizerProps {
  audioData?: AudioData | null;
  visualizerType?: VisualizerType;
  visualParameters?: any;
  audioMapping?: any;
  performanceMetrics?: any;
  isPlaying?: boolean;
  volume?: number;
  audioElement?: HTMLAudioElement | null;
  audioContext?: AudioContext | null;
  sourceNode?: MediaElementAudioSourceNode | null;
  visualParams?: any;
}

export default function DynamicVisualizer(props: DynamicVisualizerProps) {
  const visualizerType = props.visualizerType || 'spectrum-circle';
  const defaultPreset = getPerfectPresetForType(visualizerType);

  const visualParams =
    props.visualParameters || defaultPreset?.visualParameters;
  const audioMapping = props.audioMapping || defaultPreset?.audioMapping;

  return (
    <Visualizer
      isPlaying={props.isPlaying ?? true}
      volume={props.volume ?? 0.5}
      audioElement={props.audioElement ?? null}
      audioContext={props.audioContext ?? null}
      sourceNode={props.sourceNode ?? null}
      audioData={props.audioData ?? null}
      visualizerType={visualizerType}
      visualParams={visualParams}
      audioMapping={audioMapping}
      {...props}
    />
  );
}
