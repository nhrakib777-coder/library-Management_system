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
import { MdModeEdit, MdDelete, MdEdit } from "react-icons/md";

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
    status: 'available'
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editBookId, setEditBookId] = useState(null);

  // Fetch books
  const fetchBooksAndBorrows = useCallback(async () => {
  const { data: bk } = await supabase
    .from('books')
    .select('*');

  const { data: br } = await supabase
    .from('borrows')
    .select(`
      id,
      created_at,
      returned,
      user_id,
      book_id,
      books (
        title,
        author,
        isbn
      )
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
  datasets: [
    {
      data: [availableBooks, borrowedBooks],
      backgroundColor: ['#000', '#9CA3AF'],
      borderRadius: 8,
      spacing: 4,
      borderWidth: 2,
      hoverOffset: 10
    }
  ]
};
 const pieOptions = {
  responsive: true,
  plugins: {
    legend: {
      position: 'bottom',
      labels: {
        padding: 20,
        usePointStyle: true,
        pointStyle: 'rectRounded', // ✅ this gives rounded squares
        font: {
          size: 20,
        },
      },
    },
  },
  cutout: '60%',
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
      <div className="w-64 bg-white shadow-sm text-black h-screen fixed left-0 top-0 p-5 flex flex-col space-y-3">
        <h2 className="text-lg font-bold mb-6 pb-3 border-b border-gray-700">Admin Panel</h2>

        <button onClick={() => setActiveTab('dashboard')} className={`w-full p-3 text-left rounded ${activeTab === 'dashboard' ? 'bg-gray-600 text-white' : 'hover:bg-gray-800 hover:text-white '}`}>Dashboard</button>
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
                <div className="space-y-4 lg:gap-4 md:grid-cols-2 lg:grid grid-cols-4  mb-8">
                  <div className="bg-white  rounded shadow h-15 lg:h-30 text-xl  items-center flex justify-center p-4">Total Books: {totalBooks}</div>
                  <div className="bg-white p-5 rounded shadow h-15 lg:h-30  text-xl flex justify-center items-center">Total Users: {totalUsers}</div>
                  <div className="bg-white p-5 rounded shadow h-15 lg:h-30  text-xl flex justify-center items-center">Total Borrows: {totalBorrows}</div>
                  <div className="bg-white p-5 rounded shadow h-15 lg:h-30  text-xl flex justify-center items-center">Available Books: {availableBooks}</div>
                </div>
                <div className="bg-white p-5 rounded shadow w-120  ">
                  <h3 className="font-bold mb-3">Book Status</h3>
                  <Pie data={pieData} options={pieOptions} />
                </div>
              </div>
            )}

        {activeTab === 'addbook' && (
  <div className="max-w-3xl">

    {/* Title */}
    <h1 className="text-3xl font-semibold mb-8 tracking-tight">
      {isEditing ? 'Edit Book' : 'Add New Book'}
    </h1>

    {/* Card */}
    <div className="bg-white/70 backdrop-blur-xl p-8 rounded-2xl shadow-lg border border-gray-100">

      <form onSubmit={isEditing ? updateBook : addBook} className="grid gap-5">

        {/* Inputs */}
        <input
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Book Title"
          className="p-3 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-blue-500 outline-none transition"
          required
        />

        <input
          name="author"
          value={formData.author}
          onChange={handleChange}
          placeholder="Author"
          className="p-3 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-blue-500 outline-none transition"
          required
        />

        <input
          name="category"
          value={formData.category}
          onChange={handleChange}
          placeholder="Category"
          className="p-3 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-blue-500 outline-none transition"
        />

        <input
          name="isbn"
          value={formData.isbn}
          onChange={handleChange}
          placeholder="ISBN"
          className="p-3 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-blue-500 outline-none transition"
        />

        <input
          name="image"
          value={formData.image}
          onChange={handleChange}
          placeholder="Image URL"
          className="p-3 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-blue-500 outline-none transition"
        />

        {/* Select (fixed — native limitation respected) */}
       <div className="relative w-full">

  {/* Trigger */}
  <div
    onClick={() => setOpen(!open)}
    className="p-3 border rounded-xl bg-white cursor-pointer"
  >
    {formData.status}
  </div>

  {/* Dropdown */}
  {open && (
    <div className="absolute w-full mt-2 bg-white shadow-lg rounded-xl overflow-hidden z-10">

      <div
        onClick={() => {
          setFormData({ ...formData, status: 'available' });
          setOpen(false);
        }}
        className="p-3 hover:bg-gray-100 cursor-pointer"
      >
        Available
      </div>

      <div
        onClick={() => {
          setFormData({ ...formData, status: 'not available' });
          setOpen(false);
        }}
        className="p-3 hover:bg-gray-100 cursor-pointer"
      >
        Not Available
      </div>

    </div>
  )}

</div>

        {/* Button */}
        <button
          className="mt-2 bg-black text-white p-3 rounded-xl hover:scale-[1.02] transition font-medium"
        >
          {isEditing ? 'Update Book' : 'Add Book'}
        </button>

      </form>
    </div>
  </div>
)}

            {activeTab === 'allbooks' && (
              <div>
                <h1 className="text-2xl font-bold mb-6">All Books</h1>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

  {books.map(book => (
    <div
      key={book.id}
      className="group bg-white/70 backdrop-blur-xl border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
    >

      {/* IMAGE */}
      {book.image ? (
        <div className="overflow-hidden">
          <img
            src={book.image}
            alt={book.title}
            className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </div>
      ) : (
        <div className="w-full h-40 bg-gray-100 flex items-center justify-center text-gray-400">
          No Image
        </div>
      )}

      {/* CONTENT */}
      <div className="p-4 space-y-2">

        <h3 className="font-semibold text-lg text-gray-900 line-clamp-1">
          {book.title}
        </h3>

        <p className="text-sm text-gray-500">
          {book.author}
        </p>

        {/* STATUS */}
        <span
          className={`inline-flex items-center px-3 py-1 text-xs rounded-full font-medium
            ${book.status === 'available'
              ? 'bg-green-100 text-green-700'
              : 'bg-red-100 text-red-700'
            }`}
        >
          {book.status}
        </span>

        {/* ACTIONS */}
        <div className="flex justify-between items-center pt-3">

          <button
            onClick={() => editBook(book)}
            className="text-sm font-medium bg-gray-100 hover:bg-gray-200 rounded-full text-center p-3 text-black-600 hover:text-gray-800 transition"
          >
            <MdEdit size={20} className="inline-block mr-1   " />
          </button>

          <button
            onClick={() => deleteBook(book.id)}
            className="text-sm font-medium bg-gray-100 hover:bg-gray-200 rounded-full text-center p-3 text-black-600 hover:text-red-500 transition"
          >
            <MdDelete size={20} className="inline-block mr-1 " />
          </button>

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
                    <div key={b.id} className="bg-white p-4 rounded-md shadow">
                      <div className='flex gap-8 items-center mb-2'>
                        <p><strong>Book:</strong> {b.books?.title}</p>
                      <p className="text-xs text-black-400">
  ISBN: {b.books?.isbn || 'Not provided'}</p>
                      </div>
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