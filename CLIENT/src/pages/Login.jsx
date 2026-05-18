import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuth } from '../context/useAuth';

const Login = () => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const navigate = useNavigate();
  const location = useLocation();

  // Message passed from ProtectedRoute redirect e.g. "Please login first!"
  const redirectMessage = location.state?.message;
  // Go back to where they were trying to go, or default to home
  const from = location.state?.from || '/';

  const { login } = useAuth();
  const [inputs, setInputs] = useState({ email: '', password: '' });

  const handleChange = (e) => {
    setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(backendUrl + '/api/v1/user/login', {
        email: inputs.email,
        password: inputs.password,
      });

      if (data.success) {
        // ✅ Save BOTH token and userId
        login(data.token, data.user.id);

        toast.success('Logged in successfully!');
        navigate(from, { replace: true }); // go back to where they came from
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl border border-green-50">
        <h2 className="text-3xl font-bold text-center text-green-700 mb-4">Login</h2>

        {/* ✅ Show redirect message if coming from a protected page */}
        {redirectMessage && (
          <div className="mb-6 px-4 py-3 bg-yellow-50 border border-yellow-300 text-yellow-800 rounded-lg text-sm text-center font-medium">
            {redirectMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={inputs.email}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition"
              placeholder="admin@example.com"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              name="password"
              value={inputs.password}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition"
              placeholder="••••••••"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full py-3 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition shadow-lg"
          >
            Access Dashboard
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;