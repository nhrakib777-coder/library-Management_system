'use client';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';

export default function AdminDashboard() {
  const { user } = useAuth();

  if (!user || user.user_metadata?.role !== 'admin') {
    return <div className="p-10 text-center text-red-500">Access Denied. Admin only.</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link href="/admin/add-book" className="p-6 border rounded-lg hover:bg-gray-50">
          <h2 className="text-xl font-bold">Add New Book</h2>
          <p className="text-gray-600">Upload books to the library</p>
        </Link>
        <Link href="/admin/borrows" className="p-6 border rounded-lg hover:bg-gray-50">
          <h2 className="text-xl font-bold">View All Borrows</h2>
          <p className="text-gray-600">Monitor book loans</p>
        </Link>
        <Link href="/admin/users" className="p-6 border rounded-lg hover:bg-gray-50">
          <h2 className="text-xl font-bold">Manage Users</h2>
          <p className="text-gray-600">View library members</p>
        </Link>
      </div>
    </div>
  );
}