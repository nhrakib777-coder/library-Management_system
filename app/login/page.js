'use client';

import { useState } from 'react';
import { supabase } from '@/utils/supabase';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const { data, error } =
        await supabase.auth.signInWithPassword({ email, password });

      if (error) throw error;

      toast.success('Welcome back');

      const role = data.user?.user_metadata?.role;

      router.push(role === 'admin' ? '/admin' : '/');
      router.refresh();

    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-elite flex items-center justify-center px-6">

      <div className="w-full max-w-md enter">

        {/* HEADER */}
        <div className="text-center mb-10">

          <h1 className="text-4xl font-semibold tracking-tight">
            Welcome Back
          </h1>

          <p className="text-gray-500 mt-2">
            Sign in to continue your library journey
          </p>

        </div>

        {/* FORM CARD */}
        <div className="
          bg-white/60 backdrop-blur-xl
          border border-white/40
          shadow-sm
          rounded-3xl p-8
        ">

          <form onSubmit={handleLogin} className="space-y-5">

            {/* EMAIL */}
            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="
                w-full px-5 py-4 rounded-2xl
                bg-white/70
                border border-white/40
                outline-none
                focus:ring-2 focus:ring-black/10
                transition
              "
            />

            {/* PASSWORD */}
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="
                w-full px-5 py-4 rounded-2xl
                bg-white/70
                border border-white/40
                outline-none
                focus:ring-2 focus:ring-black/10
                transition
              "
            />

            {/* BUTTON */}
            <button
              type="submit"
              className="
                w-full py-4 rounded-2xl
                bg-black text-white
                hover:scale-[1.02]
                transition
                font-medium
              "
            >
              Sign In
            </button>

          </form>

        </div>

        {/* FOOTNOTE */}
        <p className="text-center text-xs text-gray-500 mt-6">
          Secure access • Library system
        </p>

      </div>
    </div>
  );
}