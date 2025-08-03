import { performanceUtils } from '@/lib/performanceUtils';

export interface ThemeVariables {
  '--color-background-primary': string;
  '--color-surface-primary': string;
  '--color-text-primary': string;
  '--color-text-secondary': string;
  '--color-accent-primary': string;
  '--color-accent-secondary': string;
  '--color-border': string;
  '--color-shadow': string;
  '--color-interactive-hover': string;
  '--color-interactive-active': string;

  '--color-background': string;
  '--color-surface': string;
  '--color-primary-accent': string;
  '--color-secondary-accent': string;
  '--color-disabled': string;
  '--color-error': string;
  '--color-error-text': string;

  '--mixer-visualizer-color-1': string;
  '--mixer-visualizer-color-2': string;
  '--mixer-visualizer-color-3': string;
  '--mixer-background-overlay': string;
  '--mixer-control-background': string;
  '--mixer-control-border': string;
  '--mixer-slider-track': string;
  '--mixer-slider-thumb': string;
  '--mixer-slider-thumb-hover': string;

  '--player-control-background': string;
  '--player-tracklist-background': string;
  '--player-progress-track': string;
  '--player-progress-fill': string;
  '--player-album-art-border': string;
  '--player-header-background': string;
  '--player-window-border': string;

  '--toggle-off-background': string;
  '--toggle-off-border': string;
  '--toggle-off-text': string;
  '--toggle-on-background': string;
  '--toggle-on-border': string;
  '--toggle-on-text': string;
  '--toggle-hover-background': string;
  '--toggle-hover-border': string;
  '--toggle-glow-color': string;
}

export interface ThemeConfig {
  name: string;
  displayName: string;
  description: string;
  variables: ThemeVariables;
}

