"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/utils/supabase";
import BookCard from "@/components/BookCard";

export default function BooksPage() {
  const [books, setBooks] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getBooks() {
      setLoading(true);
      const { data } = await supabase.from("books").select("*");
      setBooks(data || []);
      setLoading(false);
    }
    getBooks();
  }, []);

  // 🔍 SEARCH FILTER
  const filteredBooks = books.filter(
    (book) =>
      book.title.toLowerCase().includes(search.toLowerCase()) ||
      book.author.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto p-5">
      <h1 className="text-3xl font-bold mb-6">All Books</h1>

      {/* 🔍 SEARCH INPUT */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search by title or author..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full p-3 border rounded-lg"
        />
      </div>

      {loading ? (
        <div className="text-center py-10">Loading books...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {filteredBooks.map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      )}
    </div>
  );
}