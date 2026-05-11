'use client';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const { user, logout, loading } = useAuth();
  const pathname = usePathname();

  // Hide navbar completely on admin routes
  if (pathname.startsWith('/admin')) return null;

  if (loading) {
    return (
      <nav className="bg-white shadow p-4 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link href="/" className="text-xl font-bold text-blue-600">📚 Library</Link>
        </div>
      </nav>
    );
  }

  return (
    <nav className="bg-white shadow p-4 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link href="/" className="text-xl font-bold text-blue-600">📚 Library</Link>
        <div className="flex gap-5 items-center">
          <Link href="/" className="text-gray-700 hover:text-blue-600">Home</Link>
          <Link href="/books" className="text-gray-700 hover:text-blue-600">Books</Link>

          {!user ? (
            <>
              <Link href="/login" className="text-gray-700 hover:text-blue-600">Login</Link>
              <Link href="/register" className="bg-blue-600 text-white px-4 py-2 rounded">Register</Link>
            </>
          ) : (
            <>
              <Link href="/profile" className="text-gray-700 hover:text-blue-600">Profile</Link>
              {user.user_metadata?.role === 'admin' && (
                <Link href="/admin" className="text-gray-700 hover:text-blue-600">Admin</Link>
              )}
              <button onClick={logout} className="text-red-600 hover:text-red-700">Logout</button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}