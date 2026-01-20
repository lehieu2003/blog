import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Header from '@/components/Header';
import Providers from '@/components/Providers';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'My Blog CMS',
  description: 'Personal blog content management system',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='en'>
      <body className={inter.className}>
        <Providers>
          <Header />
          <main className='min-h-screen'>{children}</main>
          <footer className='border-t py-6 mt-12'>
            <div className='container mx-auto px-4 text-center text-muted-foreground'>
              © 2026 My Blog. All rights reserved.
            </div>
          </footer>
        </Providers>
      </body>
    </html>
  );
}
