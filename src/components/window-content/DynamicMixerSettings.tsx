import dynamic from 'next/dynamic';

const MixerSettings = dynamic(() => import('./MixerSettings'), {
  loading: () => (
    <div className='flex items-center justify-center h-full'>
      <div className='text-center'>
        <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--color-accent-primary)] mx-auto mb-4'></div>
        <p className='text-[var(--color-text-secondary)]'>
          Loading mixer settings...
        </p>
      </div>
    </div>
  ),
  ssr: false,
});

import type {
  VisualizerType,
  VisualParameters,
  AudioMapping,
  VisualizerPreset,
  PerformanceMetrics,
} from '@/types/visualizer';

interface DynamicMixerSettingsProps {
  isOpen: boolean;
  onClose: () => void;
  visualizerType: VisualizerType;
  setVisualizerType: (type: VisualizerType) => void;
  visualParams: VisualParameters;
  setVisualParams: (params: VisualParameters) => void;
  audioMapping: AudioMapping;
  setAudioMapping: (mapping: AudioMapping) => void;
  performanceMetrics: PerformanceMetrics;
  savedPresets: VisualizerPreset[];
  currentPreset: VisualizerPreset | null;
  onSavePreset: () => void;
  onLoadPreset: (preset: VisualizerPreset) => void;
  onDeletePreset: (presetId: string) => void;
}

export default function DynamicMixerSettings(props: DynamicMixerSettingsProps) {
  return <MixerSettings {...props} />;
}
