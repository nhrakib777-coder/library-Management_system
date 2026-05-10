'use client';
import { useState } from "react";
import { supabase } from "@/utils/supabase";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

export default function AddBook() {
  const { user } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState({
    title: "",
    author: "",
    category: "",
    description: "",
    status: "available",
  });

  if (!user || user.user_metadata?.role !== "admin") {
    return <div className="p-10 text-center text-red-500">Access Denied ❌ Only Admin</div>;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { error } = await supabase.from("books").insert([form]);
    if (error) {
      alert("Error: " + error.message);
    } else {
      alert("Book added successfully!");
      router.push("/books");
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 mt-10 border rounded-xl shadow">
      <h1 className="text-2xl font-bold mb-6 text-center">Add New Book</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text" name="title" placeholder="Title"
          value={form.title} onChange={(e) => setForm({...form, title: e.target.value})}
          required className="w-full p-3 border rounded-lg"
        />
        <input
          type="text" name="author" placeholder="Author"
          value={form.author} onChange={(e) => setForm({...form, author: e.target.value})}
          required className="w-full p-3 border rounded-lg"
        />
        <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold">
          Add Book
        </button>
      </form>
    </div>
  );
}