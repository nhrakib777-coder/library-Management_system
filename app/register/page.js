'use client';
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Footer from '@/components/Footer';

export default function RegisterPage() {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const { register } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(form.email, form.password, form.name);
      alert('Registration successful! Please check your email to verify.');
      router.push('/login');
    } catch (err) {
      alert('Registration failed: ' + err.message);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white p-6 rounded-xl shadow">
          <h1 className="text-2xl font-bold mb-4 text-center">Register</h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              placeholder="Full Name"
              className="w-full p-2 border rounded"
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
            <input
              type="email"
              placeholder="Email"
              className="w-full p-2 border rounded"
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
            <input
              type="password"
              placeholder="Password"
              className="w-full p-2 border rounded"
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
            />
            <button className="w-full bg-blue-600 text-white p-2 rounded">
              Register
            </button>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
}