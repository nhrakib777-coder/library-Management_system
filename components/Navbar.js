'use client';

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const { user, logout } = useAuth();
  const pathname = usePathname();

  if (pathname.startsWith('/admin')) return null;

  const role = user?.user_metadata?.role;

  return (
    <header className="fixed top-0 w-full z-50 enter">

      <div className="mx-auto max-w-7xl px-6 pt-4">

        <div className="
          flex items-center justify-between
          bg-white/70 backdrop-blur-2xl
          border border-white/40
          rounded-2xl px-6 py-3
          shadow-sm
        ">

          {/* BRAND */}
          <Link href="/" className="font-semibold text-lg tracking-tight">
            📚 Library
          </Link>

          {/* NAV */}
          <nav className="flex items-center gap-10 text-sm">

            <Nav href="/" label="Home" />
            <Nav href="/books" label="Books" />

            {!user ? (
              <>
                <Nav href="/login" label="Login" />

                <Link
                  href="/register"
                  className="px-5 py-2 rounded-full bg-black text-white hover:scale-105 transition"
                >
                  Join
                </Link>
              </>
            ) : role === "admin" ? (
              <>
                <Link
                  href="/admin"
                  className="px-5 py-2 rounded-full bg-black text-white hover:scale-105 transition"
                >
                  Admin Panel
                </Link>

                <button
                  onClick={logout}
                  className="text-red-500 hover:text-red-700"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Nav href="/profile" label="Profile" />

                <button
                  onClick={logout}
                  className="text-red-500 hover:text-red-700"
                >
                  Logout
                </button>
              </>
            )}

          </nav>

        </div>
      </div>
    </header>
  );
}

function Nav({ href, label }) {
  const pathname = usePathname();

  const isActive = pathname === href;

  return (
    <Link
      href={href}
      className={`
        relative transition group
        ${isActive
          ? 'text-black font-semibold'
          : 'text-gray-600 hover:text-black'
        }
      `}
    >
      {label}

      <span
        className={`
          absolute left-0 -bottom-1 h-0.5 bg-black transition-all duration-300
          ${isActive
            ? 'w-full'
            : 'w-0 group-hover:w-full'
          }
        `}
      />
    </Link>
  );
}