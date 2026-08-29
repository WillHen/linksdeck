import { EnvVarWarning } from '@/components/env-var-warning';
import HeaderAuth from '@/components/header-auth';
import { hasEnvVars } from '@/utils/supabase/check-env-vars';
import { Toaster } from 'react-hot-toast';
import { ThemeProvider } from 'next-themes';
import { SplashScreen } from './SplashScreen';
import './globals.css';

import { Familjen_Grotesk, JetBrains_Mono } from 'next/font/google';
import Link from 'next/link';

const displayFont = Familjen_Grotesk({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-display'
});

const monoFont = JetBrains_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-mono'
});

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : 'http://localhost:3000';

const isUnderConstruction =
  process.env.NEXT_PUBLIC_UNDER_CONSTRUCTION === 'true';

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: 'LinksDeck',
  description: 'Share your favorite links all in one place'
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang='en'
      className={`${displayFont.variable} ${monoFont.variable}`}
      suppressHydrationWarning
    >
      <head>
        <meta name='viewport' content='width=device-width, initial-scale=1' />
      </head>
      <body>
        <ThemeProvider
          attribute='class'
          defaultTheme='light'
          disableTransitionOnChange
        >
          {isUnderConstruction ? (
            <SplashScreen />
          ) : (
            <main className='min-h-screen flex flex-col'>
              <nav className='w-full flex justify-center items-center h-[72px] px-6 sm:px-10 border-b-2 border-[var(--ld-ink)]'>
                <div className='w-full max-w-6xl flex justify-between items-center'>
                  <Link href='/' className='flex items-center gap-2.5'>
                    <span className='w-[22px] h-[22px] rounded-[7px] bg-[var(--ld-accent)] border-2 border-[var(--ld-ink)]' />
                    <span className='text-[21px] font-bold tracking-[-0.02em] text-[var(--ld-ink)]'>
                      LinksDeck
                    </span>
                  </Link>
                  {!hasEnvVars ? <EnvVarWarning /> : <HeaderAuth />}
                </div>
              </nav>

              <div className='flex-1 w-full flex justify-center px-6 sm:px-10 py-10 sm:py-12'>
                <div className='w-full max-w-6xl'>{children}</div>
                <Toaster position='top-right' reverseOrder={false} />
              </div>

              <footer className='w-full border-t-2 border-[var(--ld-ink)] py-5 px-6 sm:px-10 flex justify-center'>
                <div className='w-full max-w-6xl flex flex-col sm:flex-row gap-2 justify-between items-center ld-mono text-[13px] sm:text-sm text-[var(--ld-muted)]'>
                  <span>
                    &copy; {new Date().getFullYear()} LinksDeck. All rights
                    reserved.
                  </span>
                  <Link
                    href='/contact'
                    className='text-[var(--ld-ink)] border-b-2 border-[var(--ld-accent)] pb-0.5'
                  >
                    Contact
                  </Link>
                </div>
              </footer>
            </main>
          )}
        </ThemeProvider>
      </body>
    </html>
  );
}
