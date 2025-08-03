export interface WindowDefaults {
  position: { x: number; y: number };
  size: { width: number; height: number };
}

export interface WindowDefaultsConfig {
  [key: string]: WindowDefaults;
}

export const WINDOW_DEFAULTS: WindowDefaultsConfig = {
  about: {
    position: { x: 218, y: 38 },
    size: { width: 2266, height: 1172 },
  },
  experience: {
    position: { x: 785, y: 0 },
    size: { width: 1820, height: 1178 },
  },
  skills: {
    position: { x: 430, y: 57 },
    size: { width: 1988, height: 1178 },
  },
  projects: {
    position: { x: 200, y: 200 },
    size: { width: 1200, height: 900 },
  },
  contact: {
    position: { x: 250, y: 250 },
    size: { width: 1200, height: 900 },
  },
  weather: {
    position: { x: 300, y: 300 },
    size: { width: 1200, height: 900 },
  },
  github: {
    position: { x: 350, y: 350 },
    size: { width: 1200, height: 900 },
  },
  spotify: {
    position: { x: 200, y: 100 },
    size: { width: 1200, height: 900 },
  },
};

export function getWindowDefaults(windowType: string): WindowDefaults {
  return WINDOW_DEFAULTS[windowType] || getCenteredDefaults();
}

export function getCenteredDefaults(): WindowDefaults {
  const screenWidth = typeof window !== 'undefined' ? window.innerWidth : 1920;
  const screenHeight =
    typeof window !== 'undefined' ? window.innerHeight : 1080;

  const width = Math.min(screenWidth * 0.75, 1200);
  const height = Math.min(screenHeight * 0.8, 900);

  return {
    position: {
      x: (screenWidth - width) / 2,
      y: (screenHeight - height) / 2,
    },
    size: { width, height },
  };
}

export function updateWindowDefaults(
  windowType: string,
  defaults: WindowDefaults
): void {
  WINDOW_DEFAULTS[windowType] = defaults;
  
}

export function updateDefaultsFromMetrics(
  windowType: string,
  metrics: any
): void {
  const newDefaults: WindowDefaults = {
    position: { x: metrics.x, y: metrics.y },
    size: { width: metrics.width, height: metrics.height },
  };
  updateWindowDefaults(windowType, newDefaults);
  
}

export function getAllWindowDefaults(): WindowDefaultsConfig {
  return { ...WINDOW_DEFAULTS };
}

export function resetWindowDefaults(): void {
  
}

export default WINDOW_DEFAULTS;
