import { NextRequest, NextResponse } from 'next/server';
import type { ErrorEvent } from '@/lib/monitoring';

export async function POST(request: NextRequest) {
  try {
    const error: ErrorEvent & { sessionId: string; errorCount: number } = await request.json();
    
    if (!error.message || !error.timestamp) {
      return NextResponse.json(
        { error: 'Invalid error data' },
        { status: 400 }
      );
    }

    if (process.env.NODE_ENV === 'development') {
      console.error('Server Error Log:', {
        message: error.message,
        stack: error.stack,
        url: error.url,
        userAgent: error.userAgent,
        timestamp: new Date(error.timestamp).toISOString(),
        level: error.level,
        category: error.category,
        sessionId: error.sessionId,
        errorCount: error.errorCount,
        metadata: error.metadata,
      });
    }

    await sendToErrorService(error);

    await sendToAnalytics('error', {
      message: error.message,
      level: error.level,
      category: error.category,
      sessionId: error.sessionId,
      url: error.url,
      timestamp: error.timestamp,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Error in error logging endpoint:', err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

async function sendToErrorService(error: ErrorEvent & { sessionId: string; errorCount: number }) {
    
  if (process.env.SENTRY_DSN) {
    try {
      const Sentry = await import('@sentry/nextjs');
      Sentry.captureException(new Error(error.message), {
        extra: {
          ...error,
          serverSide: true,
        },
        tags: {
          category: error.category,
          level: error.level,
          sessionId: error.sessionId,
        },
      });
    } catch (err) {
      console.warn('Sentry not available:', err);
    }
  }

  if (process.env.LOGROCKET_APP_ID) {
    try {
      console.log('LogRocket error logging:', error);
    } catch (err) {
      console.warn('LogRocket not available:', err);
    }
  }

  if (process.env.ERROR_STORAGE_ENDPOINT) {
    try {
      await fetch(process.env.ERROR_STORAGE_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(error),
      });
    } catch (err) {
      console.warn('Custom error storage failed:', err);
    }
  }
}

async function sendToAnalytics(event: string, data: any) {
  if (process.env.GA_MEASUREMENT_ID) {
    try {
      console.log('Analytics event:', event, data);
    } catch (err) {
      console.warn('Analytics not available:', err);
    }
  }

  if (process.env.VERCEL_ANALYTICS_ID) {
    try {
      console.log('Vercel Analytics event:', event, data);
    } catch (err) {
      console.warn('Vercel Analytics not available:', err);
    }
  }
} 