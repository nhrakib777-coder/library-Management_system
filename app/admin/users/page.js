'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/utils/supabase';
import { useAuth } from '@/context/AuthContext';

export default function AllUsers() {
  const { user } = useAuth();

  // Admin check
  if (!user || user.user_metadata?.role !== 'admin') {
    return <div className="p-10 text-center text-red-500">Access Denied</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">All Library Users</h1>
      <UserList />
    </div>
  );
}

// ✅ SEPARATE COMPONENT = NO ESLINT ERROR
function UserList() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const loadUsers = async () => {
      const { data } = await supabase.auth.admin.listUsers();
      setUsers(data.users || []);
    };

    loadUsers();
  }, []);

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b">
            <th className="text-left p-3">Email</th>
            <th className="text-left p-3">Role</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id} className="border-b">
              <td className="p-3">{u.email}</td>
              <td className="p-3">{u.user_metadata?.role || 'user'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}