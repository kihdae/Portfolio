'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings, X, Trash2 } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import type {
  VisualizerType,
  VisualParameters,
  AudioMapping,
  VisualizerPreset,
  PerformanceMetrics,
} from '@/types/visualizer';

interface EnhancedMixerSettingsProps {
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

export default function EnhancedMixerSettings({
  isOpen,
  onClose,
  visualizerType,
  setVisualizerType,
  visualParams,
  setVisualParams,
  audioMapping,
  setAudioMapping,
  performanceMetrics,
  savedPresets,
  currentPreset,
  onSavePreset,
  onLoadPreset,
  onDeletePreset,
}: EnhancedMixerSettingsProps) {
  const [activeTab, setActiveTab] = useState<
    'visual' | 'audio' | 'performance' | 'presets'
  >('visual');
  const [selectedPreset, setSelectedPreset] = useState<number | null>(null);

  const visualizerTypes = [
    { id: 'spectrum-circle', label: 'Spectrum Circle' },
    { id: 'waveform', label: 'Waveform' },
    { id: 'particle-system', label: 'Particle System' },
    { id: 'frequency-bars', label: 'Frequency Bars' },
    { id: 'liquid-wave', label: 'Liquid Wave' },
    { id: 'matrix-rain', label: 'Matrix Rain' },
    { id: 'pulsing-orb', label: 'Pulsing Orb' },
    { id: 'dynamic-equalizer-grid', label: 'Dynamic Equalizer Grid' },
  ];

  const saveCurrentPreset = () => {
    onSavePreset();
    setSelectedPreset(null); 
  };

  const loadSelectedPreset = () => {
    if (selectedPreset !== null) {
      onLoadPreset(savedPresets[selectedPreset]);
      setSelectedPreset(null); 
    }
  };

  const deleteSelectedPreset = () => {
    if (selectedPreset !== null) {
      onDeletePreset(savedPresets[selectedPreset].id);
      setSelectedPreset(null); 
    }
  };

  const tabs = [{ id: 'visual', label: 'Visual' }];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className='fixed inset-0 z-50 flex'>
          <div
            className='flex-1 bg-black/50 backdrop-blur-sm'
            onClick={onClose}
          />

          <div className='w-96 bg-[var(--color-surface-primary)]/95 backdrop-blur-xl border-l border-[var(--color-border)] shadow-2xl z-50 flex flex-col'>
            <div className='flex items-center justify-between p-4 border-b border-[var(--color-border)] bg-[var(--color-surface-primary)]/90 flex-shrink-0'>
              <div className='flex items-center gap-2'>
                <Settings className='w-5 h-5 text-[var(--color-accent-primary)]' />
                <h2 className='text-lg font-semibold text-[var(--color-text-primary)]'>
                  {' '}
                  Mixer Settings
                </h2>
              </div>
              <button
                onClick={onClose}
                className='p-1 hover:bg-[var(--color-interactive-hover)] rounded-md transition-colors'
              >
                <X className='w-4 h-4 text-[var(--color-text-secondary)]' />
              </button>
            </div>

            <div className='flex-1 overflow-y-auto'>
              <div className='flex border-b border-[var(--color-border)] bg-[var(--color-surface-primary)]/90 flex-shrink-0'>
                {tabs.map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                      activeTab === tab.id
                        ? 'text-[var(--color-accent-primary)] border-b-2 border-[var(--color-accent-primary)] bg-[var(--color-accent-primary)]/10'
                        : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-interactive-hover)]'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              <div className='p-4 space-y-6'>
                {activeTab === 'visual' && (
                  <div>
                    <label className='block text-sm font-semibold text-[var(--color-text-primary)] mb-3'>
                      {' '}
                      Visualizer Type
                    </label>
                    <Select
                      value={visualizerType}
                      onValueChange={setVisualizerType}
                    >
                      <SelectTrigger className='w-full bg-[var(--color-surface-primary)] border-[var(--color-border)] text-[var(--color-text-primary)]'>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className='bg-[var(--color-surface-primary)] border-[var(--color-border)]'>
                        {visualizerTypes.map(type => (
                          <SelectItem
                            key={type.id}
                            value={type.id}
                            className='text-[var(--color-text-primary)] hover:bg-[var(--color-interactive-hover)]'
                          >
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <div className='mt-6'>
                      <h3 className='text-sm font-semibold text-[var(--color-text-primary)] border-b border-[var(--color-border)] pb-2'>
                        Visual Parameters
                      </h3>

                      <div className='mt-4 space-y-4'>
                        <div>
                          <label className='block text-sm font-medium text-[var(--color-text-primary)] mb-2'>
                            Opacity: {visualParams.opacity}
                          </label>
                          <input
                            type='range'
                            min='0'
                            max='1'
                            step='0.1'
                            value={visualParams.opacity}
                            onChange={e =>
                              setVisualParams({
                                ...visualParams,
                                opacity: parseFloat(e.target.value),
                              })
                            }
                            className='w-full accent-[var(--color-accent-primary)]'
                          />
                        </div>

                        <div>
                          <label className='block text-sm font-medium text-[var(--color-text-primary)] mb-2'>
                            Bar Height: {visualParams.barHeight}
                          </label>
                          <input
                            type='range'
                            min='0.1'
                            max='2'
                            step='0.1'
                            value={visualParams.barHeight}
                            onChange={e =>
                              setVisualParams({
                                ...visualParams,
                                barHeight: parseFloat(e.target.value),
                              })
                            }
                            className='w-full accent-[var(--color-accent-primary)]'
                          />
                        </div>

                        <div>
                          <label className='block text-sm font-medium text-[var(--color-text-primary)] mb-2'>
                            Animation Speed: {visualParams.animationSpeed}
                          </label>
                          <input
                            type='range'
                            min='0.1'
                            max='3'
                            step='0.1'
                            value={visualParams.animationSpeed}
                            onChange={e =>
                              setVisualParams({
                                ...visualParams,
                                animationSpeed: parseFloat(e.target.value),
                              })
                            }
                            className='w-full accent-[var(--color-accent-primary)]'
                          />
                        </div>

                        <div>
                          <label className='block text-sm font-medium text-[var(--color-text-primary)] mb-2'>
                            Wave Amplitude: {visualParams.waveAmplitude}
                          </label>
                          <input
                            type='range'
                            min='0'
                            max='200'
                            step='1'
                            value={visualParams.waveAmplitude}
                            onChange={e =>
                              setVisualParams({
                                ...visualParams,
                                waveAmplitude: parseInt(e.target.value),
                              })
                            }
                            className='w-full accent-[var(--color-accent-primary)]'
                          />
                        </div>

                        <div>
                          <label className='block text-sm font-medium text-[var(--color-text-primary)] mb-2'>
                            Particle Count: {visualParams.particleCount}
                          </label>
                          <input
                            type='range'
                            min='10'
                            max='300'
                            step='1'
                            value={visualParams.particleCount}
                            onChange={e =>
                              setVisualParams({
                                ...visualParams,
                                particleCount: parseInt(e.target.value),
                              })
                            }
                            className='w-full accent-[var(--color-accent-primary)]'
                          />
                        </div>

                        <div>
                          <label className='block text-sm font-medium text-[var(--color-text-primary)] mb-2'>
                            Glow Intensity: {visualParams.glowIntensity}
                          </label>
                          <input
                            type='range'
                            min='0'
                            max='1'
                            step='0.1'
                            value={visualParams.glowIntensity}
                            onChange={e =>
                              setVisualParams({
                                ...visualParams,
                                glowIntensity: parseFloat(e.target.value),
                              })
                            }
                            className='w-full accent-[var(--color-accent-primary)]'
                          />
                        </div>
                      </div>
                    </div>

                    <div className='mt-6'>
                      <h3 className='text-sm font-semibold text-[var(--color-text-primary)] border-b border-[var(--color-border)] pb-2'>
                        Audio Mapping
                      </h3>

                      <div className='mt-4 space-y-4'>
                        <div>
                          <label className='block text-sm font-medium text-[var(--color-text-primary)] mb-2'>
                            Bass Sensitivity: {audioMapping.lowFreqSensitivity}
                          </label>
                          <input
                            type='range'
                            min='0'
                            max='2'
                            step='0.1'
                            value={audioMapping.lowFreqSensitivity}
                            onChange={e =>
                              setAudioMapping({
                                ...audioMapping,
                                lowFreqSensitivity: parseFloat(e.target.value),
                              })
                            }
                            className='w-full accent-[var(--color-accent-primary)]'
                          />
                        </div>

                        <div>
                          <label className='block text-sm font-medium text-[var(--color-text-primary)] mb-2'>
                            Mid Sensitivity: {audioMapping.midFreqSensitivity}
                          </label>
                          <input
                            type='range'
                            min='0'
                            max='2'
                            step='0.1'
                            value={audioMapping.midFreqSensitivity}
                            onChange={e =>
                              setAudioMapping({
                                ...audioMapping,
                                midFreqSensitivity: parseFloat(e.target.value),
                              })
                            }
                            className='w-full accent-[var(--color-accent-primary)]'
                          />
                        </div>

                        <div>
                          <label className='block text-sm font-medium text-[var(--color-text-primary)] mb-2'>
                            Treble Sensitivity:{' '}
                            {audioMapping.highFreqSensitivity}
                          </label>
                          <input
                            type='range'
                            min='0'
                            max='2'
                            step='0.1'
                            value={audioMapping.highFreqSensitivity}
                            onChange={e =>
                              setAudioMapping({
                                ...audioMapping,
                                highFreqSensitivity: parseFloat(e.target.value),
                              })
                            }
                            className='w-full accent-[var(--color-accent-primary)]'
                          />
                        </div>

                        <div>
                          <label className='block text-sm font-medium text-[var(--color-text-primary)] mb-2'>
                            Volume Sensitivity: {audioMapping.volumeSensitivity}
                          </label>
                          <input
                            type='range'
                            min='0'
                            max='2'
                            step='0.1'
                            value={audioMapping.volumeSensitivity}
                            onChange={e =>
                              setAudioMapping({
                                ...audioMapping,
                                volumeSensitivity: parseFloat(e.target.value),
                              })
                            }
                            className='w-full accent-[var(--color-accent-primary)]'
                          />
                        </div>
                      </div>
                    </div>

                    <div className='mt-6'>
                      <h3 className='text-sm font-semibold text-[var(--color-text-primary)] border-b border-[var(--color-border)] pb-2'>
                        Performance Metrics
                      </h3>

                      <div className='mt-4 grid grid-cols-2 gap-4'>
                        <div className='bg-[var(--color-surface-primary)]/50 p-4 rounded-lg border border-[var(--color-border)]'>
                          <div className='text-sm text-[var(--color-text-secondary)] mb-1'>
                            FPS
                          </div>
                          <div className='text-2xl font-semibold text-[var(--color-text-primary)]'>
                            {performanceMetrics.fps}
                          </div>
                        </div>
                        <div className='bg-[var(--color-surface-primary)]/50 p-4 rounded-lg border border-[var(--color-border)]'>
                          <div className='text-sm text-[var(--color-text-secondary)] mb-1'>
                            CPU Usage
                          </div>
                          <div className='text-2xl font-semibold text-[var(--color-text-primary)]'>
                            {Math.round(performanceMetrics.cpuUsage * 100)}%
                          </div>
                        </div>
                        <div className='bg-[var(--color-surface-primary)]/50 p-4 rounded-lg border border-[var(--color-border)]'>
                          <div className='text-sm text-[var(--color-text-secondary)] mb-1'>
                            Memory
                          </div>
                          <div className='text-2xl font-semibold text-[var(--color-text-primary)]'>
                            {Math.round(performanceMetrics.memoryUsage)}MB
                          </div>
                        </div>
                        <div className='bg-[var(--color-surface-primary)]/50 p-4 rounded-lg border border-[var(--color-border)]'>
                          <div className='text-sm text-[var(--color-text-secondary)] mb-1'>
                            Render Time
                          </div>
                          <div className='text-2xl font-semibold text-[var(--color-text-primary)]'>
                            {performanceMetrics.renderTime.toFixed(1)}ms
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'presets' && (
                  <div>
                    <div className='flex items-center justify-between mb-4'>
                      <h3 className='text-sm font-semibold text-[var(--color-text-primary)]'>
                        Enhanced Saved Presets
                      </h3>
                      <button
                        onClick={saveCurrentPreset}
                        className='px-4 py-2 bg-[var(--color-accent-primary)] hover:bg-[var(--color-accent-primary)]/80 text-[var(--color-background-primary)] text-sm rounded-md transition-colors'
                      >
                        Save Current
                      </button>
                    </div>

                    <div className='space-y-3'>
                      {savedPresets.map((preset, index) => (
                        <div
                          key={index}
                          className={`p-4 rounded-lg border transition-colors cursor-pointer ${
                            selectedPreset === index
                              ? 'bg-[var(--color-accent-primary)]/20 border-[var(--color-accent-primary)]/40'
                              : 'bg-[var(--color-surface-primary)]/50 border-[var(--color-border)] hover:bg-[var(--color-surface-primary)]/70'
                          }`}
                          onClick={() => setSelectedPreset(index)}
                        >
                          <div className='text-sm font-medium text-[var(--color-text-primary)]'>
                            {preset.name}
                          </div>
                          <div className='text-xs text-[var(--color-text-secondary)]'>
                            {preset.description}
                          </div>
                          <div className='text-xs text-[var(--color-accent-primary)] mt-1'>
                            {preset.visualizerType}
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className='mt-4 flex gap-2'>
                      <button
                        onClick={loadSelectedPreset}
                        disabled={selectedPreset === null}
                        className='px-4 py-2 bg-[var(--color-accent-primary)] hover:bg-[var(--color-accent-primary)]/80 text-[var(--color-background-primary)] text-sm rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
                      >
                        Load Selected
                      </button>
                      <button
                        onClick={deleteSelectedPreset}
                        disabled={selectedPreset === null}
                        className='p-1 hover:bg-[var(--color-interactive-hover)] rounded text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors'
                      >
                        <Trash2 className='w-4 h-4' />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}

function EnhancedVisualTab({
  visualizerType,
  setVisualizerType,
  visualParams,
  setVisualParams,
  visualizerTypes,
}: {
  visualizerType: VisualizerType;
  setVisualizerType: (type: VisualizerType) => void;
  visualParams: VisualParameters;
  setVisualParams: (params: VisualParameters) => void;
  visualizerTypes: { id: string; label: string }[];
}) {
  return (
    <div className='space-y-8'>
      <div>
        <label className='block text-sm font-semibold text-purple-200 mb-3'>
          Enhanced Visualizer Type
        </label>
        <Select
          value={visualizerType}
          onValueChange={value => setVisualizerType(value as VisualizerType)}
        >
          <SelectTrigger className='w-full bg-[#201C33] border-purple-400/30 text-purple-200'>
            <SelectValue placeholder='Select visualizer type' />
          </SelectTrigger>
          <SelectContent className='bg-[#201C33] border-purple-400/30'>
            {visualizerTypes.map(type => (
              <SelectItem
                key={type.id}
                value={type.id}
                className='text-purple-200 hover:bg-purple-400/10'
              >
                {type.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className='space-y-4'>
        <h3 className='text-sm font-semibold text-purple-200 border-b border-purple-400/20 pb-2'>
          Enhanced Colors & Effects
        </h3>
        <div className='grid grid-cols-3 gap-6'>
          <div>
            <label className='block text-sm font-medium text-purple-200 mb-2'>
              Glow Intensity: {Math.round(visualParams.glowIntensity * 100)}%
            </label>
            <input
              type='range'
              min='0'
              max='1'
              step='0.01'
              value={visualParams.glowIntensity}
              onChange={e =>
                setVisualParams({
                  ...visualParams,
                  glowIntensity: Number.parseFloat(e.target.value),
                })
              }
              className='w-full accent-purple-400'
            />
          </div>

          <div>
            <label className='block text-sm font-medium text-purple-200 mb-2'>
              Animation Speed: {Math.round(visualParams.animationSpeed * 100)}%
            </label>
            <input
              type='range'
              min='0.1'
              max='3'
              step='0.1'
              value={visualParams.animationSpeed}
              onChange={e =>
                setVisualParams({
                  ...visualParams,
                  animationSpeed: Number.parseFloat(e.target.value),
                })
              }
              className='w-full accent-purple-400'
            />
          </div>

          <div>
            <label className='block text-sm font-medium text-purple-200 mb-2'>
              Bar Width: {visualParams.barWidth}px
            </label>
            <input
              type='range'
              min='1'
              max='50'
              step='1'
              value={visualParams.barWidth}
              onChange={e =>
                setVisualParams({
                  ...visualParams,
                  barWidth: Number.parseInt(e.target.value),
                })
              }
              className='w-full accent-purple-400'
            />
          </div>
        </div>

        <div className='grid grid-cols-3 gap-6'>
          <div>
            <label className='block text-sm font-medium text-purple-200 mb-2'>
              Bar Height: {Math.round(visualParams.barHeight * 100)}%
            </label>
            <input
              type='range'
              min='0.1'
              max='2'
              step='0.1'
              value={visualParams.barHeight}
              onChange={e =>
                setVisualParams({
                  ...visualParams,
                  barHeight: Number.parseFloat(e.target.value),
                })
              }
              className='w-full accent-purple-400'
            />
          </div>

          <div>
            <label className='block text-sm font-medium text-purple-200 mb-2'>
              Decay Rate: {Math.round(visualParams.decayRate * 100)}%
            </label>
            <input
              type='range'
              min='0'
              max='1'
              step='0.01'
              value={visualParams.decayRate}
              onChange={e =>
                setVisualParams({
                  ...visualParams,
                  decayRate: Number.parseFloat(e.target.value),
                })
              }
              className='w-full accent-purple-400'
            />
          </div>

          <div>
            <label className='block text-sm font-medium text-purple-200 mb-2'>
              Bounce Intensity: {Math.round(visualParams.bounceIntensity * 100)}
              %
            </label>
            <input
              type='range'
              min='0'
              max='1'
              step='0.01'
              value={visualParams.bounceIntensity}
              onChange={e =>
                setVisualParams({
                  ...visualParams,
                  bounceIntensity: Number.parseFloat(e.target.value),
                })
              }
              className='w-full accent-purple-400'
            />
          </div>
        </div>

        <div className='grid grid-cols-2 gap-6'>
          <div>
            <label className='block text-sm font-medium text-purple-200 mb-2'>
              Wave Amplitude: {visualParams.waveAmplitude}px
            </label>
            <input
              type='range'
              min='10'
              max='200'
              step='5'
              value={visualParams.waveAmplitude}
              onChange={e =>
                setVisualParams({
                  ...visualParams,
                  waveAmplitude: Number.parseInt(e.target.value),
                })
              }
              className='w-full accent-purple-400'
            />
          </div>

          <div>
            <label className='block text-sm font-medium text-purple-200 mb-2'>
              Bloom Intensity: {Math.round(visualParams.bloomIntensity * 100)}%
            </label>
            <input
              type='range'
              min='0'
              max='1'
              step='0.01'
              value={visualParams.bloomIntensity}
              onChange={e =>
                setVisualParams({
                  ...visualParams,
                  bloomIntensity: Number.parseFloat(e.target.value),
                })
              }
              className='w-full accent-purple-400'
            />
          </div>
        </div>
      </div>

      {/* Particle System Settings */}
      <div className='space-y-4'>
        <h3 className='text-sm font-semibold text-purple-200 border-b border-purple-400/20 pb-2'>
          Particle System Settings
        </h3>
        <div className='grid grid-cols-3 gap-6'>
          <div>
            <label className='block text-sm font-medium text-purple-200 mb-2'>
              Particle Count: {visualParams.particleCount}
            </label>
            <input
              type='range'
              min='10'
              max='300'
              step='10'
              value={visualParams.particleCount}
              onChange={e =>
                setVisualParams({
                  ...visualParams,
                  particleCount: Number.parseInt(e.target.value),
                })
              }
              className='w-full accent-purple-400'
            />
          </div>

          <div>
            <label className='block text-sm font-medium text-purple-200 mb-2'>
              Particle Size: {visualParams.particleSize}px
            </label>
            <input
              type='range'
              min='1'
              max='10'
              step='0.5'
              value={visualParams.particleSize}
              onChange={e =>
                setVisualParams({
                  ...visualParams,
                  particleSize: Number.parseFloat(e.target.value),
                })
              }
              className='w-full accent-purple-400'
            />
          </div>

          <div>
            <label className='block text-sm font-medium text-purple-200 mb-2'>
              Particle Speed: {Math.round(visualParams.particleSpeed * 100)}%
            </label>
            <input
              type='range'
              min='0.1'
              max='3'
              step='0.1'
              value={visualParams.particleSpeed}
              onChange={e =>
                setVisualParams({
                  ...visualParams,
                  particleSpeed: Number.parseFloat(e.target.value),
                })
              }
              className='w-full accent-purple-400'
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function EnhancedAudioTab({
  audioMapping,
  setAudioMapping,
}: {
  audioMapping: AudioMapping;
  setAudioMapping: (mapping: AudioMapping) => void;
}) {
  return (
    <div className='space-y-8'>
      <h3 className='text-sm font-semibold text-purple-200 border-b border-purple-400/20 pb-2'>
        Enhanced Frequency Sensitivity
      </h3>
      <div className='grid grid-cols-3 gap-6'>
        <div>
          <label className='block text-sm font-medium text-purple-200 mb-2'>
            Low Freq: {Math.round(audioMapping.lowFreqSensitivity * 100)}%
          </label>
          <input
            type='range'
            min='0'
            max='2'
            step='0.1'
            value={audioMapping.lowFreqSensitivity}
            onChange={e =>
              setAudioMapping({
                ...audioMapping,
                lowFreqSensitivity: Number.parseFloat(e.target.value),
              })
            }
            className='w-full accent-purple-400'
          />
        </div>

        <div>
          <label className='block text-sm font-medium text-purple-200 mb-2'>
            Mid Freq: {Math.round(audioMapping.midFreqSensitivity * 100)}%
          </label>
          <input
            type='range'
            min='0'
            max='2'
            step='0.1'
            value={audioMapping.midFreqSensitivity}
            onChange={e =>
              setAudioMapping({
                ...audioMapping,
                midFreqSensitivity: Number.parseFloat(e.target.value),
              })
            }
            className='w-full accent-purple-400'
          />
        </div>

        <div>
          <label className='block text-sm font-medium text-purple-200 mb-2'>
            High Freq: {Math.round(audioMapping.highFreqSensitivity * 100)}%
          </label>
          <input
            type='range'
            min='0'
            max='2'
            step='0.1'
            value={audioMapping.highFreqSensitivity}
            onChange={e =>
              setAudioMapping({
                ...audioMapping,
                highFreqSensitivity: Number.parseFloat(e.target.value),
              })
            }
            className='w-full accent-purple-400'
          />
        </div>
      </div>

      <div className='grid grid-cols-2 gap-6'>
        <div>
          <label className='block text-sm font-medium text-purple-200 mb-2'>
            Volume: {Math.round(audioMapping.volumeSensitivity * 100)}%
          </label>
          <input
            type='range'
            min='0'
            max='2'
            step='0.1'
            value={audioMapping.volumeSensitivity}
            onChange={e =>
              setAudioMapping({
                ...audioMapping,
                volumeSensitivity: Number.parseFloat(e.target.value),
              })
            }
            className='w-full accent-purple-400'
          />
        </div>

        <div>
          <label className='block text-sm font-medium text-purple-200 mb-2'>
            Beat Sensitivity: {Math.round(audioMapping.beatSensitivity * 100)}%
          </label>
          <input
            type='range'
            min='0'
            max='3'
            step='0.1'
            value={audioMapping.beatSensitivity}
            onChange={e =>
              setAudioMapping({
                ...audioMapping,
                beatSensitivity: Number.parseFloat(e.target.value),
              })
            }
            className='w-full accent-purple-400'
          />
        </div>
      </div>
    </div>
  );
}

function EnhancedPerformanceTab({
  performanceMetrics,
}: {
  performanceMetrics: PerformanceMetrics;
}) {
  return (
    <div className='space-y-8'>
      <h3 className='text-sm font-semibold text-purple-200 border-b border-purple-400/20 pb-2'>
        Enhanced Real-time Metrics
      </h3>
      <div className='grid grid-cols-2 gap-6'>
        <div className='bg-[#201C33]/50 p-4 rounded-lg border border-purple-400/20'>
          <div className='text-sm text-purple-300 mb-1'>FPS</div>
          <div className='text-2xl font-semibold text-purple-200'>
            {performanceMetrics.fps}
          </div>
        </div>
        <div className='bg-[#201C33]/50 p-4 rounded-lg border border-purple-400/20'>
          <div className='text-sm text-purple-300 mb-1'>CPU Usage</div>
          <div className='text-2xl font-semibold text-purple-200'>
            {Math.round(performanceMetrics.cpuUsage * 100)}%
          </div>
        </div>
      </div>

      <div className='grid grid-cols-2 gap-6'>
        <div className='bg-[#201C33]/50 p-4 rounded-lg border border-purple-400/20'>
          <div className='text-sm text-purple-300 mb-1'>Memory</div>
          <div className='text-2xl font-semibold text-purple-200'>
            {Math.round(performanceMetrics.memoryUsage)}MB
          </div>
        </div>
        <div className='bg-[#201C33]/50 p-4 rounded-lg border border-purple-400/20'>
          <div className='text-sm text-purple-300 mb-1'>Render Time</div>
          <div className='text-2xl font-semibold text-purple-200'>
            {performanceMetrics.renderTime.toFixed(1)}ms
          </div>
        </div>
      </div>
    </div>
  );
}

function EnhancedPresetsTab({
  savedPresets,
  currentPreset,
  onSavePreset,
  onLoadPreset,
  onDeletePreset,
}: {
  savedPresets: VisualizerPreset[];
  currentPreset: VisualizerPreset | null;
  onSavePreset: () => void;
  onLoadPreset: (preset: VisualizerPreset) => void;
  onDeletePreset: (presetId: string) => void;
}) {
  return (
    <div className='space-y-8'>
      <div className='flex items-center justify-between'>
        <h3 className='text-sm font-semibold text-purple-200'>
          Enhanced Saved Presets
        </h3>
        <button
          onClick={onSavePreset}
          className='px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm rounded-md transition-colors'
        >
          Save Current
        </button>
      </div>

      <div className='space-y-2'>
        {savedPresets.map(preset => (
          <div
            key={preset.id}
            className={`p-4 rounded-lg border transition-colors cursor-pointer ${
              currentPreset?.id === preset.id
                ? 'bg-purple-600/20 border-purple-400/40'
                : 'bg-[#201C33]/50 border-purple-400/20 hover:bg-[#201C33]/70'
            }`}
            onClick={() => onLoadPreset(preset)}
          >
            <div className='flex items-center justify-between'>
              <div>
                <div className='text-sm font-medium text-purple-200'>
                  {preset.name}
                </div>
                <div className='text-xs text-purple-300'>
                  {preset.description}
                </div>
                <div className='text-xs text-purple-400 mt-1'>
                  {preset.visualizerType}
                </div>
              </div>
              <button
                onClick={e => {
                  e.stopPropagation();
                  onDeletePreset(preset.id);
                }}
                className='p-1 hover:bg-purple-400/10 rounded text-purple-300 hover:text-purple-200 transition-colors'
              >
                <X className='w-3 h-3' />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
