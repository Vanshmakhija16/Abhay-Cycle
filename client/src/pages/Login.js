import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { FiMail, FiLock, FiEye, FiEyeOff } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const user = await login(form.email, form.password);
      toast.success(`Welcome back, ${user.name}! 👋`);
      navigate(user.role === 'admin' ? '/admin' : '/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-[#FAF9F9] dark:bg-[#0F0F1A] flex items-center justify-center px-4 pt-20">
      <motion.div
        initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white dark:bg-[#1C1C2E] rounded-3xl p-8 shadow-2xl border border-gray-100 dark:border-gray-700"
      >
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-red-600 dark:bg-orange-500 flex items-center justify-center mx-auto mb-4 shadow-lg">
            <span className="text-white font-bold text-2xl">A</span>
          </div>
          <h1 className="font-heading font-black text-2xl text-gray-900 dark:text-white">Welcome Back</h1>
          <p className="text-gray-400 mt-1 text-sm">Login to your Abhay Cycle account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-500 dark:text-gray-400 mb-1">Email</label>
            <div className="relative">
              <FiMail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input type="email" required value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
                placeholder="you@example.com"
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-[#FAF9F9] dark:bg-[#0F0F1A] text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 dark:focus:ring-orange-500 outline-none" />
            </div>
          </div>
          <div>
            <label className="block text-sm text-gray-500 dark:text-gray-400 mb-1">Password</label>
            <div className="relative">
              <FiLock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input type={showPass ? 'text' : 'password'} required value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })} placeholder="••••••••"
                className="w-full pl-10 pr-10 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-[#FAF9F9] dark:bg-[#0F0F1A] text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 dark:focus:ring-orange-500 outline-none" />
              <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                {showPass ? <FiEyeOff size={16} /> : <FiEye size={16} />}
              </button>
            </div>
          </div>
          <motion.button whileTap={{ scale: 0.95 }} type="submit" disabled={loading}
            className="w-full btn-primary py-3 disabled:opacity-50">
            {loading ? 'Logging in...' : 'Login'}
          </motion.button>
        </form>

        <p className="text-center text-sm text-gray-400 mt-6">
          Don't have an account?{' '}
          <Link to="/register" className="text-red-600 dark:text-orange-400 font-semibold hover:underline">Register</Link>
        </p>

        {/* Demo Credentials */}
        {/* <div className="mt-5 p-3 bg-red-50 dark:bg-orange-900/20 rounded-xl text-xs text-center text-gray-500 dark:text-gray-400">
          <strong>Admin Demo:</strong> admin@abhaycycle.com / admin123
        </div> */}
      </motion.div>
    </div>
  );
};

export default Login;
