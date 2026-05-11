"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/utils/supabase";
import Image from "next/image";

export default function BookCard({ book }) {
  const router = useRouter();
  const { user } = useAuth();
  const [status, setStatus] = useState(book.status);
  const [loading, setLoading] = useState(false);

  const borrow = async () => {
    if (!user) return router.push("/login");
    if (status !== "available") return;

    setLoading(true);
    setStatus("not available");

    try {
      await supabase.from("borrows").insert([
        { user_id: user.id, book_id: book.id, returned: false }
      ]);

      await supabase
        .from("books")
        .update({ status: "not available" })
        .eq("id", book.id);
    } catch (err) {
      setStatus(book.status);
    }

    setLoading(false);
  };

  return (
    <div className="group enter lift">
      <div className="rounded-3xl overflow-hidden bg-white/60 backdrop-blur-xl border border-white/40 shadow-sm">
        <div className="overflow-hidden">
          <Image
            src={book.image}
            alt={book.title}
            width={300}
            height={400}
            className="h-72 w-full object-cover group-hover:scale-110 transition duration-700"
            unoptimized
          />
        </div>

        <div className="p-5 space-y-3">
          <h3 className="text-lg font-medium tracking-tight">{book.title}</h3>
          <p className="text-sm text-gray-500">{book.author}</p>

          <span
            className={`text-xs px-3 py-1 rounded-full ${
              status === "available"
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-600"
            }`}
          >
            {status}
          </span>

          <div className="flex gap-2 pt-3">
            <Link
              href={`/books/${book.id}`}
              className="flex-1 text-center px-4 py-2 rounded-full bg-gray-100 hover:bg-gray-200 transition"
            >
              View
            </Link>

            <button
              onClick={borrow}
              disabled={loading || status !== "available"}
              className="flex-1 px-4 py-2 rounded-full bg-black text-white hover:scale-[1.03] transition disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {status !== "available"
                ? "Borrowed"
                : loading
                ? "Loading..."
                : "Borrow"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}