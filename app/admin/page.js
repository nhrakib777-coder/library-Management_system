'use client';
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/utils/supabase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import toast from 'react-hot-toast';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function AdminDashboard() {
  const { user } = useAuth();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState('dashboard');
  const [books, setBooks] = useState([]);
  const [borrows, setBorrows] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    title: '',
    author: '',
    category: '',
    isbn: '',
    image: '',
    status: 'available'
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editBookId, setEditBookId] = useState(null);

  // Fetch books
  const fetchBooksAndBorrows = useCallback(async () => {
    const { data: bk } = await supabase.from('books').select('*');
    const { data: br } = await supabase.from('borrows').select(`
      id, created_at, returned, user_id, book_id, books (title, author)
    `);
    setBooks(bk || []);
    setBorrows(br || []);
  }, []);

  // 👉 FETCH SUPABASE USERS VIA API ROUTE (SAFE)
  const fetchFreshUsers = useCallback(async () => {
    const res = await fetch('/api/supabase-users');
    const users = await res.json();
    setAllUsers(users || []);
  }, []);

  // Load all data
  const fetchData = useCallback(async () => {
    setLoading(true);
    await fetchBooksAndBorrows();
    await fetchFreshUsers();
    setLoading(false);
  }, [fetchBooksAndBorrows, fetchFreshUsers]);

  // Admin protection
  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }
  }, [user, router]);

  // Initial load
  useEffect(() => {
    let mounted = true;
    const load = async () => {
      if (user?.user_metadata?.role === 'admin' && mounted) {
        await fetchData();
      }
    };
    load();
    return () => { mounted = false; };
  }, [user, fetchData]);

  // Refresh users when tab opens
  useEffect(() => {
    let mounted = true;
    const refresh = async () => {
      if (activeTab === 'users' && mounted) {
        await fetchFreshUsers();
      }
    };
    refresh();
    return () => { mounted = false; };
  }, [activeTab, fetchFreshUsers]);

  // Stats
  const totalBooks = books.length;
  const totalUsers = allUsers.length;
  const totalBorrows = borrows.length;
  const availableBooks = books.filter(b => b.status === 'available').length;
  const borrowedBooks = books.filter(b => b.status === 'not available').length;

  const pieData = {
    labels: ['Available', 'Borrowed'],
    datasets: [{ data: [availableBooks, borrowedBooks], backgroundColor: ['#22c55e', '#ef4444'] }]
  };

  // Form handlers
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const addBook = async (e) => {
    e.preventDefault();
    await supabase.from('books').insert([formData]);
    toast.success('Book Added!');
    setFormData({ title: '', author: '', category: '', isbn: '', image: '', status: 'available' });
    fetchBooksAndBorrows();
  };

  const editBook = (book) => {
    setIsEditing(true);
    setEditBookId(book.id);
    setFormData({
      title: book.title,
      author: book.author,
      category: book.category || '',
      isbn: book.isbn || '',
      image: book.image || '',
      status: book.status
    });
    setActiveTab('addbook');
  };

  const updateBook = async (e) => {
    e.preventDefault();
    await supabase.from('books').update(formData).eq('id', editBookId);
    toast.success('Book Updated!');
    setIsEditing(false);
    fetchBooksAndBorrows();
  };

  const deleteBook = async (id) => {
    if (confirm('Delete?')) {
      await supabase.from('books').delete().eq('id', id);
      toast.success('Book Deleted!');
      fetchBooksAndBorrows();
    }
  };

  if (!user || user?.user_metadata?.role !== 'admin') return null;

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      <div className="w-64 bg-gray-900 text-white h-screen fixed left-0 top-0 p-5 flex flex-col">
        <h2 className="text-lg font-bold mb-6 pb-3 border-b border-gray-700">ADMIN PANEL</h2>

        <button onClick={() => setActiveTab('dashboard')} className={`w-full p-3 text-left rounded ${activeTab === 'dashboard' ? 'bg-blue-600' : 'hover:bg-gray-800'}`}>Dashboard</button>
        <button onClick={() => setActiveTab('addbook')} className={`w-full p-3 text-left rounded ${activeTab === 'addbook' ? 'bg-blue-600' : 'hover:bg-gray-800'}`}>Add/Edit Book</button>
        <button onClick={() => setActiveTab('allbooks')} className={`w-full p-3 text-left rounded ${activeTab === 'allbooks' ? 'bg-blue-600' : 'hover:bg-gray-800'}`}>All Books</button>
        <button onClick={() => setActiveTab('borrows')} className={`w-full p-3 text-left rounded ${activeTab === 'borrows' ? 'bg-blue-600' : 'hover:bg-gray-800'}`}>Borrows</button>
        <button onClick={() => setActiveTab('users')} className={`w-full p-3 text-left rounded ${activeTab === 'users' ? 'bg-blue-600' : 'hover:bg-gray-800'}`}>All Users</button>

        <Link href="/" className="mt-auto p-3 hover:bg-gray-800 rounded text-left">← Back</Link>
      </div>

      <div className="ml-64 flex-1 overflow-y-auto p-6">
        {loading ? <p>Loading...</p> : (
          <div>
            {activeTab === 'dashboard' && (
              <div>
                <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
                <div className="grid grid-cols-4 gap-4 mb-8">
                  <div className="bg-white p-5 rounded shadow">Books: {totalBooks}</div>
                  <div className="bg-white p-5 rounded shadow">Users: {totalUsers}</div>
                  <div className="bg-white p-5 rounded shadow">Borrows: {totalBorrows}</div>
                  <div className="bg-white p-5 rounded shadow">Available: {availableBooks}</div>
                </div>
                <div className="bg-white p-5 rounded shadow w-72">
                  <h3 className="font-bold mb-3">Book Status</h3>
                  <Pie data={pieData} />
                </div>
              </div>
            )}

            {activeTab === 'addbook' && (
              <div>
                <h1 className="text-2xl font-bold mb-6">{isEditing ? 'Edit' : 'Add Book'}</h1>
                <div className="bg-white p-6 rounded shadow max-w-2xl">
                  <form onSubmit={isEditing ? updateBook : addBook} className="grid gap-3">
                    <input name="title" value={formData.title} onChange={handleChange} placeholder="Title" className="p-3 border rounded" required />
                    <input name="author" value={formData.author} onChange={handleChange} placeholder="Author" className="p-3 border rounded" required />
                    <input name="category" value={formData.category} onChange={handleChange} placeholder="Category" className="p-3 border rounded" />
                    <input name="isbn" value={formData.isbn} onChange={handleChange} placeholder="ISBN" className="p-3 border rounded" />
                    <input name="image" value={formData.image} onChange={handleChange} placeholder="Image URL" className="p-3 border rounded" />
                    <select name="status" value={formData.status} onChange={handleChange} className="p-3 border rounded">
                      <option value="available">Available</option>
                      <option value="not available">Not Available</option>
                    </select>
                    <button className="bg-blue-600 text-white p-3 rounded">{isEditing ? 'Update' : 'Add Book'}</button>
                  </form>
                </div>
              </div>
            )}

            {activeTab === 'allbooks' && (
              <div>
                <h1 className="text-2xl font-bold mb-6">All Books</h1>
                <div className="grid grid-cols-3 gap-4">
                  {books.map(book => (
                    <div key={book.id} className="bg-white p-4 rounded shadow">
                      {book.image && <img src={book.image} className="w-full h-36 object-cover rounded mb-2" alt="" />}
                      <h3 className="font-bold">{book.title}</h3>
                      <p className="text-sm text-gray-600">{book.author}</p>
                      <p className={`text-sm mt-2 ${book.status === 'available' ? 'text-green-600' : 'text-red-600'}`}>{book.status}</p>
                      <div className="flex gap-4 mt-3">
                        <button onClick={() => editBook(book)} className="text-blue-600">Edit</button>
                        <button onClick={() => deleteBook(book.id)} className="text-red-600">Delete</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'borrows' && (
              <div>
                <h1 className="text-2xl font-bold mb-6">Borrow Records</h1>
                <div className="space-y-3">
                  {borrows.map(b => (
                    <div key={b.id} className="bg-white p-4 rounded shadow">
                      <p><strong>Book:</strong> {b.books?.title}</p>
                      <p><strong>User ID:</strong> {b.user_id}</p>
                      <p className={b.returned ? 'text-green-600' : 'text-orange-600'}>
                        {b.returned ? 'Returned' : 'Not Returned'}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'users' && (
              <div>
                <h1 className="text-2xl font-bold mb-6">All Users ({allUsers.length})</h1>
                <div className="space-y-3">
                  {allUsers.map(u => (
                    <div key={u.id} className="bg-white p-4 rounded shadow">
                      <p><strong>Email:</strong> {u.email}</p>
                      <p><strong>Role:</strong> {u.user_metadata?.role || 'user'}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}