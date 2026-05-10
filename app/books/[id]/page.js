'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/utils/supabase';
import { useAuth } from '@/context/AuthContext';
import { useParams } from 'next/navigation';

export default function BookDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const [book, setBook] = useState(null);

  useEffect(() => {
    async function fetchBook() {
      const { data } = await supabase
        .from('books')
        .select('*')
        .eq('id', id)
        .single();
      setBook(data);
    }
    fetchBook();
  }, [id]);

  async function borrowBook() {
    if (!user) return alert('Please login first');

    const { error } = await supabase.from('borrows').insert([
      { user_id: user.id, book_id: id, returned: false }
    ]);

    if (!error) {
      await supabase.from('books').update({ status: 'not available' }).eq('id', id);
      alert('Book borrowed successfully!');
      window.location.reload();
    }
  }

  if (!book) return <div className="p-10 text-center">Loading...</div>;

  return (
    <div className="max-w-2xl mx-auto p-6 mt-10 border rounded-xl">
      <h1 className="text-3xl font-bold mb-2">{book.title}</h1>
      <p className="text-gray-600 mb-1">Author: {book.author}</p>
      <p className="text-gray-600 mb-4">Category: {book.category}</p>

      {/* DYNAMIC STATUS BADGE */}
      <div className="mb-6">
        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
          book.status === 'available' 
            ? 'bg-green-100 text-green-800' 
            : 'bg-red-100 text-red-800'
        }`}>
          {book.status}
        </span>
      </div>

      {/* DYNAMIC BORROW BUTTON */}
      {book.status === 'available' ? (
        <button
          onClick={borrowBook}
          className="bg-blue-600 text-white px-5 py-2 rounded-lg w-full"
        >
          Borrow This Book
        </button>
      ) : (
        <button disabled className="bg-gray-400 text-white px-5 py-2 rounded-lg w-full">
          Not Available
        </button>
      )}
    </div>
  );
}