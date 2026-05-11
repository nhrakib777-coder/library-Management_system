'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Footer from '@/components/Footer';

export default function RegisterPage() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: ''
  });

  const { register } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await register(form.email, form.password, form.name);

      alert('Registration successful. Please verify your email.');

      router.push('/login');

    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-elite flex flex-col">

      {/* CENTER */}
      <main className="flex-1 flex items-center justify-center px-6">

        <div className="w-full max-w-md enter">

          {/* HEADER */}
          <div className="text-center mb-10">

            <h1 className="text-4xl font-semibold tracking-tight">
              Create Account
            </h1>

            <p className="text-gray-500 mt-2">
              Join your digital library experience
            </p>

          </div>

          {/* CARD */}
          <div className="
            bg-white/60 backdrop-blur-xl
            border border-white/40
            shadow-sm
            rounded-3xl p-8
          ">

            <form onSubmit={handleSubmit} className="space-y-5">

              {/* NAME */}
              <input
                type="text"
                placeholder="Full name"
                className="
                  w-full px-5 py-4 rounded-2xl
                  bg-white/70
                  border border-white/40
                  outline-none
                  focus:ring-2 focus:ring-black/10
                  transition
                "
                onChange={(e) =>
                  setForm({ ...form, name: e.target.value })
                }
                required
              />

              {/* EMAIL */}
              <input
                type="email"
                placeholder="Email address"
                className="
                  w-full px-5 py-4 rounded-2xl
                  bg-white/70
                  border border-white/40
                  outline-none
                  focus:ring-2 focus:ring-black/10
                  transition
                "
                onChange={(e) =>
                  setForm({ ...form, email: e.target.value })
                }
                required
              />

              {/* PASSWORD */}
              <input
                type="password"
                placeholder="Password"
                className="
                  w-full px-5 py-4 rounded-2xl
                  bg-white/70
                  border border-white/40
                  outline-none
                  focus:ring-2 focus:ring-black/10
                  transition
                "
                onChange={(e) =>
                  setForm({ ...form, password: e.target.value })
                }
                required
              />

              {/* BUTTON */}
              <button
                type="submit"
                className="
                  w-full py-4 rounded-2xl
                  bg-black text-white
                  hover:scale-[1.02]
                  transition font-medium
                "
              >
                Create Account
              </button>

            </form>

          </div>

          {/* FOOT NOTE */}
          <p className="text-center text-xs text-gray-500 mt-6">
            By registering, you enter the library system
          </p>

        </div>

      </main>

      
    </div>
  );
}