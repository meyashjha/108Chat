import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Landing = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    const url = isLogin ? 'http://localhost:3000/api/v1/user/login' : 'http://localhost:3000/api/v1/user/signup';
    const payload = isLogin ? { email: form.email, password: form.password } : form;
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Error');
      setMessage(data.message);
      if (data.token) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('userName', data.user?.name || 'User');
        navigate('/chat');
      }
    } catch (err) {
      setMessage(err.message);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#121212]">
      <div className="backdrop-blur-lg bg-gray-900/70 border border-gray-800 shadow-2xl rounded-2xl px-10 py-8 w-96 flex flex-col items-center">
        <img src="/logo.png" alt="108Chat Logo" className="h-16 w-16 mb-4 rounded-full shadow-lg" />
        <h2 className="text-3xl font-extrabold mb-2 text-sky-300 tracking-tight drop-shadow text-center">
          {isLogin ? 'Welcome Back' : 'Create Account'}
        </h2>
        <p className="mb-6 text-gray-400 text-center text-sm">{isLogin ? 'Sign in to continue to 108Chat' : 'Join 108Chat and start chatting with AI!'}</p>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full">
          {!isLogin && (
            <input
              type="text"
              name="name"
              placeholder="Name"
              value={form.name}
              onChange={handleChange}
              className="bg-gray-800/80 border border-gray-700 text-white p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-400"
              required
            />
          )}
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            className="bg-gray-800/80 border border-gray-700 text-white p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-400"
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            className="bg-gray-800/80 border border-gray-700 text-white p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-400"
            required
          />
          <button type="submit" className="bg-sky-500 hover:bg-sky-600 transition text-white font-bold py-2 rounded-lg shadow mt-2">
            {isLogin ? 'Login' : 'Sign Up'}
          </button>
        </form>
        <button
          className="mt-4 text-sky-400 hover:underline w-full text-sm"
          onClick={() => { setIsLogin(!isLogin); setMessage(''); }}
        >
          {isLogin ? "Don't have an account? " : 'Already have an account? '}
          <span className="font-bold">{isLogin ? 'Sign Up' : 'Login'}</span>
        </button>
        {message && <div className="mt-3 text-center text-red-400 font-semibold text-sm">{message}</div>}
      </div>
      <div className="mt-8 text-gray-600 text-xs text-center opacity-60">&copy; {new Date().getFullYear()} 108Chat. All rights reserved.</div>
    </div>
  );
};

export default Landing;