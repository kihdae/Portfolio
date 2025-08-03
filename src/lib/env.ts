/**
 * Environment Variables Configuration
 *
 * This file provides type-safe access to environment variables
 * with proper validation and security checks.
 */

// =============================================================================
// CLIENT-SIDE VARIABLES (NEXT_PUBLIC_ prefix)
// =============================================================================
// These variables are exposed to the browser and should be safe for public viewing

export const clientEnv = {
  // Analytics and Monitoring
  GOOGLE_ANALYTICS_ID: process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID,
  VERCEL_ANALYTICS_ID: process.env.NEXT_PUBLIC_VERCEL_ANALYTICS_ID,

  // External API Endpoints (public only)
  API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL,
  SPOTIFY_CLIENT_ID: process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID,

  // Feature Flags
  ENABLE_ANALYTICS: process.env.NEXT_PUBLIC_ENABLE_ANALYTICS === 'true',
  ENABLE_SPOTIFY_INTEGRATION:
    process.env.NEXT_PUBLIC_ENABLE_SPOTIFY_INTEGRATION === 'true',
  ENABLE_WEATHER_WIDGET:
    process.env.NEXT_PUBLIC_ENABLE_WEATHER_WIDGET === 'true',

  // UI/UX Configuration
  SITE_NAME: process.env.NEXT_PUBLIC_SITE_NAME || 'Portfolio',
  SITE_DESCRIPTION:
    process.env.NEXT_PUBLIC_SITE_DESCRIPTION ||
    'Full-stack developer portfolio',
  SITE_URL: process.env.NEXT_PUBLIC_SITE_URL || 'https://yourdomain.com',

  // CDN and Asset Optimization
  CDN_URL: process.env.NEXT_PUBLIC_CDN_URL,
  ASSET_PREFIX: process.env.NEXT_PUBLIC_ASSET_PREFIX,
} as const;

// =============================================================================
// SERVER-SIDE VARIABLES (NO NEXT_PUBLIC_ prefix)
// =============================================================================
// These variables are only available on the server and should NEVER be exposed

export const serverEnv = {
  // API Keys and Secrets
  SPOTIFY_CLIENT_SECRET: process.env.SPOTIFY_CLIENT_SECRET,
  SPOTIFY_REFRESH_TOKEN: process.env.SPOTIFY_REFRESH_TOKEN,
  GITHUB_TOKEN: process.env.GITHUB_TOKEN,
  WEATHER_API_KEY: process.env.WEATHER_API_KEY,

  // Database Configuration (if applicable)
  DATABASE_URL: process.env.DATABASE_URL,

  // Email Configuration (if contact form)
  SMTP_HOST: process.env.SMTP_HOST,
  SMTP_PORT: process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT) : 587,
  SMTP_USER: process.env.SMTP_USER,
  SMTP_PASS: process.env.SMTP_PASS,

  // Security
  JWT_SECRET: process.env.JWT_SECRET,
  ENCRYPTION_KEY: process.env.ENCRYPTION_KEY,

  // External Services
  VERCEL_TOKEN: process.env.VERCEL_TOKEN,
  NETLIFY_TOKEN: process.env.NETLIFY_TOKEN,

  // AWS S3 (if using for file uploads)
  AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID,
  AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,
  AWS_REGION: process.env.AWS_REGION || 'us-east-1',
  AWS_S3_BUCKET: process.env.AWS_S3_BUCKET,

  // Stripe (if accepting payments)
  STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
  STRIPE_PUBLISHABLE_KEY: process.env.STRIPE_PUBLISHABLE_KEY,
  STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET,

  // Redis Configuration (if using caching)
  REDIS_URL: process.env.REDIS_URL,
} as const;

// =============================================================================
// VALIDATION FUNCTIONS
// =============================================================================

/**
 * Validates required client-side environment variables
 */
export function validateClientEnv(): void {
  const required = ['SITE_NAME', 'SITE_URL'] as const;

  const missing = required.filter(key => !clientEnv[key]);

  if (missing.length > 0) {
    throw new Error(
      `Missing required client environment variables: ${missing.join(', ')}`
    );
  }
}

/**
 * Validates required server-side environment variables
 * Only call this in API routes or server-side code
 */
export function validateServerEnv(): void {
  const required = [
    // Add your required server variables here
    // 'SPOTIFY_CLIENT_SECRET',
    // 'JWT_SECRET',
  ] as const;

  const missing = required.filter(key => !serverEnv[key]);

  if (missing.length > 0) {
    throw new Error(
      `Missing required server environment variables: ${missing.join(', ')}`
    );
  }
}

/**
 * Validates environment variables for production
 */
export function validateProductionEnv(): void {
  validateClientEnv();

  // Additional production-specific validations
  if (process.env.NODE_ENV === 'production') {
    if (
      !clientEnv.SITE_URL ||
      clientEnv.SITE_URL === 'https://yourdomain.com'
    ) {
      throw new Error(
        'SITE_URL must be set to your actual domain in production'
      );
    }
  }
}

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

/**
 * Checks if a feature is enabled
 */
export function isFeatureEnabled(
  feature: keyof Pick<
    typeof clientEnv,
    'ENABLE_ANALYTICS' | 'ENABLE_SPOTIFY_INTEGRATION' | 'ENABLE_WEATHER_WIDGET'
  >
): boolean {
  return clientEnv[feature] === true;
}

/**
 * Gets the current environment
 */
export function getEnvironment(): 'development' | 'production' | 'test' {
  return (process.env.NODE_ENV as any) || 'development';
}

/**
 * Checks if running in development
 */
export function isDevelopment(): boolean {
  return getEnvironment() === 'development';
}

/**
 * Checks if running in production
 */
export function isProduction(): boolean {
  return getEnvironment() === 'production';
}

/**
 * Safely logs environment configuration (without exposing secrets)
 */
export function logEnvironmentConfig(): void {
  console.log('🌍 Environment Configuration:');
  console.log(`  Environment: ${getEnvironment()}`);
  console.log(`  Site Name: ${clientEnv.SITE_NAME}`);
  console.log(`  Site URL: ${clientEnv.SITE_URL}`);
  console.log(
    `  Analytics: ${isFeatureEnabled('ENABLE_ANALYTICS') ? '✅ Enabled' : '❌ Disabled'}`
  );
  console.log(
    `  Spotify Integration: ${isFeatureEnabled('ENABLE_SPOTIFY_INTEGRATION') ? '✅ Enabled' : '❌ Disabled'}`
  );
  console.log(
    `  Weather Widget: ${isFeatureEnabled('ENABLE_WEATHER_WIDGET') ? '✅ Enabled' : '❌ Disabled'}`
  );

  // Safe server-side logging (only in development)
  if (isDevelopment()) {
    console.log('🔧 Server Configuration:');
    console.log(
      `  Spotify Secret: ${serverEnv.SPOTIFY_CLIENT_SECRET ? '✅ Configured' : '❌ Missing'}`
    );
    console.log(
      `  GitHub Token: ${serverEnv.GITHUB_TOKEN ? '✅ Configured' : '❌ Missing'}`
    );
    console.log(
      `  JWT Secret: ${serverEnv.JWT_SECRET ? '✅ Configured' : '❌ Missing'}`
    );
  }
}

// =============================================================================
// TYPE EXPORTS
// =============================================================================

export type ClientEnv = typeof clientEnv;
export type ServerEnv = typeof serverEnv;
