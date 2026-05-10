import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const metadata = {
  title: 'Library Management System',
  description: 'Digital Library',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col">
        
        {/* 👉 AuthProvider MUST COME FIRST */}
        <AuthProvider>

          {/* 👉 Then Navbar (now useAuth() works) */}
          <Navbar />

          <main className="flex-1">
            {children}
          </main>

          <Footer />

        </AuthProvider>

      </body>
    </html>
  );
}