
import { useEffect, useCallback, useState } from 'react';
import {
  logWindowMetrics,
  logAllWindowMetrics,
  startWindowMonitoring,
  WindowMetrics,
  DebuggerOptions,
} from '@/lib/windowDebugger';

export interface UseWindowDebuggerOptions extends DebuggerOptions {
  autoStart?: boolean;
  onMetricsChange?: (metrics: WindowMetrics[]) => void;
}

export function useWindowDebugger(options: UseWindowDebuggerOptions = {}) {
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [lastMetrics, setLastMetrics] = useState<WindowMetrics[]>([]);

  
  const logExperience = useCallback(
    (opts?: DebuggerOptions) => {
      return logWindowMetrics('experience', 'Experience', {
        ...options,
        ...opts,
      });
    },
    [options]
  );

  const logSkills = useCallback(
    (opts?: DebuggerOptions) => {
      return logWindowMetrics('skills', 'Skills', { ...options, ...opts });
    },
    [options]
  );

  const logAbout = useCallback(
    (opts?: DebuggerOptions) => {
      return logWindowMetrics('about', 'About', { ...options, ...opts });
    },
    [options]
  );

  
  const logAll = useCallback(
    (opts?: DebuggerOptions) => {
      const metrics = logAllWindowMetrics({ ...options, ...opts });
      setLastMetrics(metrics);
      if (options.onMetricsChange) {
        options.onMetricsChange(metrics);
      }
      return metrics;
    },
    [options]
  );

  
  const startMonitoring = useCallback(
    (monitoringOptions?: DebuggerOptions) => {
      const stopMonitoring = startWindowMonitoring({
        ...options,
        ...monitoringOptions,
      });
      setIsMonitoring(true);

      
      return () => {
        stopMonitoring();
        setIsMonitoring(false);
      };
    },
    [options]
  );

  
  const stopMonitoring = useCallback(() => {
    setIsMonitoring(false);
  }, []);

  
  useEffect(() => {
    if (options.autoStart && !isMonitoring) {
      const cleanup = startMonitoring();
      return cleanup;
    }
  }, [options.autoStart, isMonitoring, startMonitoring]);

  
  useEffect(() => {
    if (options.continuous) {
      const handleResize = () => {
        logAll({ verbose: false });
      };

      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
  }, [options.continuous, logAll]);

  return {
    
    logExperience,
    logSkills,
    logAbout,
    logAll,

    
    startMonitoring,
    stopMonitoring,
    isMonitoring,

      
    lastMetrics,

    
    getDefaultStates: () => ({
      about: { position: { x: 50, y: 50 }, size: { width: 1200, height: 900 } },
      experience: {
        position: { x: 100, y: 100 },
        size: { width: 1200, height: 900 },
      },
      skills: {
        position: { x: 150, y: 150 },
        size: { width: 1200, height: 900 },
      },
    }),
  };
}
