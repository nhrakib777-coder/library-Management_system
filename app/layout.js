import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import ClientLayout from './ClientLayout';
import { Toaster } from 'react-hot-toast';

export const metadata = {
  title: 'Library Management System',
  description: 'Digital Library',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col">
        <AuthProvider>
          <ClientLayout>{children}</ClientLayout>
          <Toaster position="top-right" reverseOrder={false} />
        </AuthProvider>
      </body>
    </html>
  );
}