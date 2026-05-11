'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/utils/supabase';
import Link from 'next/link';
import BookCard from '@/components/BookCard';

export default function Home() {
  const [books, setBooks] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function load() {
      const { data } = await supabase.from('books').select('*').limit(9);
      setBooks(data || []);
    }
    load();
  }, []);

  const filtered = books.filter(b =>
    b.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <main className="pt-32 px-6 max-w-7xl mx-auto">

      {/* HERO */}
      <section className="text-center enter">

        <h1 className="text-6xl font-semibold tracking-tight">
          The Library of Modern Thought
        </h1>

        <p className="mt-5 text-gray-600 text-lg max-w-2xl mx-auto">
          A curated cinematic reading experience designed like a digital museum.
        </p>

      </section>

      {/* SEARCH */}
      <div className="mt-12 flex justify-center enter">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search books..."
          className="
            w-full max-w-2xl px-6 py-4 rounded-full
            bg-white/70 backdrop-blur-xl
            border border-white/50
            shadow-sm outline-none
          "
        />
      </div>

      {/* GRID */}
      <section className="mt-16 enter">

        <h2 className="text-sm tracking-[0.3em] uppercase text-gray-500 mb-8">
          Featured Collection
        </h2>

        <div className="grid md:grid-cols-3 gap-10">
          {filtered.map(book => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>

      </section>

    </main>
  );
}