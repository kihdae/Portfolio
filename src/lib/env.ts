

export const clientEnv = {
  GOOGLE_ANALYTICS_ID: process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID,
  VERCEL_ANALYTICS_ID: process.env.NEXT_PUBLIC_VERCEL_ANALYTICS_ID,

  API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL,

  ENABLE_ANALYTICS: process.env.NEXT_PUBLIC_ENABLE_ANALYTICS === 'true',
  ENABLE_SPOTIFY_INTEGRATION:
    process.env.NEXT_PUBLIC_ENABLE_SPOTIFY_INTEGRATION === 'true',
  ENABLE_WEATHER_WIDGET:
    process.env.NEXT_PUBLIC_ENABLE_WEATHER_WIDGET === 'true',

  SITE_NAME: process.env.NEXT_PUBLIC_SITE_NAME || 'Portfolio',
  SITE_DESCRIPTION:
    process.env.NEXT_PUBLIC_SITE_DESCRIPTION ||
    'Full-stack developer portfolio',
  SITE_URL: process.env.NEXT_PUBLIC_SITE_URL || 'https://yourdomain.com',

  CDN_URL: process.env.NEXT_PUBLIC_CDN_URL,
  ASSET_PREFIX: process.env.NEXT_PUBLIC_ASSET_PREFIX,
} as const;


export const serverEnv = {

  GITHUB_TOKEN: process.env.GITHUB_TOKEN,
  WEATHER_API_KEY: process.env.WEATHER_API_KEY,


  SMTP_HOST: process.env.SMTP_HOST,
  SMTP_PORT: process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT) : 587,
  SMTP_USER: process.env.SMTP_USER,
  SMTP_PASS: process.env.SMTP_PASS,

  JWT_SECRET: process.env.JWT_SECRET,
  ENCRYPTION_KEY: process.env.ENCRYPTION_KEY,

  VERCEL_TOKEN: process.env.VERCEL_TOKEN,
} as const;


export function validateClientEnv(): void {
  const required = ['SITE_NAME', 'SITE_URL'] as const;

  const missing = required.filter(key => !clientEnv[key]);

  if (missing.length > 0) {
    throw new Error(
      `Missing required client environment variables: ${missing.join(', ')}`
    );
  }
}


export function validateServerEnv(): void {
  const required = [
    
  ] as const;

  const missing = required.filter(key => !serverEnv[key]);

  if (missing.length > 0) {
    throw new Error(
      `Missing required server environment variables: ${missing.join(', ')}`
    );
  }
}


export function validateProductionEnv(): void {
  validateClientEnv();

  
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


export function isFeatureEnabled(
  feature: keyof Pick<
    typeof clientEnv,
    'ENABLE_ANALYTICS' | 'ENABLE_SPOTIFY_INTEGRATION' | 'ENABLE_WEATHER_WIDGET'
  >
): boolean {
  return clientEnv[feature] === true;
}


export function getEnvironment(): 'development' | 'production' | 'test' {
  return (process.env.NODE_ENV as any) || 'development';
}


export function isDevelopment(): boolean {
  return getEnvironment() === 'development';
}


export function isProduction(): boolean {
  return getEnvironment() === 'production';
}


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

  
  if (isDevelopment()) {
    console.log('🔧 Server Configuration:');
    console.log(
      `  GitHub Token: ${serverEnv.GITHUB_TOKEN ? '✅ Configured' : '❌ Missing'}`
    );
    console.log(
      `  JWT Secret: ${serverEnv.JWT_SECRET ? '✅ Configured' : '❌ Missing'}`
    );
  }
}



export type ClientEnv = typeof clientEnv;
export type ServerEnv = typeof serverEnv;
