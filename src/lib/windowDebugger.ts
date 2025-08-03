export interface WindowMetrics {
  x: number;
  y: number;
  width: number;
  height: number;
  windowId: string;
  windowType: string;
  windowTitle: string;
}

export interface DebuggerOptions {
  continuous?: boolean;
  interval?: number;
  verbose?: boolean;
}

export function logWindowMetrics(
  windowId: string,
  windowName: string,
  options: DebuggerOptions = {}
): WindowMetrics | null {
  try {
    // Find the window element by its key attribute (which is the window.id)
    const windowElement = document.querySelector(
      `[data-window-id="${windowId}"]`
    ) as HTMLElement;

    if (!windowElement) {
      if (options.verbose) {
        console.warn(`Window "${windowName}" (${windowId}) not found in DOM`);
      }
      return null;
    }

    // Get the bounding rectangle
    const rect = windowElement.getBoundingClientRect();

    // Get computed styles for additional context
    const computedStyle = window.getComputedStyle(windowElement);

    const metrics: WindowMetrics = {
      x: rect.x,
      y: rect.y,
      width: rect.width,
      height: rect.height,
      windowId,
      windowType: windowName.toLowerCase(),
      windowTitle: windowName,
    };

    // Format the output
    const formattedOutput = {
      window: windowName,
      position: { x: Math.round(rect.x), y: Math.round(rect.y) },
      size: { width: Math.round(rect.width), height: Math.round(rect.height) },
      computed: {
        transform: computedStyle.transform,
        zIndex: computedStyle.zIndex,
        opacity: computedStyle.opacity,
      },
    };

    console.log(`📊 ${windowName} Window Metrics:`, formattedOutput);

    return metrics;
  } catch (error) {
    console.error(`❌ Error logging ${windowName} window metrics:`, error);
    return null;
  }
}

/**
 * Log Experience window metrics
 */
export function logExperienceWindowMetrics(
  options: DebuggerOptions = {}
): WindowMetrics | null {
  return logWindowMetrics('experience', 'Experience', options);
}

/**
 * Log Skills window metrics
 */
export function logSkillsWindowMetrics(
  options: DebuggerOptions = {}
): WindowMetrics | null {
  return logWindowMetrics('skills', 'Skills', options);
}

/**
 * Log About window metrics
 */
export function logAboutWindowMetrics(
  options: DebuggerOptions = {}
): WindowMetrics | null {
  return logWindowMetrics('about', 'About', options);
}

/**
 * Log all window metrics at once
 */
export function logAllWindowMetrics(
  options: DebuggerOptions = {}
): WindowMetrics[] {
  const results: WindowMetrics[] = [];

  console.group('🔍 All Window Metrics');

  const experienceMetrics = logExperienceWindowMetrics(options);
  if (experienceMetrics) results.push(experienceMetrics);

  const skillsMetrics = logSkillsWindowMetrics(options);
  if (skillsMetrics) results.push(skillsMetrics);

  const aboutMetrics = logAboutWindowMetrics(options);
  if (aboutMetrics) results.push(aboutMetrics);

  console.groupEnd();

  return results;
}

/**
 * Start continuous monitoring of window metrics
 * @param options - Debugger options including interval
 */
export function startWindowMonitoring(
  options: DebuggerOptions = {}
): () => void {
  const interval = options.interval || 1000; // Default to 1 second
  let intervalId: NodeJS.Timeout | null = null;

  console.log(`🚀 Starting window monitoring (interval: ${interval}ms)`);

  const monitor = () => {
    logAllWindowMetrics({ ...options, verbose: false });
  };

  // Start monitoring
  intervalId = setInterval(monitor, interval);

  // Return cleanup function
  return () => {
    if (intervalId) {
      clearInterval(intervalId);
      console.log('🛑 Window monitoring stopped');
    }
  };
}

/**
 * Create a debug button that logs metrics when clicked
 */
export function createDebugButton(
  windowName: string,
  onClick?: (metrics: WindowMetrics | null) => void
): HTMLButtonElement {
  const button = document.createElement('button');
  button.textContent = `Debug ${windowName}`;
  button.style.cssText = `
    position: fixed;
    top: 10px;
    right: 10px;
    z-index: 10000;
    padding: 8px 12px;
    background: #333;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 12px;
  `;

  button.onclick = () => {
    const metrics = logWindowMetrics(windowName.toLowerCase(), windowName, {
      verbose: true,
    });
    if (onClick) onClick(metrics);
  };

  return button;
}

/**
 * Get default window positions and sizes for initial state
 */
export function getDefaultWindowStates(): Record<
  string,
  {
    position: { x: number; y: number };
    size: { width: number; height: number };
  }
> {
  const screenWidth = window.innerWidth;
  const screenHeight = window.innerHeight;

  return {
    about: {
      position: { x: 50, y: 50 },
      size: {
        width: Math.min(screenWidth * 0.75, 1200),
        height: Math.min(screenHeight * 0.8, 900),
      },
    },
    experience: {
      position: { x: 100, y: 100 },
      size: {
        width: Math.min(screenWidth * 0.75, 1200),
        height: Math.min(screenHeight * 0.8, 900),
      },
    },
    skills: {
      position: { x: 150, y: 150 },
      size: {
        width: Math.min(screenWidth * 0.75, 1200),
        height: Math.min(screenHeight * 0.8, 900),
      },
    },
  };
}

/**
 * Extract metrics from current window state for React useState initialization
 */
export function extractMetricsForState(metrics: WindowMetrics): {
  position: { x: number; y: number };
  size: { width: number; height: number };
} {
  return {
    position: { x: metrics.x, y: metrics.y },
    size: { width: metrics.width, height: metrics.height },
  };
}

// Export for global access (useful for console debugging)
if (typeof window !== 'undefined') {
  (window as any).windowDebugger = {
    logExperienceWindowMetrics,
    logSkillsWindowMetrics,
    logAboutWindowMetrics,
    logAllWindowMetrics,
    startWindowMonitoring,
    createDebugButton,
    getDefaultWindowStates,
    extractMetricsForState,
  };
}
