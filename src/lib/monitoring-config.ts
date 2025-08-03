
export const ERROR_TRACKING_CONFIG = {
  sentry: {
    dsn: process.env.NEXT_PUBLIC_SENTRY_DSN || process.env.SENTRY_DSN,
    environment: process.env.NODE_ENV,
    tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1.0,
  },

  logrocket: {
    appId: process.env.NEXT_PUBLIC_LOGROCKET_APP_ID || process.env.LOGROCKET_APP_ID,
    environment: process.env.NODE_ENV,
  },

  custom: {
    endpoint: process.env.ERROR_STORAGE_ENDPOINT,
    apiKey: process.env.ERROR_STORAGE_API_KEY,
  },
};

export const ANALYTICS_CONFIG = {
  googleAnalytics: {
    measurementId: process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || process.env.GA_MEASUREMENT_ID,
    debugMode: process.env.NODE_ENV === 'development',
  },

  vercelAnalytics: {
    enabled: process.env.NEXT_PUBLIC_VERCEL_ANALYTICS_ID || process.env.VERCEL_ANALYTICS_ID,
  },

  custom: {
    endpoint: process.env.ANALYTICS_ENDPOINT,
    apiKey: process.env.ANALYTICS_API_KEY,
  },
};

export const PERFORMANCE_CONFIG = {
  thresholds: {
    lcp: {
      good: 2500, 
      needsImprovement: 4000, 
      poor: 4000, 
    },
    fid: {
      good: 100, 
      needsImprovement: 300, 
      poor: 300, 
    },
    cls: {
      good: 0.1, 
      needsImprovement: 0.25, 
      poor: 0.25, 
    },
    ttfb: {
      good: 800, 
      needsImprovement: 1800, 
      poor: 1800, 
    },
  },

  customMetrics: {
    bundleSize: {
      warning: 500 * 1024, 
      critical: 1000 * 1024, 
    },
    loadTime: {
      warning: 3000, 
      critical: 5000, 
    },
  },
};

export const ALERTING_CONFIG = {
  errorRate: {
    warning: 0.01, 
    critical: 0.05, 
  },

  performance: {
    lcp: {
      warning: 3000, 
      critical: 5000, 
    },
    fid: {
      warning: 200, 
      critical: 500, 
    },
    cls: {
      warning: 0.15, 
      critical: 0.3, 
    },
  },

  channels: {
    email: {
      enabled: process.env.ALERT_EMAIL_ENABLED === 'true',
      recipients: process.env.ALERT_EMAIL_RECIPIENTS?.split(',') || [],
    },
    slack: {
      enabled: process.env.ALERT_SLACK_ENABLED === 'true',
      webhookUrl: process.env.ALERT_SLACK_WEBHOOK_URL,
      channel: process.env.ALERT_SLACK_CHANNEL || '#alerts',
    },
    pagerduty: {
      enabled: process.env.ALERT_PAGERDUTY_ENABLED === 'true',
      apiKey: process.env.ALERT_PAGERDUTY_API_KEY,
      serviceId: process.env.ALERT_PAGERDUTY_SERVICE_ID,
    },
  },
};

export const MONITORING_SERVICES = {
  sentry: {
    enabled: !!ERROR_TRACKING_CONFIG.sentry.dsn,
    config: ERROR_TRACKING_CONFIG.sentry,
  },

  logrocket: {
    enabled: !!ERROR_TRACKING_CONFIG.logrocket.appId,
    config: ERROR_TRACKING_CONFIG.logrocket,
  },

  googleAnalytics: {
    enabled: !!ANALYTICS_CONFIG.googleAnalytics.measurementId,
    config: ANALYTICS_CONFIG.googleAnalytics,
  },

  vercelAnalytics: {
    enabled: !!ANALYTICS_CONFIG.vercelAnalytics.enabled,
    config: ANALYTICS_CONFIG.vercelAnalytics,
  },
};


export const getEnvironmentConfig = () => {
  return {
    development: {
      errorSampling: 1.0, 
      performanceSampling: 1.0, 
      consoleLogging: true,
      debugMode: true,
    },

    production: {
      errorSampling: 0.1, 
      performanceSampling: 0.1, 
      consoleLogging: false,
      debugMode: false,
    },

    test: {
      errorSampling: 0.0, 
      performanceSampling: 0.0, 
      consoleLogging: false,
      debugMode: false,
    },
  }[process.env.NODE_ENV || 'development'];
};

export const isMonitoringEnabled = () => {
  return (
    MONITORING_SERVICES.sentry.enabled ||
    MONITORING_SERVICES.logrocket.enabled ||
    MONITORING_SERVICES.googleAnalytics.enabled ||
    MONITORING_SERVICES.vercelAnalytics.enabled
  );
};

export const getActiveServices = () => {
  return Object.entries(MONITORING_SERVICES)
    .filter(([_, service]) => service.enabled)
    .map(([name, _]) => name);
};

export const shouldSampleError = () => {
  const config = getEnvironmentConfig();
  return Math.random() < config.errorSampling;
};

export const shouldSamplePerformance = () => {
  const config = getEnvironmentConfig();
  return Math.random() < config.performanceSampling;
}; 