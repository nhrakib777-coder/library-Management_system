'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/utils/supabase';
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
  const { user } = useAuth();
  const router = useRouter();
  const [myBooks, setMyBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }

    async function fetchMyBooks() {
      setLoading(true);

      const { data } = await supabase
        .from('borrows')
        .select('*, books(*)')
        .eq('user_id', user.id)
        .eq('returned', false);

      setMyBooks(data || []);
      setLoading(false);
    }

    fetchMyBooks();
  }, [user, router]);

  const handleReturn = async (borrowId, bookId) => {
    await supabase
      .from('borrows')
      .update({ returned: true })
      .eq('id', borrowId);

    await supabase
      .from('books')
      .update({ status: 'available' })
      .eq('id', bookId);

    setMyBooks(prev => prev.filter(item => item.id !== borrowId));
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-elite px-6 py-24">

      <div className="max-w-5xl mx-auto space-y-10 enter">

        {/* HEADER */}
        <div>
          <h1 className="text-4xl font-semibold tracking-tight">
            My Library
          </h1>

          <p className="text-gray-500 mt-2">
            Your reading space and borrowed collection
          </p>
        </div>

        {/* PROFILE CARD */}
        <div className="
          rounded-3xl p-6
          bg-white/60 backdrop-blur-xl
          border border-white/40
          shadow-sm
          enter
        ">

          <p className="text-sm text-gray-500">Account</p>

          <div className="mt-2 space-y-1">
            <p className="text-lg font-medium">{user.email}</p>
            <p className="text-xs text-gray-500">
              ID: {user.id.slice(0, 12)}...
            </p>
          </div>

        </div>

        {/* BOOKS SECTION */}
        <div className="space-y-6 enter">

          <h2 className="text-sm uppercase tracking-[0.3em] text-gray-500">
            Borrowed Books
          </h2>

          {loading ? (
            <div className="text-gray-500 animate-pulse">
              Loading your library...
            </div>
          ) : myBooks.length === 0 ? (
            <div className="
              p-10 text-center
              bg-white/40 backdrop-blur-xl
              border border-white/30
              rounded-3xl text-gray-500
            ">
              You haven’t borrowed any books yet.
            </div>
          ) : (
            <div className="space-y-4">

              {myBooks.map(item => (
                <div
                  key={item.id}
                  className="
                    flex items-center justify-between
                    p-5 rounded-2xl
                    bg-white/60 backdrop-blur-xl
                    border border-white/40
                    hover:shadow-md transition lift
                  "
                >

                  {/* LEFT */}
                  <div className="flex items-center gap-4">

                    <img
                      src={item.books?.image || "https://via.placeholder.com/80"}
                      className="w-14 h-20 object-cover rounded-lg"
                    />

                    <div>
                      <h3 className="font-medium">
                        {item.books?.title}
                      </h3>

                      <p className="text-sm text-gray-500">
                        {item.books?.author}
                      </p>
                    </div>

                  </div>

                  {/* ACTION */}
                  <button
                    onClick={() => handleReturn(item.id, item.book_id)}
                    className="
                      px-5 py-2 rounded-full
                      bg-red-500 text-white
                      hover:scale-105 transition
                    "
                  >
                    Return
                  </button>

                </div>
              ))}

            </div>
          )}

        </div>

      </div>
    </div>
  );
}