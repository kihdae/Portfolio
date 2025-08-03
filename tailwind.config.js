/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
    // More specific patterns to avoid scanning node_modules
    './src/app/**/*.{js,ts,jsx,tsx}',
    './src/components/**/*.{js,ts,jsx,tsx}',
    './src/lib/**/*.{js,ts,jsx,tsx}',
    './src/hooks/**/*.{js,ts,jsx,tsx}',
    './src/contexts/**/*.{js,ts,jsx,tsx}',
    './src/types/**/*.{js,ts,jsx,tsx}',
  ],
  safelist: [
    'bg-background',
    'bg-surface',
    'text-text-primary',
    'text-text-secondary',
    'border-border',
    'animate-text-glow',
    'animate-subtle-shake',
    'animate-glitch-1',
    'animate-glitch-2',
    'animate-glitch-3',
    'sm:block',
    'md:block',
    'lg:block',
    'xl:block',
    '2xl:block',
  ],
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      fontFamily: {
        sans: ['var(--font-inter)', 'sans-serif'],
        serif: ['var(--font-lora)', 'serif'],
      },
      colors: {
        background: 'var(--color-background-primary)',
        surface: 'var(--color-surface-primary)',
        accent: 'var(--color-accent-primary)',
        highlight: 'var(--color-accent-secondary)',
        'text-primary': 'var(--color-text-primary)',
        'text-secondary': 'var(--color-text-secondary)',
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
        'text-glow': {
          '0%': { textShadow: '0 0 4px var(--color-accent-primary)' },
          '50%': { textShadow: '0 0 8px var(--color-accent-primary)' },
          '100%': { textShadow: '0 0 4px var(--color-accent-primary)' },
        },
        'subtle-shake': {
          '0%': { transform: 'translate(0, 0)' },
          '25%': { transform: 'translate(0.5px, 0.5px)' },
          '50%': { transform: 'translate(-0.5px, -0.5px)' },
          '75%': { transform: 'translate(-0.5px, 0.5px)' },
          '100%': { transform: 'translate(0, 0)' },
        },
        'glitch-1': {
          '0%': {
            clipPath: 'inset(40% 0 61% 0)',
            transform: 'translate(-2px, 2px)',
          },
          '20%': {
            clipPath: 'inset(92% 0 1% 0)',
            transform: 'translate(1px, -3px)',
          },
          '40%': {
            clipPath: 'inset(43% 0 1% 0)',
            transform: 'translate(-1px, 3px)',
          },
          '60%': {
            clipPath: 'inset(25% 0 58% 0)',
            transform: 'translate(3px, -2px)',
          },
          '80%': {
            clipPath: 'inset(54% 0 7% 0)',
            transform: 'translate(-3px, 4px)',
          },
          '100%': {
            clipPath: 'inset(58% 0 43% 0)',
            transform: 'translate(2px, -4px)',
          },
        },
        'glitch-2': {
          '0%': {
            clipPath: 'inset(15% 0 49% 0)',
            transform: 'translate(2px, -2px)',
          },
          '20%': {
            clipPath: 'inset(32% 0 2% 0)',
            transform: 'translate(-3px, 1px)',
          },
          '40%': {
            clipPath: 'inset(43% 0 44% 0)',
            transform: 'translate(1px, -3px)',
          },
          '60%': {
            clipPath: 'inset(7% 0 59% 0)',
            transform: 'translate(-2px, 3px)',
          },
          '80%': {
            clipPath: 'inset(61% 0 4% 0)',
            transform: 'translate(3px, -2px)',
          },
          '100%': {
            clipPath: 'inset(83% 0 40% 0)',
            transform: 'translate(-4px, 2px)',
          },
        },
        'glitch-3': {
          '0%': {
            clipPath: 'inset(92% 0 6% 0)',
            transform: 'translate(2px, -2px)',
          },
          '20%': {
            clipPath: 'inset(8% 0 62% 0)',
            transform: 'translate(-1px, 3px)',
          },
          '40%': {
            clipPath: 'inset(68% 0 27% 0)',
            transform: 'translate(-3px, 1px)',
          },
          '60%': {
            clipPath: 'inset(13% 0 75% 0)',
            transform: 'translate(3px, -4px)',
          },
          '80%': {
            clipPath: 'inset(9% 0 57% 0)',
            transform: 'translate(-2px, 4px)',
          },
          '100%': {
            clipPath: 'inset(25% 0 35% 0)',
            transform: 'translate(4px, -2px)',
          },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'text-glow': 'text-glow 2s ease-in-out infinite',
        'subtle-shake': 'subtle-shake 0.2s ease-in-out infinite',
        'glitch-1': 'glitch-1 2s linear infinite',
        'glitch-2': 'glitch-2 2s linear infinite',
        'glitch-3': 'glitch-3 2s linear infinite',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};
