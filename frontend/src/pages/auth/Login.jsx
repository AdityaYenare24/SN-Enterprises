import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import AuthLayout from '../../layouts/AuthLayout';
import { loginUser } from '../../services/authService';
import { useAuth } from '../../context/AuthContext';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const redirectPath = location.state?.from || '/';

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!email || !password) {
      toast.error('Please enter email and password.');
      return;
    }

    try {
      setLoading(true);
      const response = await loginUser({ email, password });
      login(response.token, response.user);
      toast.success('Login successful.');
      navigate(response.user?.role === 'admin' ? '/admin/dashboard' : redirectPath, { replace: true });
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Invalid credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Login" subtitle="Access your rental and project dashboard.">
      <form onSubmit={handleSubmit} className="space-y-3">
        <input className="form-input" type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input className="form-input" type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <button className="btn-primary w-full justify-center" type="submit" disabled={loading}>
          {loading ? 'Signing in...' : 'Sign In'}
        </button>
      </form>

      <div className="mt-4 flex items-center justify-between text-xs text-brand-grey-light">
        <Link to="/forgot-password" className="hover:text-brand-yellow">
          Forgot password?
        </Link>
        <Link to="/signup" className="hover:text-brand-yellow">
          Create account
        </Link>
      </div>
    </AuthLayout>
  );
}