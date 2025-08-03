'use client';

import { useEffect, useRef, memo } from 'react';
import { EnhancedVisualizerEngine } from '@/lib/visualizerEngine';
import { useTheme } from '@/contexts/ThemeContext';
import type {
  VisualizerType,
  VisualParameters,
  AudioMapping,
  AudioData,
} from '@/types/visualizer';

interface EnhancedAdvancedVisualizerProps {
  isPlaying: boolean;
  volume: number;
  audioElement: HTMLAudioElement | null;
  audioContext: AudioContext | null;
  sourceNode: MediaElementAudioSourceNode | null;
  audioData: AudioData | null;
  visualizerType: VisualizerType;
  visualParams: VisualParameters;
  audioMapping: AudioMapping;
}

const EnhancedAdvancedVisualizer = memo(function EnhancedAdvancedVisualizer({
  isPlaying,
  audioData,
  visualizerType,
  visualParams,
  audioMapping,
}: EnhancedAdvancedVisualizerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<EnhancedVisualizerEngine | null>(null);
  const { theme } = useTheme();

  useEffect(() => {
    if (!canvasRef.current) return;

    engineRef.current = new EnhancedVisualizerEngine(canvasRef.current);

    engineRef.current.start();

    const forceResize = () => {
      if (engineRef.current) {
        engineRef.current.resize();
      }
    };

    const resizeTimeout = setTimeout(forceResize, 200);

    return () => {
      clearTimeout(resizeTimeout);
      engineRef.current?.stop();
    };
  }, []);

  useEffect(() => {
    if (engineRef.current) {
      requestAnimationFrame(() => {
        engineRef.current?.updateThemeColors();
      });
    }
  }, [theme]);

  useEffect(() => {
    if (!engineRef.current) return;

    const updateConfig = () => {
      if (!engineRef.current) return;

      engineRef.current.setVisualizerType(visualizerType);
      engineRef.current.setVisualParameters(visualParams);
      engineRef.current.setAudioMapping(audioMapping);
    };

    requestAnimationFrame(updateConfig);
  }, [visualizerType, visualParams, audioMapping, isPlaying]);

  useEffect(() => {
    if (!canvasRef.current || !engineRef.current) return;

    const resizeObserver = new ResizeObserver(entries => {
      for (const entry of entries) {
        if (entry.target === canvasRef.current && engineRef.current) {
          requestAnimationFrame(() => {
            if (engineRef.current) {
              engineRef.current.resize();
            }
          });
        }
      }
    });

    resizeObserver.observe(canvasRef.current);

    const handleWindowResize = () => {
      if (engineRef.current) {
        requestAnimationFrame(() => {
          if (engineRef.current) {
            engineRef.current.resize();
          }
        });
      }
    };

    window.addEventListener('resize', handleWindowResize);

    const initialResize = setTimeout(() => {
      if (engineRef.current) {
        engineRef.current.resize();
      }
    }, 100);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('resize', handleWindowResize);
      clearTimeout(initialResize);
    };
  }, [engineRef.current]);

  useEffect(() => {
    if (!engineRef.current) return;

    const updateVisualizer = () => {
      if (engineRef.current) {
        engineRef.current.setAudioData(audioData);
      }
    };

    let animationId: number;
    const updateLoop = () => {
      updateVisualizer();
      animationId = requestAnimationFrame(updateLoop);
    };

    updateLoop();

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [audioData]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden && engineRef.current) {
        requestAnimationFrame(() => {
          if (engineRef.current) {
            engineRef.current.resize();
          }
        });
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  return (
    <div className='w-full h-full flex flex-col bg-[var(--color-surface-primary)]/90 backdrop-blur-xl border border-[var(--color-border)] rounded-lg overflow-hidden'>
      <div className='flex-1 relative bg-gradient-to-br from-[var(--color-surface-primary)]/20 to-[var(--color-background-primary)]/20'>
        <canvas
          ref={canvasRef}
          className='w-full h-full block'
          style={{
            display: 'block',
            width: '100%',
            height: '100%',
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
          }}
        />

        {!audioData && (
          <div className='absolute inset-0 flex items-center justify-center'>
            <div className='text-center text-[var(--color-text-secondary)]'>
              <div className='w-16 h-16 mx-auto mb-4 border-4 border-[var(--color-border)] border-t-[var(--color-accent-primary)] rounded-full animate-spin'></div>
              <p className='text-sm'>Enhanced Audio Visualizer Ready</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
});

export default EnhancedAdvancedVisualizer;
