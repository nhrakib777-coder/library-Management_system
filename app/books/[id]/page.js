/* eslint-disable @next/next/no-img-element */
'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/utils/supabase';
import { useAuth } from '@/context/AuthContext';
import { useParams } from 'next/navigation';
import { Toaster, toast } from 'react-hot-toast';

export default function BookDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(false);

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
    if (!user) {
      toast.error('Please login first!');
      return;
    }

    setLoading(true);

    const { error } = await supabase.from('borrows').insert([
      { user_id: user.id, book_id: id, returned: false }
    ]);

    if (error) {
      toast.error('Failed to borrow book');
      setLoading(false);
      return;
    }

    await supabase.from('books').update({ status: 'not available' }).eq('id', id);
    toast.success('Book borrowed successfully!');
    setLoading(false);
    setTimeout(() => window.location.reload(), 1500);
  }

  if (!book) return <div className="p-10 text-center text-gray-500">Loading...</div>;

  return (
    <div className="min-h-screen bg-linear-to-b from-pink-50 via-white to-white px-4 py-10 flex items-center justify-center ">
      
      <div className="w-full max-w-2xl bg-white border border-gray-100 rounded-2xl shadow-lg p-8">
        
        <div className='flex gap-6 mb-6'>
         <div className="w-50 h-50 mb-6 rounded-lg overflow-hidden">
           {book.image ? (
            <img
              src={book.image}
              alt={book.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              No Cover Available
            </div>
          )}
         </div>
          <div className='flex-1'>
            <h1 className="text-3xl font-semibold text-gray-900 mb-2">
          {book.title}
        </h1>

        <p className="text-gray-500 mb-1">
          Author: <span className="text-gray-800 font-medium">{book.author}</span>
        </p>

        <p className="text-gray-500 mb-6">
          Category: <span className="text-gray-800 font-medium">{book.category}</span>
        </p>
        
        <span
            className={`px-3 py-1 rounded-full text-xs font-medium ${
              book.status === 'available'
                ? 'bg-green-100 text-green-700'
                : 'bg-red-100 text-red-600'
            }`}
          >
            {book.status}
          </span>
          </div>

        </div>
    
        {/* BUTTON WITH LOADING STATE */}
        {book.status === 'available' ? (
          <button
            onClick={borrowBook}
            disabled={loading}
            className="w-full bg-black text-white py-3 rounded-full font-medium hover:bg-gray-800 transition flex items-center justify-center"
          >
            {loading ? 'Processing...' : 'Borrow'}
          </button>
        ) : (
          <button
            disabled
            className="w-full bg-gray-200 text-gray-500 py-3 rounded-full font-medium cursor-not-allowed"
          >
            Borrowed
          </button>
        )}

      </div>

      <Toaster 
        position="top-right"
        containerStyle={{
          top: 80,
          right: 0,
        }}
        toastOptions={{
          duration: 2000,
          style: {
            background: '#fff',
            color: '#111',
            border: '1px solid #eee',
            borderRadius: '12px',
          },
        }}
      />
    </div>
  );
}