"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/utils/supabase";
import BookCard from "@/components/BookCard";

export default function BooksPage() {
  const [books, setBooks] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [status, setStatus] = useState("all");
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

  // GET ALL UNIQUE CATEGORIES FOR FILTER
  const allCategories = ["all", ...new Set(books.map((b) => b.category))];

  // 🔍 FULL FILTER SYSTEM: SEARCH + CATEGORY + STATUS
  const filteredBooks = books.filter((book) => {
    const matchesSearch =
      book.title.toLowerCase().includes(search.toLowerCase()) ||
      book.author.toLowerCase().includes(search.toLowerCase());

    const matchesCategory = category === "all" || book.category === category;
    const matchesStatus = status === "all" || book.status === status;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  return (
    <div className="max-w-6xl mx-auto p-5 mt-20">
      <h1 className="text-3xl font-bold mb-6">All Books</h1>

      {/* FILTER BAR */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {/* SEARCH */}
        <input
          type="text"
          placeholder="Search by title or author..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="p-3 border rounded-lg"
        />

        {/* CATEGORY FILTER */}
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="p-3 border rounded-lg bg-white"
        >
          {allCategories.map((cat) => (
            <option key={cat} value={cat}>
              {cat === "all" ? "All Categories" : cat}
            </option>
          ))}
        </select>

        {/* STATUS FILTER */}
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="p-3 border rounded-lg bg-white"
        >
          <option value="all">All Status</option>
          <option value="available">Available</option>
          <option value="not available">Not Available</option>
        </select>
      </div>

      {loading ? (
        <div className="text-center py-10">Loading books...</div>
      ) : filteredBooks.length === 0 ? (
        <div className="text-center py-10 text-gray-500">
          No books found
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {filteredBooks.map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      )}
    </div>
  );
}