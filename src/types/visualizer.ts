
export type VisualizerType =
  | 'frequency-bars'
  | 'waveform'
  | 'particle-system'
  | 'abstract-generative'
  | 'spectrum-circle'
  | '3d-bars'
  | 'liquid-wave'
  | 'matrix-rain'
  | 'pulsing-orb'
  | 'dynamic-equalizer-grid';

export interface AudioData {
  frequencyData: Uint8Array;
  timeDomainData: Uint8Array;
  lowFrequency: number; 
  midFrequency: number; 
  highFrequency: number; 
  overallVolume: number; 
  beatDetected: boolean;
  beatIntensity: number; 
  spectralCentroid: number; 
  spectralRolloff: number; 
}

export interface VisualParameters {
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  backgroundColor: string;
  opacity: number; 
  saturation: number; 
  brightness: number; 
  contrast: number; 

  barWidth: number; 
  barSpacing: number; 
  barHeight: number; 
  cornerRadius: number; 

  animationSpeed: number; 
  decayRate: number; 
  bounceIntensity: number; 
  waveAmplitude: number; 
  waveFrequency: number; 

  glowIntensity: number; 
  blurAmount: number; 
  distortionAmount: number; 
  reflectionOpacity: number; 
  bloomIntensity: number; 

  particleCount: number; 
  particleSize: number; 
  particleSpeed: number; 
  particleLife: number; 
  particleGravity: number; 
}

export interface AudioMapping {
  lowFreqMapping:
    | 'barHeight'
    | 'barWidth'
    | 'opacity'
    | 'color'
    | 'glow'
    | 'particleCount'
    | 'particleSpeed'
    | 'waveAmplitude'
    | 'radius'
    | 'amplitude'
    | 'dropSpeed';
  midFreqMapping:
    | 'barHeight'
    | 'barWidth'
    | 'opacity'
    | 'color'
    | 'glow'
    | 'particleCount'
    | 'particleSpeed'
    | 'waveAmplitude'
    | 'radius'
    | 'amplitude'
    | 'dropSpeed'
    | 'waveFrequency'
    | 'frequency'
    | 'dropCount';
  highFreqMapping:
    | 'barHeight'
    | 'barWidth'
    | 'opacity'
    | 'color'
    | 'glow'
    | 'particleCount'
    | 'particleSpeed'
    | 'waveAmplitude'
    | 'radius'
    | 'amplitude'
    | 'dropSpeed';

  volumeMapping:
    | 'overallOpacity'
    | 'animationSpeed'
    | 'particleCount'
    | 'glowIntensity'
    | 'bloomIntensity'
    | 'dropIntensity';

  beatMapping:
    | 'colorFlash'
    | 'scalePulse'
    | 'rotation'
    | 'particleBurst'
    | 'flash';

  lowFreqSensitivity: number; 
  midFreqSensitivity: number; 
  highFreqSensitivity: number; 
  volumeSensitivity: number; 
  beatSensitivity: number; 
}

export interface VisualizerPreset {
  id: string;
  name: string;
  description: string;
  category: 'dark' | 'intimate' | 'energetic' | 'ambient' | 'custom';
  visualizerType: VisualizerType;
  visualParameters: VisualParameters;
  audioMapping: AudioMapping;
  createdAt: Date;
  isDefault?: boolean;
}

export interface BeginnerControls {
  mood: 'dark' | 'intimate' | 'energetic' | 'ambient';
  intensity: number; 
  colorScheme: 'monochrome' | 'complementary' | 'analogous' | 'triadic';
  animationStyle: 'smooth' | 'sharp' | 'bouncy' | 'fluid';
}

export interface ExpertControls {
  visualParameters: VisualParameters;
  audioMapping: AudioMapping;
  customShaders?: string;
  customEffects?: string[];
}

export interface PerformanceMetrics {
  fps: number;
  cpuUsage: number;
  memoryUsage: number;
  renderTime: number;
  audioLatency: number;
}

export interface VisualizerConfig {
  type: VisualizerType;
  beginnerControls?: BeginnerControls;
  expertControls?: ExpertControls;
  performanceMode: 'quality' | 'balanced' | 'performance';
  enableEffects: boolean;
  enableParticles: boolean;
  enableShaders: boolean;
}

export interface ThemeIntegration {
  useThemeColors: boolean;
  colorBlendMode: 'multiply' | 'screen' | 'overlay' | 'soft-light';
  themeOpacity: number; 
  preserveThemeAesthetic: boolean;
}

export interface AdvancedVisualizerConfig {
  config: VisualizerConfig;
  themeIntegration: ThemeIntegration;
  performanceMetrics: PerformanceMetrics;
  currentPreset: VisualizerPreset | null;
  savedPresets: VisualizerPreset[];
}
