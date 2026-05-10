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

  // Load borrowed books
  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }

    async function fetchMyBooks() {
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

  // Return book function
  const handleReturn = async (borrowId, bookId) => {
    await supabase
      .from('borrows')
      .update({ returned: true })
      .eq('id', borrowId);

    await supabase
      .from('books')
      .update({ status: 'available' })
      .eq('id', bookId);

    // Refresh UI instantly
    setMyBooks(myBooks.filter((item) => item.id !== borrowId));
  };

  if (!user) return null;

  return (
    <div className="max-w-4xl mx-auto p-5">
      <h1 className="text-3xl font-bold mb-2">My Profile</h1>
      <p className="text-gray-600 mb-6">Manage your account and borrowed books</p>

      {/* Profile Info Section */}
      <div className="p-4 border rounded-lg mb-8 bg-gray-50">
        <h2 className="text-xl font-bold mb-2">Your Information</h2>
        <p className="text-gray-700"><strong>Email:</strong> {user.email}</p>
        <p className="text-gray-700"><strong>User ID:</strong> {user.id.slice(0, 10)}...</p>
      </div>

      {/* My Borrowed Books Section */}
      <div>
        <h2 className="text-xl font-bold mb-4">My Borrowed Books</h2>

        {loading ? (
          <p>Loading your books...</p>
        ) : myBooks.length === 0 ? (
          <p className="text-gray-500">You haven’t borrowed any books yet.</p>
        ) : (
          <div className="grid gap-4">
            {myBooks.map((item) => (
              <div key={item.id} className="border p-4 rounded-lg flex justify-between items-center">
                <div>
                  <h3 className="font-bold">{item.books?.title}</h3>
                  <p className="text-sm text-gray-500">Author: {item.books?.author}</p>
                </div>

                <button
                  onClick={() => handleReturn(item.id, item.book_id)}
                  className="bg-red-600 text-white px-4 py-2 rounded"
                >
                  Return Book
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}