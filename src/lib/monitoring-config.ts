/**
 * Monitoring Configuration
 * 
 * Centralized configuration for all monitoring and error tracking services
 */

// =============================================================================
// ERROR TRACKING SERVICES
// =============================================================================

export const ERROR_TRACKING_CONFIG = {
  // Sentry Configuration
  sentry: {
    dsn: process.env.NEXT_PUBLIC_SENTRY_DSN || process.env.SENTRY_DSN,
    environment: process.env.NODE_ENV,
    tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1.0,
  },

  // LogRocket Configuration
  logrocket: {
    appId: process.env.NEXT_PUBLIC_LOGROCKET_APP_ID || process.env.LOGROCKET_APP_ID,
    environment: process.env.NODE_ENV,
  },

  // Custom Error Storage
  custom: {
    endpoint: process.env.ERROR_STORAGE_ENDPOINT,
    apiKey: process.env.ERROR_STORAGE_API_KEY,
  },
};

// =============================================================================
// ANALYTICS SERVICES
// =============================================================================

export const ANALYTICS_CONFIG = {
  // Google Analytics
  googleAnalytics: {
    measurementId: process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || process.env.GA_MEASUREMENT_ID,
    debugMode: process.env.NODE_ENV === 'development',
  },

  // Vercel Analytics
  vercelAnalytics: {
    enabled: process.env.NEXT_PUBLIC_VERCEL_ANALYTICS_ID || process.env.VERCEL_ANALYTICS_ID,
  },

  // Custom Analytics
  custom: {
    endpoint: process.env.ANALYTICS_ENDPOINT,
    apiKey: process.env.ANALYTICS_API_KEY,
  },
};

// =============================================================================
// PERFORMANCE MONITORING
// =============================================================================

export const PERFORMANCE_CONFIG = {
  // Core Web Vitals Thresholds
  thresholds: {
    lcp: {
      good: 2500, // 2.5 seconds
      needsImprovement: 4000, // 4 seconds
      poor: 4000, // 4+ seconds
    },
    fid: {
      good: 100, // 100ms
      needsImprovement: 300, // 300ms
      poor: 300, // 300+ ms
    },
    cls: {
      good: 0.1, // 0.1
      needsImprovement: 0.25, // 0.25
      poor: 0.25, // 0.25+
    },
    ttfb: {
      good: 800, // 800ms
      needsImprovement: 1800, // 1.8s
      poor: 1800, // 1.8s+
    },
  },

  // Custom Performance Metrics
  customMetrics: {
    bundleSize: {
      warning: 500 * 1024, // 500KB
      critical: 1000 * 1024, // 1MB
    },
    loadTime: {
      warning: 3000, // 3 seconds
      critical: 5000, // 5 seconds
    },
  },
};

// =============================================================================
// ALERTING CONFIGURATION
// =============================================================================

export const ALERTING_CONFIG = {
  // Error Rate Thresholds
  errorRate: {
    warning: 0.01, // 1% error rate
    critical: 0.05, // 5% error rate
  },

  // Performance Alert Thresholds
  performance: {
    lcp: {
      warning: 3000, // 3 seconds
      critical: 5000, // 5 seconds
    },
    fid: {
      warning: 200, // 200ms
      critical: 500, // 500ms
    },
    cls: {
      warning: 0.15, // 0.15
      critical: 0.3, // 0.3
    },
  },

  // Alert Channels
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

// =============================================================================
// MONITORING SERVICE INTEGRATIONS
// =============================================================================

export const MONITORING_SERVICES = {
  // Sentry Integration
  sentry: {
    enabled: !!ERROR_TRACKING_CONFIG.sentry.dsn,
    config: ERROR_TRACKING_CONFIG.sentry,
  },

  // LogRocket Integration
  logrocket: {
    enabled: !!ERROR_TRACKING_CONFIG.logrocket.appId,
    config: ERROR_TRACKING_CONFIG.logrocket,
  },

  // Google Analytics Integration
  googleAnalytics: {
    enabled: !!ANALYTICS_CONFIG.googleAnalytics.measurementId,
    config: ANALYTICS_CONFIG.googleAnalytics,
  },

  // Vercel Analytics Integration
  vercelAnalytics: {
    enabled: !!ANALYTICS_CONFIG.vercelAnalytics.enabled,
    config: ANALYTICS_CONFIG.vercelAnalytics,
  },
};

// =============================================================================
// ENVIRONMENT-SPECIFIC CONFIGURATIONS
// =============================================================================

export const getEnvironmentConfig = () => {
  const isDevelopment = process.env.NODE_ENV === 'development';
  const isProduction = process.env.NODE_ENV === 'production';
  const isTest = process.env.NODE_ENV === 'test';

  return {
    // Development Environment
    development: {
      errorSampling: 1.0, // Capture all errors
      performanceSampling: 1.0, // Capture all performance data
      consoleLogging: true,
      debugMode: true,
    },

    // Production Environment
    production: {
      errorSampling: 0.1, // Sample 10% of errors
      performanceSampling: 0.1, // Sample 10% of performance data
      consoleLogging: false,
      debugMode: false,
    },

    // Test Environment
    test: {
      errorSampling: 0.0, // Don't capture errors in tests
      performanceSampling: 0.0, // Don't capture performance in tests
      consoleLogging: false,
      debugMode: false,
    },
  }[process.env.NODE_ENV || 'development'];
};

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

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