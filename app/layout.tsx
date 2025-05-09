import { EnvVarWarning } from '@/components/env-var-warning';
import HeaderAuth from '@/components/header-auth';
import { hasEnvVars } from '@/utils/supabase/check-env-vars';
import { Toaster } from 'react-hot-toast';
import { ThemeProvider } from 'next-themes';
import { SplashScreen } from './SplashScreen';
import './globals.css';

import { Inter } from 'next/font/google';
import Link from 'next/link';

const interFont = Inter({
  subsets: ['latin'],
  display: 'swap'
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
      className={`${interFont.className}`}
      suppressHydrationWarning
    >
      <head>
        <meta name='viewport' content='width=device-width, initial-scale=1' />
      </head>
      <body className='bg-background text-foreground'>
        <ThemeProvider
          attribute='class'
          defaultTheme='system'
          enableSystem
          disableTransitionOnChange
        >
          {isUnderConstruction ? (
            <SplashScreen />
          ) : (
            <main className='min-h-screen flex flex-col items-center'>
              <div className='flex-1 w-full flex flex-col items-center'>
                <nav className='w-full flex justify-center border-b border-b-foreground/10 h-16'>
                  <div className='w-full max-w-6xl flex justify-between items-center p-3 px-7 text-sm'>
                    <span className='text-[#121417] text-lg font-bold leading-[23px]'>
                      LinksDeck
                    </span>
                    {!hasEnvVars ? <EnvVarWarning /> : <HeaderAuth />}
                  </div>
                </nav>
                <div className='flex self-stretch flex-1 justify-center items-start flex-row py-5 px-4'>
                  {children}
                  <Toaster position='top-right' reverseOrder={false} />
                </div>
              </div>
              {/* Footer */}
              <footer className='w-full border-t border-t-foreground/10 py-4 text-center text-xs sm:text-sm text-gray-500'>
                <div className='max-w-6xl mx-auto px-4'>
                  <p>
                    &copy; {new Date().getFullYear()} LinksDeck. All rights
                    reserved.{' '}
                    <Link
                      href='/contact'
                      className='text-black hover:underline'
                    >
                      Contact
                    </Link>
                  </p>
                </div>
              </footer>
            </main>
          )}
        </ThemeProvider>
      </body>
    </html>
  );
}