export const themes: Record<string, ThemeConfig> = {
  solar: {
    name: 'solar',
    displayName: 'solar',
    description:
      'Electric cyan, neon pink, and deep space black for a futuristic cyberpunk vibe.',
    variables: {
      '--color-background-primary': '#0a0a0f',
      '--color-surface-primary': '#1a1a2e',
      '--color-text-primary': '#00ffff',
      '--color-text-secondary': '#ff69b4',
      '--color-accent-primary': '#00ffff',
      '--color-accent-secondary': '#ff69b4',
      '--color-border': 'rgba(0, 255, 255, 0.25)',
      '--color-shadow': 'rgba(10, 10, 15, 0.9)',
      '--color-interactive-hover': 'rgba(0, 255, 255, 0.15)',
      '--color-interactive-active': 'rgba(255, 105, 180, 0.2)',
      '--color-background': '#0a0a0f',
      '--color-surface': '#1a1a2e',
      '--color-primary-accent': '#00ffff',
      '--color-secondary-accent': '#ff69b4',
      '--color-disabled': '#2a2a3a',
      '--color-error': '#ff1493',
      '--color-error-text': '#00ffff',
      '--mixer-visualizer-color-1': '#00ffff',
      '--mixer-visualizer-color-2': '#ff69b4',
      '--mixer-visualizer-color-3': '#ff1493',
      '--mixer-background-overlay': 'rgba(10, 10, 15, 0.95)',
      '--mixer-control-background': 'rgba(26, 26, 46, 0.9)',
      '--mixer-control-border': 'rgba(0, 255, 255, 0.3)',
      '--mixer-slider-track': '#1a1a2e',
      '--mixer-slider-thumb': '#00ffff',
      '--mixer-slider-thumb-hover': '#ff69b4',
      '--player-control-background': 'rgba(26, 26, 46, 0.9)',
      '--player-tracklist-background': 'rgba(10, 10, 15, 0.95)',
      '--player-progress-track': '#0a0a0f',
      '--player-progress-fill': '#00ffff',
      '--player-album-art-border': 'rgba(0, 255, 255, 0.3)',
      '--player-header-background': 'rgba(0, 0, 0, 0.2)',
      '--player-window-border': 'rgba(0, 255, 255, 0.3)',
      '--toggle-off-background': 'rgba(26, 26, 46, 0.9)',
      '--toggle-off-border': 'rgba(0, 255, 255, 0.15)',
      '--toggle-off-text': 'rgba(0, 255, 255, 0.7)',
      '--toggle-on-background': 'rgba(0, 255, 255, 0.2)',
      '--toggle-on-border': 'rgba(0, 255, 255, 0.4)',
      '--toggle-on-text': '#00ffff',
      '--toggle-hover-background': 'rgba(26, 26, 46, 0.95)',
      '--toggle-hover-border': 'rgba(255, 105, 180, 0.3)',
      '--toggle-glow-color': 'rgba(0, 255, 255, 0.4)',
    },
  },

  sakura: {
    name: 'sakura',
    displayName: 'sakura',
    description:
      'Soft pinks, cherry blossom, and gentle grays for a dreamy, elegant look.',
    variables: {
      '--color-background-primary': '#2E232A',
      '--color-surface-primary': '#3E2F3A',
      '--color-text-primary': '#FFE4F0',
      '--color-text-secondary': '#FFB7D5',
      '--color-accent-primary': '#FF6FAE',
      '--color-accent-secondary': '#FFB7D5',
      '--color-border': 'rgba(255, 111, 174, 0.18)',
      '--color-shadow': 'rgba(46, 35, 42, 0.8)',
      '--color-interactive-hover': 'rgba(255, 111, 174, 0.08)',
      '--color-interactive-active': 'rgba(255, 111, 174, 0.15)',
      '--color-background': '#2E232A',
      '--color-surface': '#3E2F3A',
      '--color-primary-accent': '#FF6FAE',
      '--color-secondary-accent': '#FFB7D5',
      '--color-disabled': '#5A4D4D',
      '--color-error': '#FF5349',
      '--color-error-text': '#FFE4F0',
      '--mixer-visualizer-color-1': '#FF6FAE',
      '--mixer-visualizer-color-2': '#FFB7D5',
      '--mixer-visualizer-color-3': '#FFE4F0',
      '--mixer-background-overlay': 'rgba(46, 35, 42, 0.95)',
      '--mixer-control-background': 'rgba(62, 47, 58, 0.8)',
      '--mixer-control-border': 'rgba(255, 111, 174, 0.18)',
      '--mixer-slider-track': '#3E2F3A',
      '--mixer-slider-thumb': '#FF6FAE',
      '--mixer-slider-thumb-hover': '#FFB7D5',
      '--player-control-background': 'rgba(62, 47, 58, 0.8)',
      '--player-tracklist-background': 'rgba(46, 35, 42, 0.9)',
      '--player-progress-track': '#2E232A',
      '--player-progress-fill': '#FF6FAE',
      '--player-album-art-border': 'rgba(255, 111, 174, 0.18)',
      '--player-header-background': 'rgba(0, 0, 0, 0.1)',
      '--player-window-border': 'rgba(255, 111, 174, 0.18)',
      '--toggle-off-background': 'rgba(62, 47, 58, 0.8)',
      '--toggle-off-border': 'rgba(255, 111, 174, 0.08)',
      '--toggle-off-text': 'rgba(255, 183, 213, 0.8)',
      '--toggle-on-background': 'rgba(255, 111, 174, 0.15)',
      '--toggle-on-border': 'rgba(255, 111, 174, 0.3)',
      '--toggle-on-text': '#FF6FAE',
      '--toggle-hover-background': 'rgba(62, 47, 58, 0.9)',
      '--toggle-hover-border': 'rgba(255, 111, 174, 0.18)',
      '--toggle-glow-color': 'rgba(255, 111, 174, 0.25)',
    },
  },

  'snst blvd': {
    name: 'snst blvd',
    displayName: 'snst blvd',
    description:
      'Vivid pinks, oranges, and deep blues for a bold, retro-inspired look.',
    variables: {
      '--color-background-primary': '#1A1624',
      '--color-surface-primary': '#2E2340',
      '--color-text-primary': '#FFD6E0',
      '--color-text-secondary': '#FFB7B7',
      '--color-accent-primary': '#FF5E62',
      '--color-accent-secondary': '#FF9966',
      '--color-border': 'rgba(255, 94, 98, 0.18)',
      '--color-shadow': 'rgba(26, 22, 36, 0.8)',
      '--color-interactive-hover': 'rgba(255, 94, 98, 0.08)',
      '--color-interactive-active': 'rgba(255, 94, 98, 0.15)',
      '--color-background': '#1A1624',
      '--color-surface': '#2E2340',
      '--color-primary-accent': '#FF5E62',
      '--color-secondary-accent': '#FF9966',
      '--color-disabled': '#554E5A',
      '--color-error': '#F4709B',
      '--color-error-text': '#FFD6E0',
      '--mixer-visualizer-color-1': '#FF5E62',
      '--mixer-visualizer-color-2': '#FF9966',
      '--mixer-visualizer-color-3': '#FFB7B7',
      '--mixer-background-overlay': 'rgba(26, 22, 36, 0.95)',
      '--mixer-control-background': 'rgba(46, 35, 64, 0.8)',
      '--mixer-control-border': 'rgba(255, 94, 98, 0.18)',
      '--mixer-slider-track': '#2E2340',
      '--mixer-slider-thumb': '#FF5E62',
      '--mixer-slider-thumb-hover': '#FF9966',
      '--player-control-background': 'rgba(46, 35, 64, 0.8)',
      '--player-tracklist-background': 'rgba(26, 22, 36, 0.9)',
      '--player-progress-track': '#1A1624',
      '--player-progress-fill': '#FF5E62',
      '--player-album-art-border': 'rgba(255, 94, 98, 0.18)',
      '--player-header-background': 'rgba(0, 0, 0, 0.1)',
      '--player-window-border': 'rgba(255, 94, 98, 0.18)',
      '--toggle-off-background': 'rgba(46, 35, 64, 0.8)',
      '--toggle-off-border': 'rgba(255, 94, 98, 0.08)',
      '--toggle-off-text': 'rgba(255, 183, 183, 0.8)',
      '--toggle-on-background': 'rgba(255, 94, 98, 0.15)',
      '--toggle-on-border': 'rgba(255, 94, 98, 0.3)',
      '--toggle-on-text': '#FF5E62',
      '--toggle-hover-background': 'rgba(46, 35, 64, 0.9)',
      '--toggle-hover-border': 'rgba(255, 94, 98, 0.18)',
      '--toggle-glow-color': 'rgba(255, 94, 98, 0.25)',
    },
  },

  'cyber mint': {
    name: 'cyber mint',
    displayName: 'cyber mint',
    description:
      'Futuristic mint, teal, and black for a high-contrast, techy look.',
    variables: {
      '--color-background-primary': '#0D1A13',
      '--color-surface-primary': '#1A3326',
      '--color-text-primary': '#D6FFF6',
      '--color-text-secondary': '#A0E6B0',
      '--color-accent-primary': '#00FFB8',
      '--color-accent-secondary': '#00B894',
      '--color-border': 'rgba(0, 255, 184, 0.18)',
      '--color-shadow': 'rgba(13, 26, 19, 0.8)',
      '--color-interactive-hover': 'rgba(0, 255, 184, 0.08)',
      '--color-interactive-active': 'rgba(0, 255, 184, 0.15)',
      '--color-background': '#0D1A13',
      '--color-surface': '#1A3326',
      '--color-primary-accent': '#00FFB8',
      '--color-secondary-accent': '#00B894',
      '--color-disabled': '#3A4A55',
      '--color-error': '#FF6B6B',
      '--color-error-text': '#D6FFF6',
      '--mixer-visualizer-color-1': '#00FFB8',
      '--mixer-visualizer-color-2': '#00B894',
      '--mixer-visualizer-color-3': '#A0E6B0',
      '--mixer-background-overlay': 'rgba(13, 26, 19, 0.95)',
      '--mixer-control-background': 'rgba(26, 51, 38, 0.8)',
      '--mixer-control-border': 'rgba(0, 255, 184, 0.18)',
      '--mixer-slider-track': '#1A3326',
      '--mixer-slider-thumb': '#00FFB8',
      '--mixer-slider-thumb-hover': '#00B894',
      '--player-control-background': 'rgba(26, 51, 38, 0.8)',
      '--player-tracklist-background': 'rgba(13, 26, 19, 0.9)',
      '--player-progress-track': '#0D1A13',
      '--player-progress-fill': '#00FFB8',
      '--player-album-art-border': 'rgba(0, 255, 184, 0.18)',
      '--player-header-background': 'rgba(0, 0, 0, 0.1)',
      '--player-window-border': 'rgba(0, 255, 184, 0.18)',
      '--toggle-off-background': 'rgba(26, 51, 38, 0.8)',
      '--toggle-off-border': 'rgba(0, 255, 184, 0.08)',
      '--toggle-off-text': 'rgba(160, 230, 176, 0.8)',
      '--toggle-on-background': 'rgba(0, 255, 184, 0.15)',
      '--toggle-on-border': 'rgba(0, 255, 184, 0.3)',
      '--toggle-on-text': '#00FFB8',
      '--toggle-hover-background': 'rgba(26, 51, 38, 0.9)',
      '--toggle-hover-border': 'rgba(0, 255, 184, 0.18)',
      '--toggle-glow-color': 'rgba(0, 255, 184, 0.25)',
    },
  },

  'rose gold': {
    name: 'rose gold',
    displayName: 'rose gold',
    description:
      'Elegant rose, gold, and soft taupe for a luxurious, modern look.',
    variables: {
      '--color-background-primary': '#2D2326',
      '--color-surface-primary': '#3E2F32',
      '--color-text-primary': '#FFE4E1',
      '--color-text-secondary': '#FFD1C1',
      '--color-accent-primary': '#FFB6B9',
      '--color-accent-secondary': '#FFD1C1',
      '--color-border': 'rgba(255, 182, 185, 0.18)',
      '--color-shadow': 'rgba(45, 35, 38, 0.8)',
      '--color-interactive-hover': 'rgba(255, 182, 185, 0.08)',
      '--color-interactive-active': 'rgba(255, 182, 185, 0.15)',
      '--color-background': '#2D2326',
      '--color-surface': '#3E2F32',
      '--color-primary-accent': '#FFB6B9',
      '--color-secondary-accent': '#FFD1C1',
      '--color-disabled': '#5A4D4D',
      '--color-error': '#FF5349',
      '--color-error-text': '#FFE4E1',
      '--mixer-visualizer-color-1': '#FFB6B9',
      '--mixer-visualizer-color-2': '#FFD1C1',
      '--mixer-visualizer-color-3': '#FFE4E1',
      '--mixer-background-overlay': 'rgba(45, 35, 38, 0.95)',
      '--mixer-control-background': 'rgba(62, 47, 50, 0.8)',
      '--mixer-control-border': 'rgba(255, 182, 185, 0.18)',
      '--mixer-slider-track': '#3E2F32',
      '--mixer-slider-thumb': '#FFB6B9',
      '--mixer-slider-thumb-hover': '#FFD1C1',
      '--player-control-background': 'rgba(62, 47, 50, 0.8)',
      '--player-tracklist-background': 'rgba(45, 35, 38, 0.9)',
      '--player-progress-track': '#2D2326',
      '--player-progress-fill': '#FFB6B9',
      '--player-album-art-border': 'rgba(255, 182, 185, 0.18)',
      '--player-header-background': 'rgba(0, 0, 0, 0.1)',
      '--player-window-border': 'rgba(255, 182, 185, 0.18)',
      '--toggle-off-background': 'rgba(62, 47, 50, 0.8)',
      '--toggle-off-border': 'rgba(255, 182, 185, 0.08)',
      '--toggle-off-text': 'rgba(255, 209, 193, 0.8)',
      '--toggle-on-background': 'rgba(255, 182, 185, 0.15)',
      '--toggle-on-border': 'rgba(255, 182, 185, 0.3)',
      '--toggle-on-text': '#FFB6B9',
      '--toggle-hover-background': 'rgba(62, 47, 50, 0.9)',
      '--toggle-hover-border': 'rgba(255, 182, 185, 0.18)',
      '--toggle-glow-color': 'rgba(255, 182, 185, 0.25)',
    },
  },

  dusk: {
    name: 'dusk',
    displayName: 'dusk',
    description:
      'Electric blue, magenta, and black for a bold, synthwave-inspired look.',
    variables: {
      '--color-background-primary': '#181A24',
      '--color-surface-primary': '#23243E',
      '--color-text-primary': '#E0E6FF',
      '--color-text-secondary': '#B0A8CC',
      '--color-accent-primary': '#00BFFF',
      '--color-accent-secondary': '#FF2D95',
      '--color-border': 'rgba(0, 191, 255, 0.18)',
      '--color-shadow': 'rgba(24, 26, 36, 0.8)',
      '--color-interactive-hover': 'rgba(0, 191, 255, 0.08)',
      '--color-interactive-active': 'rgba(0, 191, 255, 0.15)',
      '--color-background': '#181A24',
      '--color-surface': '#23243E',
      '--color-primary-accent': '#00BFFF',
      '--color-secondary-accent': '#FF2D95',
      '--color-disabled': '#433E5C',
      '--color-error': '#F43F8A',
      '--color-error-text': '#E0E6FF',
      '--mixer-visualizer-color-1': '#00BFFF',
      '--mixer-visualizer-color-2': '#FF2D95',
      '--mixer-visualizer-color-3': '#B0A8CC',
      '--mixer-background-overlay': 'rgba(24, 26, 36, 0.95)',
      '--mixer-control-background': 'rgba(35, 36, 62, 0.8)',
      '--mixer-control-border': 'rgba(0, 191, 255, 0.18)',
      '--mixer-slider-track': '#23243E',
      '--mixer-slider-thumb': '#00BFFF',
      '--mixer-slider-thumb-hover': '#FF2D95',
      '--player-control-background': 'rgba(35, 36, 62, 0.8)',
      '--player-tracklist-background': 'rgba(24, 26, 36, 0.9)',
      '--player-progress-track': '#181A24',
      '--player-progress-fill': '#00BFFF',
      '--player-album-art-border': 'rgba(0, 191, 255, 0.18)',
      '--player-header-background': 'rgba(0, 0, 0, 0.1)',
      '--player-window-border': 'rgba(0, 191, 255, 0.18)',
      '--toggle-off-background': 'rgba(35, 36, 62, 0.8)',
      '--toggle-off-border': 'rgba(0, 191, 255, 0.08)',
      '--toggle-off-text': 'rgba(176, 168, 204, 0.8)',
      '--toggle-on-background': 'rgba(0, 191, 255, 0.15)',
      '--toggle-on-border': 'rgba(0, 191, 255, 0.3)',
      '--toggle-on-text': '#00BFFF',
      '--toggle-hover-background': 'rgba(35, 36, 62, 0.9)',
      '--toggle-hover-border': 'rgba(0, 191, 255, 0.18)',
      '--toggle-glow-color': 'rgba(0, 191, 255, 0.25)',
    },
  },

  crimson: {
    name: 'crimson',
    displayName: 'crimson',
    description:
      'Rich reds, deep browns, and soft pinks for a warm, passionate look.',
    variables: {
      '--color-background-primary': '#431407',
      '--color-surface-primary': '#5A1F0E',
      '--color-text-primary': '#FFD6D6',
      '--color-text-secondary': '#FFADAD',
      '--color-accent-primary': '#FF5050',
      '--color-accent-secondary': '#FFADAD',
      '--color-border': 'rgba(255, 80, 80, 0.18)',
      '--color-shadow': 'rgba(67, 20, 7, 0.8)',
      '--color-interactive-hover': 'rgba(255, 80, 80, 0.08)',
      '--color-interactive-active': 'rgba(255, 80, 80, 0.15)',
      '--color-background': '#431407',
      '--color-surface': '#5A1F0E',
      '--color-primary-accent': '#FF5050',
      '--color-secondary-accent': '#FFADAD',
      '--color-disabled': '#636363',
      '--color-error': '#FF5349',
      '--color-error-text': '#FFD6D6',
      '--mixer-visualizer-color-1': '#FF5050',
      '--mixer-visualizer-color-2': '#FFADAD',
      '--mixer-visualizer-color-3': '#FFD6D6',
      '--mixer-background-overlay': 'rgba(67, 20, 7, 0.95)',
      '--mixer-control-background': 'rgba(90, 31, 14, 0.8)',
      '--mixer-control-border': 'rgba(255, 80, 80, 0.18)',
      '--mixer-slider-track': '#5A1F0E',
      '--mixer-slider-thumb': '#FF5050',
      '--mixer-slider-thumb-hover': '#FFADAD',
      '--player-control-background': 'rgba(90, 31, 14, 0.8)',
      '--player-tracklist-background': 'rgba(67, 20, 7, 0.9)',
      '--player-progress-track': '#431407',
      '--player-progress-fill': '#FF5050',
      '--player-album-art-border': 'rgba(255, 80, 80, 0.18)',
      '--player-header-background': 'rgba(0, 0, 0, 0.1)',
      '--player-window-border': 'rgba(255, 80, 80, 0.18)',
      '--toggle-off-background': 'rgba(90, 31, 14, 0.8)',
      '--toggle-off-border': 'rgba(255, 80, 80, 0.08)',
      '--toggle-off-text': 'rgba(255, 173, 173, 0.8)',
      '--toggle-on-background': 'rgba(255, 80, 80, 0.15)',
      '--toggle-on-border': 'rgba(255, 80, 80, 0.3)',
      '--toggle-on-text': '#FF5050',
      '--toggle-hover-background': 'rgba(90, 31, 14, 0.9)',
      '--toggle-hover-border': 'rgba(255, 80, 80, 0.18)',
      '--toggle-glow-color': 'rgba(255, 80, 80, 0.25)',
    },
  },

  whisper: {
    name: 'whisper',
    displayName: 'whisper',
    description:
      'Natural greens, soft blues, and gentle grays for a peaceful, organic look.',
    variables: {
      '--color-background-primary': '#4A4A4A',
      '--color-surface-primary': '#5A5A5A',
      '--color-text-primary': '#F8F8F5',
      '--color-text-secondary': '#E4E5E8',
      '--color-accent-primary': '#B7C1A1',
      '--color-accent-secondary': '#A9BFD8',
      '--color-border': 'rgba(183, 193, 161, 0.18)',
      '--color-shadow': 'rgba(74, 74, 74, 0.8)',
      '--color-interactive-hover': 'rgba(183, 193, 161, 0.08)',
      '--color-interactive-active': 'rgba(183, 193, 161, 0.15)',
      '--color-background': '#4A4A4A',
      '--color-surface': '#5A5A5A',
      '--color-primary-accent': '#B7C1A1',
      '--color-secondary-accent': '#A9BFD8',
      '--color-disabled': '#636363',
      '--color-error': '#FF5349',
      '--color-error-text': '#F8F8F5',
      '--mixer-visualizer-color-1': '#B7C1A1',
      '--mixer-visualizer-color-2': '#A9BFD8',
      '--mixer-visualizer-color-3': '#E4E5E8',
      '--mixer-background-overlay': 'rgba(74, 74, 74, 0.95)',
      '--mixer-control-background': 'rgba(90, 90, 90, 0.8)',
      '--mixer-control-border': 'rgba(183, 193, 161, 0.18)',
      '--mixer-slider-track': '#5A5A5A',
      '--mixer-slider-thumb': '#B7C1A1',
      '--mixer-slider-thumb-hover': '#A9BFD8',
      '--player-control-background': 'rgba(90, 90, 90, 0.8)',
      '--player-tracklist-background': 'rgba(74, 74, 74, 0.9)',
      '--player-progress-track': '#4A4A4A',
      '--player-progress-fill': '#B7C1A1',
      '--player-album-art-border': 'rgba(183, 193, 161, 0.18)',
      '--player-header-background': 'rgba(0, 0, 0, 0.1)',
      '--player-window-border': 'rgba(183, 193, 161, 0.18)',
      '--toggle-off-background': 'rgba(90, 90, 90, 0.8)',
      '--toggle-off-border': 'rgba(183, 193, 161, 0.08)',
      '--toggle-off-text': 'rgba(228, 229, 232, 0.8)',
      '--toggle-on-background': 'rgba(183, 193, 161, 0.15)',
      '--toggle-on-border': 'rgba(183, 193, 161, 0.3)',
      '--toggle-on-text': '#B7C1A1',
      '--toggle-hover-background': 'rgba(90, 90, 90, 0.9)',
      '--toggle-hover-border': 'rgba(183, 193, 161, 0.18)',
      '--toggle-glow-color': 'rgba(183, 193, 161, 0.25)',
    },
  },

  deepEnd: {
    name: 'deepEnd',
    displayName: 'deep end',
    description:
      'Deep blues, teal accents, and mysterious dark tones for an immersive underwater feel.',
    variables: {
      '--color-background-primary': '#080715',
      '--color-surface-primary': '#2E2A31',
      '--color-text-primary': '#D5E9EA',
      '--color-text-secondary': '#A9BFD8',
      '--color-accent-primary': '#34567C',
      '--color-accent-secondary': '#D5E9EA',
      '--color-border': 'rgba(52, 86, 124, 0.18)',
      '--color-shadow': 'rgba(8, 7, 21, 0.8)',
      '--color-interactive-hover': 'rgba(52, 86, 124, 0.08)',
      '--color-interactive-active': 'rgba(52, 86, 124, 0.15)',
      '--color-background': '#080715',
      '--color-surface': '#2E2A31',
      '--color-primary-accent': '#34567C',
      '--color-secondary-accent': '#D5E9EA',
      '--color-disabled': '#636363',
      '--color-error': '#8B1A1E',
      '--color-error-text': '#D5E9EA',
      '--mixer-visualizer-color-1': '#34567C',
      '--mixer-visualizer-color-2': '#D5E9EA',
      '--mixer-visualizer-color-3': '#8B1A1E',
      '--mixer-background-overlay': 'rgba(8, 7, 21, 0.95)',
      '--mixer-control-background': 'rgba(46, 42, 49, 0.8)',
      '--mixer-control-border': 'rgba(52, 86, 124, 0.18)',
      '--mixer-slider-track': '#2E2A31',
      '--mixer-slider-thumb': '#34567C',
      '--mixer-slider-thumb-hover': '#D5E9EA',
      '--player-control-background': 'rgba(46, 42, 49, 0.8)',
      '--player-tracklist-background': 'rgba(8, 7, 21, 0.9)',
      '--player-progress-track': '#080715',
      '--player-progress-fill': '#34567C',
      '--player-album-art-border': 'rgba(52, 86, 124, 0.18)',
      '--player-header-background': 'rgba(0, 0, 0, 0.1)',
      '--player-window-border': 'rgba(52, 86, 124, 0.18)',
      '--toggle-off-background': 'rgba(46, 42, 49, 0.8)',
      '--toggle-off-border': 'rgba(52, 86, 124, 0.08)',
      '--toggle-off-text': 'rgba(213, 233, 234, 0.8)',
      '--toggle-on-background': 'rgba(52, 86, 124, 0.15)',
      '--toggle-on-border': 'rgba(52, 86, 124, 0.3)',
      '--toggle-on-text': '#34567C',
      '--toggle-hover-background': 'rgba(46, 42, 49, 0.9)',
      '--toggle-hover-border': 'rgba(52, 86, 124, 0.18)',
      '--toggle-glow-color': 'rgba(52, 86, 124, 0.25)',
    },
  },

  'midnight iris': {
    name: 'midnight iris',
    displayName: 'midnight iris',
    description:
      'Intimate indigo, violet, and blue with soft magenta accents for a cozy, moody neon look.',
    variables: {
      '--color-background-primary': '#18162A',
      '--color-surface-primary': '#23204A',
      '--color-text-primary': '#E0D6FF',
      '--color-text-secondary': '#B0A8CC',
      '--color-accent-primary': '#7A4FF0',
      '--color-accent-secondary': '#F43F8A',
      '--color-border': 'rgba(122, 79, 240, 0.18)',
      '--color-shadow': 'rgba(24, 22, 42, 0.8)',
      '--color-interactive-hover': 'rgba(122, 79, 240, 0.08)',
      '--color-interactive-active': 'rgba(122, 79, 240, 0.15)',
      '--color-background': '#18162A',
      '--color-surface': '#23204A',
      '--color-primary-accent': '#7A4FF0',
      '--color-secondary-accent': '#F43F8A',
      '--color-disabled': '#433E5C',
      '--color-error': '#F43F8A',
      '--color-error-text': '#E0D6FF',
      '--mixer-visualizer-color-1': '#7A4FF0',
      '--mixer-visualizer-color-2': '#F43F8A',
      '--mixer-visualizer-color-3': '#B0A8CC',
      '--mixer-background-overlay': 'rgba(24, 22, 42, 0.95)',
      '--mixer-control-background': 'rgba(35, 32, 74, 0.8)',
      '--mixer-control-border': 'rgba(122, 79, 240, 0.18)',
      '--mixer-slider-track': '#23204A',
      '--mixer-slider-thumb': '#7A4FF0',
      '--mixer-slider-thumb-hover': '#F43F8A',
      '--player-control-background': 'rgba(35, 32, 74, 0.8)',
      '--player-tracklist-background': 'rgba(24, 22, 42, 0.9)',
      '--player-progress-track': '#18162A',
      '--player-progress-fill': '#7A4FF0',
      '--player-album-art-border': 'rgba(122, 79, 240, 0.18)',
      '--player-header-background': 'rgba(0, 0, 0, 0.1)',
      '--player-window-border': 'rgba(122, 79, 240, 0.18)',
      '--toggle-off-background': 'rgba(35, 32, 74, 0.8)',
      '--toggle-off-border': 'rgba(122, 79, 240, 0.08)',
      '--toggle-off-text': 'rgba(176, 168, 204, 0.8)',
      '--toggle-on-background': 'rgba(122, 79, 240, 0.15)',
      '--toggle-on-border': 'rgba(122, 79, 240, 0.3)',
      '--toggle-on-text': '#7A4FF0',
      '--toggle-hover-background': 'rgba(35, 32, 74, 0.9)',
      '--toggle-hover-border': 'rgba(122, 79, 240, 0.18)',
      '--toggle-glow-color': 'rgba(122, 79, 240, 0.25)',
    },
  },

  plasma: {
    name: 'plasma',
    displayName: 'plasma',
    description:
      'Intimate, soft mauve, lavender, and blue with subtle neon pink/cyan accents for a dreamy synthwave vibe.',
    variables: {
      '--color-background-primary': '#221B2F',
      '--color-surface-primary': '#2E2540',
      '--color-text-primary': '#F3E8FF',
      '--color-text-secondary': '#C9BFE6',
      '--color-accent-primary': '#B794FF',
      '--color-accent-secondary': '#00E5D2',
      '--color-border': 'rgba(183, 148, 255, 0.18)',
      '--color-shadow': 'rgba(34, 27, 47, 0.8)',
      '--color-interactive-hover': 'rgba(183, 148, 255, 0.08)',
      '--color-interactive-active': 'rgba(183, 148, 255, 0.15)',
      '--color-background': '#221B2F',
      '--color-surface': '#2E2540',
      '--color-primary-accent': '#B794FF',
      '--color-secondary-accent': '#00E5D2',
      '--color-disabled': '#433E5C',
      '--color-error': '#F43F8A',
      '--color-error-text': '#F3E8FF',
      '--mixer-visualizer-color-1': '#B794FF',
      '--mixer-visualizer-color-2': '#00E5D2',
      '--mixer-visualizer-color-3': '#F43F8A',
      '--mixer-background-overlay': 'rgba(34, 27, 47, 0.95)',
      '--mixer-control-background': 'rgba(46, 37, 64, 0.8)',
      '--mixer-control-border': 'rgba(183, 148, 255, 0.18)',
      '--mixer-slider-track': '#2E2540',
      '--mixer-slider-thumb': '#B794FF',
      '--mixer-slider-thumb-hover': '#00E5D2',
      '--player-control-background': 'rgba(46, 37, 64, 0.8)',
      '--player-tracklist-background': 'rgba(34, 27, 47, 0.9)',
      '--player-progress-track': '#221B2F',
      '--player-progress-fill': '#B794FF',
      '--player-album-art-border': 'rgba(183, 148, 255, 0.18)',
      '--player-header-background': 'rgba(0, 0, 0, 0.1)',
      '--player-window-border': 'rgba(183, 148, 255, 0.18)',
      '--toggle-off-background': 'rgba(46, 37, 64, 0.8)',
      '--toggle-off-border': 'rgba(183, 148, 255, 0.08)',
      '--toggle-off-text': 'rgba(201, 191, 230, 0.8)',
      '--toggle-on-background': 'rgba(183, 148, 255, 0.15)',
      '--toggle-on-border': 'rgba(183, 148, 255, 0.3)',
      '--toggle-on-text': '#B794FF',
      '--toggle-hover-background': 'rgba(46, 37, 64, 0.9)',
      '--toggle-hover-border': 'rgba(183, 148, 255, 0.18)',
      '--toggle-glow-color': 'rgba(183, 148, 255, 0.25)',
    },
  },

  zen: {
    name: 'zen',
    displayName: 'zen',
    description:
      'Calming blue-grays and deep blues for a peaceful, meditative atmosphere.',
    variables: {
      '--color-background-primary': '#141B3D',
      '--color-surface-primary': '#29325C',
      '--color-text-primary': '#CCD0E6',
      '--color-text-secondary': '#8690C1',
      '--color-accent-primary': '#525F9E',
      '--color-accent-secondary': '#8690C1',
      '--color-border': 'rgba(82, 95, 158, 0.18)',
      '--color-shadow': 'rgba(20, 27, 61, 0.8)',
      '--color-interactive-hover': 'rgba(82, 95, 158, 0.08)',
      '--color-interactive-active': 'rgba(82, 95, 158, 0.15)',
      '--color-background': '#141B3D',
      '--color-surface': '#29325C',
      '--color-primary-accent': '#525F9E',
      '--color-secondary-accent': '#8690C1',
      '--color-disabled': '#636363',
      '--color-error': '#FF5349',
      '--color-error-text': '#CCD0E6',
      '--mixer-visualizer-color-1': '#525F9E',
      '--mixer-visualizer-color-2': '#8690C1',
      '--mixer-visualizer-color-3': '#CCD0E6',
      '--mixer-background-overlay': 'rgba(20, 27, 61, 0.95)',
      '--mixer-control-background': 'rgba(41, 50, 92, 0.8)',
      '--mixer-control-border': 'rgba(82, 95, 158, 0.18)',
      '--mixer-slider-track': '#29325C',
      '--mixer-slider-thumb': '#525F9E',
      '--mixer-slider-thumb-hover': '#8690C1',
      '--player-control-background': 'rgba(41, 50, 92, 0.8)',
      '--player-tracklist-background': 'rgba(20, 27, 61, 0.9)',
      '--player-progress-track': '#141B3D',
      '--player-progress-fill': '#525F9E',
      '--player-album-art-border': 'rgba(82, 95, 158, 0.18)',
      '--player-header-background': 'rgba(0, 0, 0, 0.1)',
      '--player-window-border': 'rgba(82, 95, 158, 0.18)',
      '--toggle-off-background': 'rgba(41, 50, 92, 0.8)',
      '--toggle-off-border': 'rgba(82, 95, 158, 0.08)',
      '--toggle-off-text': 'rgba(134, 144, 193, 0.8)',
      '--toggle-on-background': 'rgba(82, 95, 158, 0.15)',
      '--toggle-on-border': 'rgba(82, 95, 158, 0.3)',
      '--toggle-on-text': '#525F9E',
      '--toggle-hover-background': 'rgba(41, 50, 92, 0.9)',
      '--toggle-hover-border': 'rgba(82, 95, 158, 0.18)',
      '--toggle-glow-color': 'rgba(82, 95, 158, 0.25)',
    },
  },

  abyss: {
    name: 'abyss',
    displayName: 'abyss',
    description:
      'Vibrant coral, electric lime, and deep teal for a tropical sunset meets neon aesthetic.',
    variables: {
      '--color-background-primary': '#1a1a2e',
      '--color-surface-primary': '#16213e',
      '--color-text-primary': '#ff6b6b',
      '--color-text-secondary': '#4ecdc4',
      '--color-accent-primary': '#ffa726',
      '--color-accent-secondary': '#66bb6a',
      '--color-border': 'rgba(255, 107, 107, 0.3)',
      '--color-shadow': 'rgba(26, 26, 46, 0.9)',
      '--color-interactive-hover': 'rgba(255, 167, 38, 0.2)',
      '--color-interactive-active': 'rgba(102, 187, 106, 0.25)',
      '--color-background': '#1a1a2e',
      '--color-surface': '#16213e',
      '--color-primary-accent': '#ffa726',
      '--color-secondary-accent': '#66bb6a',
      '--color-disabled': '#2a2a3a',
      '--color-error': '#ef5350',
      '--color-error-text': '#ff6b6b',
      '--mixer-visualizer-color-1': '#ffa726',
      '--mixer-visualizer-color-2': '#66bb6a',
      '--mixer-visualizer-color-3': '#4ecdc4',
      '--mixer-background-overlay': 'rgba(26, 26, 46, 0.95)',
      '--mixer-control-background': 'rgba(22, 33, 62, 0.9)',
      '--mixer-control-border': 'rgba(255, 107, 107, 0.3)',
      '--mixer-slider-track': '#16213e',
      '--mixer-slider-thumb': '#ffa726',
      '--mixer-slider-thumb-hover': '#66bb6a',
      '--player-control-background': 'rgba(22, 33, 62, 0.9)',
      '--player-tracklist-background': 'rgba(26, 26, 46, 0.95)',
      '--player-progress-track': '#1a1a2e',
      '--player-progress-fill': '#ffa726',
      '--player-album-art-border': 'rgba(255, 107, 107, 0.3)',
      '--player-header-background': 'rgba(0, 0, 0, 0.2)',
      '--player-window-border': 'rgba(255, 107, 107, 0.3)',
      '--toggle-off-background': 'rgba(22, 33, 62, 0.9)',
      '--toggle-off-border': 'rgba(255, 167, 38, 0.15)',
      '--toggle-off-text': 'rgba(255, 107, 107, 0.7)',
      '--toggle-on-background': 'rgba(255, 167, 38, 0.25)',
      '--toggle-on-border': 'rgba(255, 167, 38, 0.4)',
      '--toggle-on-text': '#ffa726',
      '--toggle-hover-background': 'rgba(22, 33, 62, 0.95)',
      '--toggle-hover-border': 'rgba(102, 187, 106, 0.3)',
      '--toggle-glow-color': 'rgba(255, 167, 38, 0.4)',
    },
  },
};

