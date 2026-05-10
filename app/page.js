// app/page.js
'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/utils/supabase';
import Link from 'next/link';
import BookCard from '@/components/BookCard';

export default function Home() {
  const [featuredBooks, setFeaturedBooks] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBooks() {
      setLoading(true);
      const { data } = await supabase
        .from('books')
        .select('*')
        .limit(6);
      setFeaturedBooks(data || []);
      setLoading(false);
    }
    fetchBooks();
  }, []);

  const filtered = featuredBooks.filter(
    (book) =>
      book.title.toLowerCase().includes(search.toLowerCase()) ||
      book.author.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <main className="max-w-7xl mx-auto p-5">
      <h1 className="text-4xl font-bold mb-8 text-center">
        Welcome to Library Management System
      </h1>

      <div className="mb-6 text-center">
        <input
          type="text"
          placeholder="Search featured books..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full max-w-xl p-3 border rounded-lg"
        />
      </div>

      <div className="mb-10 text-center">
        <Link
          href="/books"
          className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold"
        >
          Browse All Books
        </Link>
      </div>

      <h2 className="text-2xl font-bold mb-4">Featured Books</h2>

      {loading ? (
        <div className="text-center py-10">Loading...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {filtered.map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      )}
    </main>
  );
}