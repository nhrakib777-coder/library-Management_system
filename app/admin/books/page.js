"use client";

import { useState } from "react";
import { getBooks, setStorage } from "@/utils/storage";

export default function AdminBooks() {
  // 🔥 NO useEffect, NO hydration issue, NO ESLint error
  const [books, setBooks] = useState(() => getBooks() || []);

  const handleDelete = (id) => {
    const updated = books.filter(b => b.id !== id);
    setBooks(updated);
    setStorage("books", updated);
  };

  return (
    <div className="p-10">
      <h1 className="text-2xl font-bold mb-4">Manage Books</h1>

      {books.length === 0 ? (
        <p>No books found</p>
      ) : (
        books.map(book => (
          <div
            key={book.id}
            className="border p-3 flex justify-between"
          >
            <div>
              <p className="font-semibold">{book.title}</p>
              <p className="text-sm text-gray-500">
                {book.author}
              </p>
            </div>

            <button
              onClick={() => handleDelete(book.id)}
              className="bg-red-500 text-white px-3 py-1 rounded"
            >
              Delete
            </button>
          </div>
        ))
      )}
    </div>
  );
}