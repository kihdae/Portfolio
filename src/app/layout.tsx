import Providers from '@/components/window-content/Providers';
import { Inter, Lora } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
  preload: true,
  fallback: ['system-ui', 'arial'],
});

const lora = Lora({
  subsets: ['latin'],
  variable: '--font-lora',
  display: 'swap',
  preload: true,
  fallback: ['Georgia', 'serif'],
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='en' suppressHydrationWarning>
      <head>
        <link rel='preload' as='image' href='/assets/animated_cat_city.gif' />
        <link rel='preload' as='image' href='/assets/paper.gif' />

        <link
          rel='preload'
          as='image'
          href='/assets/restart.gif'
          fetchPriority='low'
        />
        <link
          rel='preload'
          as='image'
          href='/assets/lain.gif'
          fetchPriority='low'
        />
        <link
          rel='preload'
          as='image'
          href='/assets/evangelion.jpg'
          fetchPriority='low'
        />
        <link
          rel='preload'
          as='image'
          href='/assets/evang.jpg'
          fetchPriority='low'
        />
        <link
          rel='preload'
          as='image'
          href='/assets/asylum.jpg'
          fetchPriority='low'
        />
        <link
          rel='preload'
          as='image'
          href='/assets/hxh.gif'
          fetchPriority='low'
        />
        <link
          rel='preload'
          as='image'
          href='/assets/CodeNation-optimized.gif'
          fetchPriority='low'
        />
        <link
          rel='preload'
          as='image'
          href='/assets/raven.gif'
          fetchPriority='low'
        />
        <link
          rel='preload'
          as='image'
          href='/assets/animated-clouds.gif'
          fetchPriority='low'
        />
        <link
          rel='preload'
          as='image'
          href='/assets/earth.gif'
          fetchPriority='low'
        />
      </head>
      <body
        className={`${lora.variable} ${inter.variable} font-sans antialiased`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
