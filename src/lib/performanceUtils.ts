export const performanceUtils = {
  monitorThemeChange: (themeName: string, startTime: number) => {
    const endTime = performance.now();
    const duration = endTime - startTime;

    if (duration > 100) {
      console.warn(
        `Theme change to "${themeName}" took ${duration.toFixed(2)}ms - consider optimization`
      );
    } else if (process.env.NODE_ENV === 'development') {
      console.log(
        `Theme change to "${themeName}" completed in ${duration.toFixed(2)}ms`
      );
    }
  },

  monitorBackgroundChange: (
    backgroundName: string,
    fileSize: number,
    startTime: number
  ) => {
    const endTime = performance.now();
    const duration = endTime - startTime;

    if (fileSize > 5000) {
      console.warn(
        `Large background file "${backgroundName}" (${(fileSize / 1024).toFixed(1)}KB) may cause performance issues`
      );
    }

    if (duration > 500) {
      console.warn(
        `Background change to "${backgroundName}" took ${duration.toFixed(2)}ms - consider optimization`
      );
    } else if (process.env.NODE_ENV === 'development') {
      console.log(
        `Background change to "${backgroundName}" completed in ${duration.toFixed(2)}ms`
      );
    }
  },

  debounce: <T extends (...args: any[]) => any>(
    func: T,
    wait: number
  ): ((...args: Parameters<T>) => void) => {
    let timeout: NodeJS.Timeout;
    return (...args: Parameters<T>) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    };
  },

  throttle: <T extends (...args: any[]) => any>(
    func: T,
    limit: number
  ): ((...args: Parameters<T>) => void) => {
    let inThrottle: boolean;
    return (...args: Parameters<T>) => {
      if (!inThrottle) {
        func(...args);
        inThrottle = true;
        setTimeout(() => (inThrottle = false), limit);
      }
    };
  },

  batchDOMUpdates: (updates: (() => void)[]) => {
    requestAnimationFrame(() => {
      updates.forEach(update => update());
    });
  },

  isLowEndDevice: (): boolean => {
    const memory = (performance as any).memory;
    if (memory) {
      const totalMemory = memory.jsHeapSizeLimit / (1024 * 1024); 
      return totalMemory < 512; 
    }
    return false;
  },

  getPerformanceRecommendations: () => {
    const recommendations = [];

    if (performanceUtils.isLowEndDevice()) {
      recommendations.push(
        'Consider using smaller background files on low-end devices'
      );
      recommendations.push('Reduce visualizer complexity on low-end devices');
    }

    return recommendations;
  },
};

export const fileSizeUtils = {
  formatBytes: (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  },

  isAcceptableSize: (bytes: number, maxSize: number = 5000000): boolean => {
    return bytes <= maxSize;
  },

  getWarningLevel: (bytes: number): 'none' | 'warning' | 'critical' => {
    if (bytes <= 1000000) return 'none'; 
    if (bytes <= 5000000) return 'warning'; 
    return 'critical'; 
  },
};

export const themeUtils = {
  preloadThemeColors: (themeName: string, themes: any) => {
    const theme = themes[themeName];
    if (!theme) return;

    const root = document.documentElement;
    Object.entries(theme.variables).forEach(([property, value]) => {
      root.style.setProperty(property, value as string);
    });
  },

  validateThemePerformance: (themeName: string, themes: any) => {
    const theme = themes[themeName];
    if (!theme) return false;

    const variableCount = Object.keys(theme.variables).length;
    if (variableCount > 50) {
      console.warn(
        `Theme "${themeName}" has ${variableCount} variables - consider optimization`
      );
      return false;
    }

    return true;
  },
};

export default performanceUtils;
