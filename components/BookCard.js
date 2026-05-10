"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/utils/supabase";

export default function BookCard({ book }) {
  const router = useRouter();
  const { user } = useAuth();

  // ✅ NO EFFECT, NO SETSTATE INSIDE EFFECT = NO ERROR
  const [localStatus, setLocalStatus] = useState(book.status);

  const handleBorrow = async () => {
    if (!user) {
      router.push("/login");
      return;
    }

    // Prevent double click
    if (localStatus !== "available") return;

    // ✅ INSTANT UI UPDATE (NO DELAY)
    setLocalStatus("not available");

    try {
      // Check existing borrow
      const { data: existing } = await supabase
        .from("borrows")
        .select("id")
        .eq("user_id", user.id)
        .eq("book_id", book.id)
        .eq("returned", false)
        .limit(1);

      if (existing?.length) {
        alert("Already borrowed");
        setLocalStatus("available");
        return;
      }

      // Save to database
      await supabase.from("borrows").insert([
        {
          user_id: user.id,
          book_id: book.id,
          returned: false,
        },
      ]);

      await supabase
        .from("books")
        .update({ status: "not available" })
        .eq("id", book.id);

    } catch (err) {
      console.error(err);
      setLocalStatus("available");
      alert("Failed to borrow");
    }
  };

  return (
    <div className="border p-4 rounded shadow">
      <div className="mb-3">
        <img
          src={book.image || "https://via.placeholder.com/150x200?text=Book"}
          alt={book.title}
          className="w-full h-48 object-cover rounded"
        />
      </div>

      <h3 className="font-bold text-lg">{book.title}</h3>
      <p className="text-sm text-gray-500">{book.author}</p>

      <p className="mt-2">
        Status:{" "}
        <span
          className={
            localStatus === "available" ? "text-green-600" : "text-red-600"
          }
        >
          {localStatus}
        </span>
      </p>

      <div className="mt-3 flex gap-2">
        <Link href={`/books/${book.id}`} className="px-3 py-1 bg-gray-200 rounded">
          View
        </Link>

        <button
          onClick={handleBorrow}
          disabled={localStatus !== "available"}
          className={`px-3 py-1 rounded text-white ${
            localStatus === "available" ? "bg-blue-600" : "bg-gray-400"
          }`}
        >
          {localStatus === "available" ? "Borrow" : "Borrowed"}
        </button>
      </div>
    </div>
  );
}