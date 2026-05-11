'use client';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { usePathname } from 'next/navigation';

export default function ClientLayout({ children }) {
  const pathname = usePathname();
  const isAdminPage = pathname.startsWith('/admin');

  return (
    <>
      {!isAdminPage && <Navbar />}
      <main className="flex-1">{children}</main>
      {!isAdminPage && <Footer />}
    </>
  );
}