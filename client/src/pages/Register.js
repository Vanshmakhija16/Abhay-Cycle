import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { FiUser, FiMail, FiLock, FiEye, FiEyeOff } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirm) return toast.error('Passwords do not match');
    if (form.password.length < 6) return toast.error('Password must be at least 6 characters');
    setLoading(true);
    try {
      await register(form.name, form.email, form.password);
      toast.success('Account created! Welcome to Abhay Cycle 🚴');
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-[#FAF9F9] dark:bg-[#0F0F1A] flex items-center justify-center px-4 pt-20 pb-10">
      <motion.div
        initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white dark:bg-[#1C1C2E] rounded-3xl p-8 shadow-2xl border border-gray-100 dark:border-gray-700"
      >
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-red-600 dark:bg-orange-500 flex items-center justify-center mx-auto mb-4 shadow-lg">
            <span className="text-white font-bold text-2xl">A</span>
          </div>
          <h1 className="font-heading font-black text-2xl text-gray-900 dark:text-white">Create Account</h1>
          <p className="text-gray-400 mt-1 text-sm">Join the Abhay Cycle family!</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {[
            { name: 'name', label: 'Full Name', type: 'text', icon: FiUser, placeholder: 'Rahul Kumar' },
            { name: 'email', label: 'Email', type: 'email', icon: FiMail, placeholder: 'you@example.com' },
          ].map(({ name, label, type, icon: Icon, placeholder }) => (
            <div key={name}>
              <label className="block text-sm text-gray-500 dark:text-gray-400 mb-1">{label}</label>
              <div className="relative">
                <Icon size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type={type} required value={form[name]} onChange={e => setForm({ ...form, [name]: e.target.value })}
                  placeholder={placeholder}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-[#FAF9F9] dark:bg-[#0F0F1A] text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 dark:focus:ring-orange-500 outline-none" />
              </div>
            </div>
          ))}
          {['password', 'confirm'].map((field, i) => (
            <div key={field}>
              <label className="block text-sm text-gray-500 dark:text-gray-400 mb-1">{i === 0 ? 'Password' : 'Confirm Password'}</label>
              <div className="relative">
                <FiLock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type={showPass ? 'text' : 'password'} required value={form[field]}
                  onChange={e => setForm({ ...form, [field]: e.target.value })} placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-[#FAF9F9] dark:bg-[#0F0F1A] text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 dark:focus:ring-orange-500 outline-none" />
                {i === 0 && (
                  <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                    {showPass ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                  </button>
                )}
              </div>
            </div>
          ))}
          <motion.button whileTap={{ scale: 0.95 }} type="submit" disabled={loading}
            className="w-full btn-primary py-3 disabled:opacity-50">
            {loading ? 'Creating account...' : 'Create Account'}
          </motion.button>
        </form>

        <p className="text-center text-sm text-gray-400 mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-red-600 dark:text-orange-400 font-semibold hover:underline">Login</Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Register;
