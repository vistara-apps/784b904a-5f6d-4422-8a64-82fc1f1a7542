import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';
import { ThemeProvider } from './components/ThemeProvider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'RemixPlay - Remix Audio, Share Vibes, Play with Sound',
  description: 'An interactive audio remixing platform for creators and music enthusiasts to upload, remix, and share audio creations within a social community.',
  keywords: ['audio', 'remix', 'music', 'social', 'base', 'miniapp', 'farcaster'],
  authors: [{ name: 'RemixPlay Team' }],
  openGraph: {
    title: 'RemixPlay - Remix Audio, Share Vibes, Play with Sound',
    description: 'Create, remix, and share audio with the community',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'RemixPlay - Remix Audio, Share Vibes, Play with Sound',
    description: 'Create, remix, and share audio with the community',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider>
          <Providers>
            {children}
          </Providers>
        </ThemeProvider>
      </body>
    </html>
  );
}
