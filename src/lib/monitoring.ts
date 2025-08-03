

export interface PerformanceMetrics {
  lcp: number; 
  fid: number; 
  cls: number; 
  ttfb: number; 
  fcp: number; 
  
  bundleSize: number;
  loadTime: number;
  renderTime: number;
  
  timeToInteractive: number;
  totalBlockingTime: number;
}

export interface ErrorEvent {
  message: string;
  stack?: string | undefined;
  componentStack?: string | undefined;
  url: string;
  userAgent: string;
  timestamp: number;
  level: 'error' | 'warning' | 'info';
  category: 'client' | 'server' | 'api' | 'build';
  metadata?: Record<string, any> | undefined;
}

export interface UserSession {
  sessionId: string;
  userId?: string;
  startTime: number;
  pageViews: number;
  errors: number;
  performance: PerformanceMetrics;
}

class PerformanceMonitor {
  private metrics: PerformanceMetrics | null = null;
  private observers: PerformanceObserver[] = [];
  private isInitialized = false;

  constructor() {
    this.initializeObservers();
  }

  private initializeObservers() {
    if (typeof window === 'undefined' || this.isInitialized) return;

    if ('PerformanceObserver' in window) {
      try {
        const observer = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            this.handlePerformanceEntry(entry);
          }
        });

        observer.observe({ entryTypes: ['largest-contentful-paint', 'first-input', 'layout-shift'] });
        this.observers.push(observer);
      } catch (error) {
        console.warn('PerformanceObserver not supported:', error);
      }
    }

    if ('performance' in window) {
      this.captureNavigationMetrics();
    }

    this.isInitialized = true;
  }

  private handlePerformanceEntry(entry: PerformanceEntry) {
    if (!this.metrics) {
      this.metrics = {
        lcp: 0,
        fid: 0,
        cls: 0,
        ttfb: 0,
        fcp: 0,
        bundleSize: 0,
        loadTime: 0,
        renderTime: 0,
        timeToInteractive: 0,
        totalBlockingTime: 0,
      };
    }

    switch (entry.entryType) {
      case 'largest-contentful-paint':
        this.metrics = { ...this.metrics, lcp: entry.startTime };
        break;
      case 'first-input':
        this.metrics = { ...this.metrics, fid: (entry as any).processingStart - entry.startTime };
        break;
      case 'layout-shift':
        this.metrics = { ...this.metrics, cls: this.metrics.cls + (entry as any).value };
        break;
    }

    this.reportMetrics();
  }

  private captureNavigationMetrics() {
    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    if (navigation && this.metrics) {
      this.metrics = {
        ...this.metrics,
        ttfb: navigation.responseStart - navigation.requestStart,
        fcp: navigation.domContentLoadedEventEnd - navigation.fetchStart,
        loadTime: navigation.loadEventEnd - navigation.fetchStart,
        renderTime: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
      };
    }
  }

  private reportMetrics() {
    if (!this.metrics) return;

    this.sendToAnalytics('performance', this.metrics);
    
    if (process.env.NODE_ENV === 'development') {
      console.log('Performance Metrics:', this.metrics);
    }
  }

  public getMetrics(): PerformanceMetrics | null {
    return this.metrics;
  }

  public measureCustomMetric(name: string, value: number) {
    this.sendToAnalytics('custom_metric', { name, value, timestamp: Date.now() });
  }

  private sendToAnalytics(type: string, data: any) {
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', type, data);
    }
  }
}

class ErrorLogger {
  private sessionId: string;
  private errorCount = 0;
  private maxErrorsPerSession = 50;

  constructor() {
    this.sessionId = this.generateSessionId();
    this.initializeErrorHandling();
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private initializeErrorHandling() {
    if (typeof window === 'undefined') return;

    window.addEventListener('error', (event) => {
      this.captureError({
        message: event.message,
        stack: event.error?.stack,
        url: window.location.href,
        userAgent: navigator.userAgent,
        timestamp: Date.now(),
        level: 'error',
        category: 'client',
        metadata: {
          filename: event.filename,
          lineno: event.lineno,
          colno: event.colno,
        },
      });
    });

    window.addEventListener('unhandledrejection', (event) => {
      this.captureError({
        message: event.reason?.message || 'Unhandled Promise Rejection',
        stack: event.reason?.stack,
        url: window.location.href,
        userAgent: navigator.userAgent,
        timestamp: Date.now(),
        level: 'error',
        category: 'client',
        metadata: {
          reason: event.reason,
        },
      });
    });

    if (typeof window !== 'undefined') {
      (window as any).captureReactError = (error: Error, errorInfo: any) => {
        this.captureError({
          message: error.message,
          stack: error.stack || undefined,
          componentStack: errorInfo?.componentStack,
          url: window.location.href,
          userAgent: navigator.userAgent,
          timestamp: Date.now(),
          level: 'error',
          category: 'client',
          metadata: {
            errorInfo,
          },
        });
      };
    }
  }

  public captureError(error: ErrorEvent) {
    if (this.errorCount >= this.maxErrorsPerSession) {
      console.warn('Max errors per session reached, skipping error logging');
      return;
    }

    this.errorCount++;

    const enrichedError = {
      ...error,
      sessionId: this.sessionId,
      errorCount: this.errorCount,
    };

    this.sendToErrorService(enrichedError);

    if (process.env.NODE_ENV === 'development') {
      console.error('Captured Error:', enrichedError);
    }
  }

  public captureWarning(message: string, metadata?: Record<string, any>) {
    this.captureError({
      message,
      url: typeof window !== 'undefined' ? window.location.href : '',
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : '',
      timestamp: Date.now(),
      level: 'warning',
      category: 'client',
      metadata: metadata ?? {},
    });
  }

  public captureInfo(message: string, metadata?: Record<string, any>) {
    this.captureError({
      message,
      url: typeof window !== 'undefined' ? window.location.href : '',
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : '',
      timestamp: Date.now(),
      level: 'info',
      category: 'client',
      metadata: metadata ?? {},
    });
  }

  private sendToErrorService(error: ErrorEvent & { sessionId: string; errorCount: number }) {
    if (typeof window !== 'undefined' && (window as any).Sentry) {
      (window as any).Sentry.captureException(new Error(error.message), {
        extra: error,
        tags: {
          category: error.category,
          level: error.level,
          sessionId: error.sessionId,
        },
      });
    }

    fetch('/api/log-error', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(error),
    }).catch(() => {
    });
  }

