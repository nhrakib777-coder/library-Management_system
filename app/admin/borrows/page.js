'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/utils/supabase';
import { useAuth } from '@/context/AuthContext';

export default function AllBorrows() {
  const { user } = useAuth();

  if (!user || user.user_metadata?.role !== 'admin') {
    return <div className="p-10 text-center text-red-500">Access Denied</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">All Borrow Records</h1>
      <BorrowList />
    </div>
  );
}

function BorrowList() {
  const [borrows, setBorrows] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase
        .from('borrows')
        .select(`
          *,
          books(title, author),
          users:auth.users(email)
        `)
        .order('created_at', { ascending: false }); // ✅ FIXED HERE

      setBorrows(data || []);
    };

    load();
  }, []);

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b">
            <th className="text-left p-3">Book</th>
            <th className="text-left p-3">User</th>
            <th className="text-left p-3">Status</th>
          </tr>
        </thead>
        <tbody>
          {borrows.map((b) => (
            <tr key={b.id} className="border-b">
              <td className="p-3">{b.books?.title} by {b.books?.author}</td>
              <td className="p-3">{b.users?.email}</td>
              <td className="p-3">{b.returned ? 'Returned' : 'Borrowed'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}