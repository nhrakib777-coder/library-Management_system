/* eslint-disable @next/next/no-img-element */
'use client';
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/utils/supabase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import toast from 'react-hot-toast';
import { MdEdit, MdDelete } from 'react-icons/md';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function AdminDashboard() {
  const { user } = useAuth();
  const router = useRouter();
  const [open, setOpen] = useState(false);
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
    status: 'available',
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editBookId, setEditBookId] = useState(null);

  // FULL DATA FETCH
  const fetchBooksAndBorrows = useCallback(async () => {
    const { data: bk } = await supabase.from('books').select('*');
    const { data: br } = await supabase.from('borrows').select(`
      id, created_at, returned, user_id, book_id,
      books (title, author, isbn)
    `);
    setBooks(bk || []);
    setBorrows(br || []);
  }, []);

  const fetchFreshUsers = useCallback(async () => {
    const res = await fetch('/api/supabase-users');
    const users = await res.json();
    setAllUsers(users || []);
  }, []);

  const fetchData = useCallback(async () => {
    setLoading(true);
    await fetchBooksAndBorrows();
    await fetchFreshUsers();
    setLoading(false);
  }, [fetchBooksAndBorrows, fetchFreshUsers]);

  // ADMIN CHECK
  useEffect(() => {
    if (!user || user?.user_metadata?.role !== 'admin') {
      router.push('/login');
    }
  }, [user, router]);

  // ✅ REAL-TIME LISTENER (FIXES ALL UPDATE ISSUES)
  useEffect(() => {
    if (!user) return;

    // Listen for BOOK changes
    const bookChannel = supabase
      .channel('books-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'books' }, fetchBooksAndBorrows)
      .subscribe();

    // Listen for BORROW changes
    const borrowChannel = supabase
      .channel('borrows-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'borrows' }, fetchBooksAndBorrows)
      .subscribe();

    return () => {
      supabase.removeChannel(bookChannel);
      supabase.removeChannel(borrowChannel);
    };
  }, [user, fetchBooksAndBorrows]);

  // LOAD ON MOUNT
  useEffect(() => {
    let mounted = true;
    const delay = setTimeout(() => {
      if (mounted && user?.user_metadata?.role === 'admin') fetchData();
    }, 0);
    return () => { mounted = false; clearTimeout(delay); };
  }, [activeTab, user, fetchData]);

  // STATS
  const totalBooks = books.length;
  const totalUsers = allUsers.length;
  const totalBorrows = borrows.length;
  const availableBooks = books.filter(b => b.status === 'available').length;
  const borrowedBooks = books.filter(b => b.status === 'not available').length;

  const pieData = {
    labels: ['Available', 'Borrowed'],
    datasets: [{
      data: [availableBooks, borrowedBooks],
      backgroundColor: ['#000', '#9CA3AF'],
      borderRadius: 8, spacing: 4, borderWidth: 2, hoverOffset: 10
    }]
  };

  const pieOptions = {
    responsive: true,
    plugins: { legend: { position: 'bottom', labels: { padding: 20, usePointStyle: true, font: { size: 20 } } } },
    cutout: '60%',
  };

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const addBook = async (e) => {
    e.preventDefault();
    await supabase.from('books').insert([formData]);
    toast.success('Book Added!');
    setFormData({ title: '', author: '', category: '', isbn: '', image: '', status: 'available' });
  };

  const editBook = (book) => {
    setIsEditing(true);
    setEditBookId(book.id);
    setFormData(book);
    setActiveTab('addbook');
  };

  const updateBook = async (e) => {
    e.preventDefault();
    await supabase.from('books').update(formData).eq('id', editBookId);
    toast.success('Book Updated!');
    setIsEditing(false);
  };

  const deleteBook = async (id) => {
    if (confirm('Delete?')) {
      await supabase.from('books').delete().eq('id', id);
      toast.success('Book Deleted!');
    }
  };

  if (!user || user?.user_metadata?.role !== 'admin') return null;

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      <div className="w-64 bg-white shadow-sm text-black h-screen fixed left-0 top-0 p-5 flex flex-col space-y-3">
        <h2 className="text-lg font-bold mb-6 pb-3 border-b border-gray-700">Admin Panel</h2>
        <button onClick={() => setActiveTab('dashboard')} className={`w-full p-3 text-left rounded ${activeTab === 'dashboard' ? 'bg-gray-600 text-white' : 'hover:bg-gray-800 hover:text-white'}`}>Dashboard</button>
        <button onClick={() => setActiveTab('addbook')} className={`w-full p-3 text-left rounded ${activeTab === 'addbook' ? 'bg-gray-600 text-white' : 'hover:bg-gray-800 hover:text-white'}`}>Add/Edit Book</button>
        <button onClick={() => setActiveTab('allbooks')} className={`w-full p-3 text-left rounded ${activeTab === 'allbooks' ? 'bg-gray-600 text-white' : 'hover:bg-gray-800 hover:text-white'}`}>All Books</button>
        <button onClick={() => setActiveTab('borrows')} className={`w-full p-3 text-left rounded ${activeTab === 'borrows' ? 'bg-gray-600 text-white' : 'hover:bg-gray-800 hover:text-white'}`}>Borrows</button>
        <button onClick={() => setActiveTab('users')} className={`w-full p-3 text-left rounded ${activeTab === 'users' ? 'bg-gray-600 text-white' : 'hover:bg-gray-800 hover:text-white'}`}>All Users</button>
        <Link href="/" className="mt-auto p-3 hover:bg-gray-800 hover:text-white rounded text-left">← Back to Homepage</Link>
      </div>

      <div className="ml-64 flex-1 overflow-y-auto p-6">
        {loading ? <p>Loading...</p> : (
          <div>
            {activeTab === 'dashboard' && (
              <div>
                <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
                <div className="space-y-4 lg:gap-4 md:grid-cols-2 lg:grid grid-cols-4 mb-8">
                  <div className="bg-white rounded shadow p-4 flex justify-center items-center">Total Books: {totalBooks}</div>
                  <div className="bg-white rounded shadow p-4 flex justify-center items-center">Total Users: {totalUsers}</div>
                  <div className="bg-white rounded shadow p-4 flex justify-center items-center">Total Borrows: {totalBorrows}</div>
                  <div className="bg-white rounded shadow p-4 flex justify-center items-center">Available Books: {availableBooks}</div>
                </div>
                <div className="bg-white p-5 rounded shadow w-120">
                  <h3 className="font-bold mb-3">Book Status</h3>
                  <Pie data={pieData} options={pieOptions} />
                </div>
              </div>
            )}

            {activeTab === 'addbook' && (
              <div className="max-w-3xl">
                <h1 className="text-3xl font-semibold mb-8">{isEditing ? 'Edit Book' : 'Add New Book'}</h1>
                <div className="bg-white/70 p-8 rounded-2xl shadow-lg border">
                  <form onSubmit={isEditing ? updateBook : addBook} className="grid gap-5">
                    <input name="title" value={formData.title} onChange={handleChange} placeholder="Book Title" className="p-3 rounded-xl border" required />
                    <input name="author" value={formData.author} onChange={handleChange} placeholder="Author" className="p-3 rounded-xl border" required />
                    <input name="category" value={formData.category} onChange={handleChange} placeholder="Category" className="p-3 rounded-xl border" />
                    <input name="isbn" value={formData.isbn} onChange={handleChange} placeholder="ISBN" className="p-3 rounded-xl border" />
                    <input name="image" value={formData.image} onChange={handleChange} placeholder="Image URL" className="p-3 rounded-xl border" />
                    <div className="relative w-full">
                      <div onClick={() => setOpen(!open)} className="p-3 border rounded-xl bg-white cursor-pointer">{formData.status}</div>
                      {open && (
                        <div className="absolute w-full mt-2 bg-white shadow-lg rounded-xl z-10">
                          <div onClick={() => { setFormData({ ...formData, status: 'available' }); setOpen(false); }} className="p-3 hover:bg-gray-100">Available</div>
                          <div onClick={() => { setFormData({ ...formData, status: 'not available' }); setOpen(false); }} className="p-3 hover:bg-gray-100">Not Available</div>
                        </div>
                      )}
                    </div>
                    <button className="bg-black text-white p-3 rounded-xl">{isEditing ? 'Update Book' : 'Add Book'}</button>
                  </form>
                </div>
              </div>
            )}

            {activeTab === 'allbooks' && (
              <div>
                <h1 className="text-2xl font-bold mb-6">All Books</h1>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {books.map(book => (
                    <div key={book.id} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl">
                      {book.image ? <img src={book.image} alt={book.title} className="w-full h-40 object-cover" /> : <div className="w-full h-40 bg-gray-100 flex items-center justify-center">No Image</div>}
                      <div className="p-4">
                        <h3 className="font-semibold text-lg">{book.title}</h3>
                        <p className="text-sm text-gray-500">{book.author}</p>
                        <span className={`px-3 py-1 text-xs rounded-full ${book.status === 'available' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{book.status}</span>
                        <div className="flex justify-between pt-3">
                          <button onClick={() => editBook(book)} className="p-3 bg-gray-100 rounded-full"><MdEdit size={20} /></button>
                          <button onClick={() => deleteBook(book.id)} className="p-3 bg-gray-100 rounded-full"><MdDelete size={20} /></button>
                        </div>
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
                      <div className="flex gap-8 items-center"><p><strong>Book:</strong> {b.books?.title}</p><p className="text-xs">ISBN: {b.books?.isbn || 'N/A'}</p></div>
                      <p><strong>User ID:</strong> {b.user_id}</p>
                      <p className={b.returned ? 'text-green-600' : 'text-orange-600'}>{b.returned ? 'Returned' : 'Not Returned'}</p>
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