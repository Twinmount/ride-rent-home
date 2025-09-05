import './globals.scss';
import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css file
import { ReactQueryProvider } from '@/app/ReactQueryProvider';
import type { Metadata } from 'next';
import { Fira_Sans, Poppins } from 'next/font/google';
import TrackingScripts from './TrackingScripts';
import BodyScripts from './BodyScripts';
import { getDefaultMetadata } from './root-metadata';
import { NetworkWrapper } from './(root)/NetworkWrapper';
import { GlobalContextProvider } from '@/context/GlobalContext';
import NextTopLoader from 'nextjs-toploader';
import CookiePopup from '@/components/dialog/CookiePopup';

export const metadata: Metadata = getDefaultMetadata();

const firaSans = Fira_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800', '900'],
  style: ['normal', 'italic'],
  variable: '--font-fira-sans',
});

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  variable: '--font-poppins',
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${poppins.variable} ${firaSans.variable} `}>
      <head className="notranslate">
        {/* tracking scripts */}
        <TrackingScripts />
      </head>
      <body className={poppins.className}>
        {/* top page loading progress bar indicator */}
        <NextTopLoader
          color="#ffa733"
          initialPosition={0.08}
          crawlSpeed={200}
          height={5}
          crawl={true}
          showSpinner={false}
          easing="ease"
          speed={200}
          zIndex={1600}
        />

        {/* body scripts */}
        <BodyScripts />
        {/* react query provider */}
        <NetworkWrapper>
          {/* global context provider */}
          <ReactQueryProvider>
            <GlobalContextProvider>{children}</GlobalContextProvider>
          </ReactQueryProvider>
        </NetworkWrapper>
        <CookiePopup />
      </body>
    </html>
  );
}