  public getSessionId(): string {
    return this.sessionId;
  }

  public getErrorCount(): number {
    return this.errorCount;
  }
}

class SessionTracker {
  private session: UserSession;
  private performanceMonitor: PerformanceMonitor;
  private errorLogger: ErrorLogger;

  constructor() {
    this.performanceMonitor = new PerformanceMonitor();
    this.errorLogger = new ErrorLogger();
    
    this.session = {
      sessionId: this.errorLogger.getSessionId(),
      startTime: Date.now(),
      pageViews: 0,
      errors: 0,
      performance: {
        lcp: 0,
        fid: 0,
        cls: 0,
        ttfb: 0,
        fcp: 0,
        bundleSize: 0,
        loadTime: 0,
        renderTime: 0,
        timeToInteractive: 0,
        totalBlockingTime: 0,
      },
    };

    this.initializeSessionTracking();
  }

  private initializeSessionTracking() {
    if (typeof window === 'undefined') return;

    this.trackPageView();

    window.addEventListener('beforeunload', () => {
      this.endSession();
    });

    setTimeout(() => {
      const metrics = this.performanceMonitor.getMetrics();
      if (metrics) {
        this.session.performance = { ...this.session.performance, ...metrics };
      }
    }, 5000); 
  }

  public trackPageView() {
    this.session.pageViews++;
    this.sendToAnalytics('page_view', {
      url: window.location.href,
      sessionId: this.session.sessionId,
      pageViews: this.session.pageViews,
    });
  }

  public trackError() {
    this.session.errors++;
  }

  private endSession() {
    const sessionDuration = Date.now() - this.session.startTime;
    
    this.sendToAnalytics('session_end', {
      sessionId: this.session.sessionId,
      duration: sessionDuration,
      pageViews: this.session.pageViews,
      errors: this.session.errors,
      performance: this.session.performance,
    });
  }

  private sendToAnalytics(event: string, data: any) {   
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', event, data);
    }
  }

  public getSession(): UserSession {
    return { ...this.session };
  }
}

class AlertManager {
  private alertThresholds = {
    errorRate: 0.05, 
    performanceThresholds: {
      lcp: 2500, 
      fid: 100, 
      cls: 0.1, 
    },
  };

  public checkErrorRate(errorCount: number, totalRequests: number): boolean {
    const errorRate = errorCount / totalRequests;
    return errorRate > this.alertThresholds.errorRate;
  }

  public checkPerformanceMetrics(metrics: PerformanceMetrics): string[] {
    const alerts: string[] = [];

    if (metrics.lcp > this.alertThresholds.performanceThresholds.lcp) {
      alerts.push(`LCP (${metrics.lcp}ms) exceeds threshold (${this.alertThresholds.performanceThresholds.lcp}ms)`);
    }

    if (metrics.fid > this.alertThresholds.performanceThresholds.fid) {
      alerts.push(`FID (${metrics.fid}ms) exceeds threshold (${this.alertThresholds.performanceThresholds.fid}ms)`);
    }

    if (metrics.cls > this.alertThresholds.performanceThresholds.cls) {
      alerts.push(`CLS (${metrics.cls}) exceeds threshold (${this.alertThresholds.performanceThresholds.cls})`);
    }

    return alerts;
  }

  public sendAlert(message: string, severity: 'low' | 'medium' | 'high' | 'critical') {
    console.warn(`[${severity.toUpperCase()}] ${message}`);
  }
}

export const performanceMonitor = new PerformanceMonitor();
export const errorLogger = new ErrorLogger();
export const sessionTracker = new SessionTracker();
export const alertManager = new AlertManager();

export const captureError = (error: Error, metadata?: Record<string, any>) => {
  errorLogger.captureError({
    message: error.message,
    stack: error.stack || undefined,
    url: typeof window !== 'undefined' ? window.location.href : '',
    userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : '',
    timestamp: Date.now(),
    level: 'error',
    category: 'client',
    metadata: metadata || undefined,
  });
};

export const captureWarning = (message: string, metadata?: Record<string, any>) => {
  errorLogger.captureWarning(message, metadata);
};

export const captureInfo = (message: string, metadata?: Record<string, any>) => {
  errorLogger.captureInfo(message, metadata);
};

export const measurePerformance = (name: string, value: number) => {
  performanceMonitor.measureCustomMetric(name, value);
};

export const getSessionInfo = () => sessionTracker.getSession(); 