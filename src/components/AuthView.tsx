import React, { useState } from 'react';
import { supabase } from '../services/supabase';
import { useAuth } from '../hooks/useAuth';
import { motion } from 'motion/react';
import { LogIn, Mail, UserCircle } from 'lucide-react';
import { cn } from '../utils';

export const AuthView: React.FC = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const { signInAnonymously } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: window.location.origin,
      },
    });

    if (error) {
      setMessage(error.message);
    } else {
      setMessage('Check your email for the login link!');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-stone-50">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white rounded-3xl p-8 shadow-sm border border-stone-200"
      >
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold tracking-tight text-stone-900 mb-2">Lumina</h1>
          <p className="text-stone-500">Your path to better health, one log at a time.</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all outline-none"
                placeholder="you@example.com"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-stone-900 text-white rounded-xl font-semibold hover:bg-stone-800 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? 'Sending...' : (
              <>
                <LogIn className="w-5 h-5" />
                Get Magic Link
              </>
            )}
          </button>
        </form>

        <div className="relative my-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-stone-100"></div>
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white px-2 text-stone-400 font-bold tracking-widest">Or</span>
          </div>
        </div>

        <button
          onClick={signInAnonymously}
          className="w-full py-3 bg-white border border-stone-200 text-stone-700 rounded-xl font-semibold hover:bg-stone-50 transition-colors flex items-center justify-center gap-2"
        >
          <UserCircle className="w-5 h-5" />
          Continue Anonymously
        </button>

        {message && (
          <p className={cn("mt-4 text-center text-sm font-medium", message.includes('Check') ? "text-emerald-600" : "text-red-500")}>
            {message}
          </p>
        )}

        <div className="mt-8 pt-8 border-t border-stone-100 text-center">
          <p className="text-xs text-stone-400 uppercase tracking-widest font-semibold">
            Secure Passwordless Auth
          </p>
        </div>
      </motion.div>
    </div>
  );
};
