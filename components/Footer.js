import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="relative mt-20">

      {/* TOP GRADIENT LINE */}
      <div className="h-px w-full bg-gradient-to-r from-transparent via-red-500/40 to-transparent" />

      <div className="bg-black/95 text-white backdrop-blur-xl">

        <div className="max-w-7xl mx-auto px-6 py-16">

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">

            {/* BRAND */}
            <div className="space-y-3">

              <h3 className="text-xl font-semibold tracking-wide">
                📚 LibraryHub
              </h3>

              <p className="text-sm text-gray-400 leading-relaxed">
                A modern digital library experience built for exploration, learning, and discovery.
              </p>

            </div>

            {/* LINKS */}
            <div>

              <h4 className="text-xs uppercase tracking-[0.25em] text-gray-500 mb-4">
                Navigation
              </h4>

              <ul className="space-y-3 text-gray-400">

                <li>
                  <Link className="hover:text-white transition" href="/">
                    Home
                  </Link>
                </li>

                <li>
                  <Link className="hover:text-white transition" href="/books">
                    Books
                  </Link>
                </li>

                <li>
                  <Link className="hover:text-white transition" href="/login">
                    Login
                  </Link>
                </li>

              </ul>

            </div>

            {/* CONTACT */}
            <div>

              <h4 className="text-xs uppercase tracking-[0.25em] text-gray-500 mb-4">
                Contact
              </h4>

              <p className="text-gray-400 text-sm">
                support@libraryhub.com
              </p>

              <p className="text-gray-500 text-xs mt-2">
                24/7 system support available
              </p>

            </div>

          </div>

          {/* BOTTOM */}
          <div className="mt-14 pt-6 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">

            <p className="text-xs text-gray-500">
              © 2024 LibraryHub. All rights reserved.
            </p>

            <p className="text-xs text-gray-600 tracking-wide">
              Crafted for premium reading experience
            </p>

          </div>

        </div>

      </div>

    </footer>
  );
}