export const getThemeVariables = (themeName: string): ThemeVariables => {
  const theme = themes[themeName];
  if (!theme) {
    
    return themes['plasma']?.variables || ({} as ThemeVariables);
  }
  return theme.variables;
};

export const applyTheme = (themeName: string): void => {
  const startTime = performance.now();
  const variables = getThemeVariables(themeName);

  requestAnimationFrame(() => {
    try {
      const root = document.documentElement;
      const style = root.style;

      Object.entries(variables).forEach(([property, value]) => {
        style.setProperty(property, value);
      });

      document.body.setAttribute('data-theme', themeName);

     
      window.dispatchEvent(
        new CustomEvent('themeChanged', {
          detail: { themeName, variables },
        })
      );

      performanceUtils.monitorThemeChange(themeName, startTime);
    } catch (error) {
      
      applyTheme('plasma');
    }
  });
};

export const validateTheme = (themeName: string): boolean => {
  const theme = themes[themeName];
  if (!theme) {
    
    return false;
  }

  const requiredVariables = [
    '--color-background-primary',
    '--color-surface-primary',
    '--color-text-primary',
    '--color-accent-primary',
  ];

  const missingVariables = requiredVariables.filter(
    variable => !(variable in theme.variables)
  );

  if (missingVariables.length > 0) {
    
    return false;
  }

  
  return true;
};

export const getAvailableThemes = (): string[] => {
  return Object.keys(themes);
};

export const getThemeDisplayName = (themeName: string): string => {
  return themes[themeName]?.displayName || themeName;
};
