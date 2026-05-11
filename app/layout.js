import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import ClientLayout from './ClientLayout';
import { Toaster } from 'react-hot-toast';

import { Inter, Playfair_Display } from 'next/font/google';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  weight: ['400', '500', '600', '700'],
});

export const metadata = {
  title: 'LibraryHub - Premium Library System',
  description: 'Luxury Digital Library Experience',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`
          ${inter.variable}
          ${playfair.variable}
          bg-elite
          text-gray-900
          relative
          overflow-x-hidden
          font-sans
        `}
      >

        <div className="noise"></div>

        <AuthProvider>
          <ClientLayout>
            <div className="relative z-10 min-h-screen">
              {children}
            </div>
          </ClientLayout>

          <Toaster position="top-right" />
        </AuthProvider>

      </body>
    </html>
  );
}