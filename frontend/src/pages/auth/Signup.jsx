import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import AuthLayout from '../../layouts/AuthLayout';
import { registerUser } from '../../services/authService';
import { useAuth } from '../../context/AuthContext';

export default function SignupPage() {
  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const onChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmit = async (event) => {
    event.preventDefault();

    if (!form.name || !form.email || !form.password || !form.confirmPassword) {
      toast.error('Please fill all required fields.');
      return;
    }

    if (form.password !== form.confirmPassword) {
      toast.error('Password and confirm password do not match.');
      return;
    }

    try {
      setLoading(true);
      const response = await registerUser(form);
      login(response.token, response.user);
      toast.success('Account created successfully.');
      navigate('/');
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Unable to register right now.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Create Account" subtitle="Register to send and track rental enquiries.">
      <form onSubmit={onSubmit} className="space-y-3">
        <input className="form-input" name="name" placeholder="Full Name*" value={form.name} onChange={onChange} />
        <input className="form-input" name="phone" placeholder="Phone" value={form.phone} onChange={onChange} />
        <input className="form-input" type="email" name="email" placeholder="Email*" value={form.email} onChange={onChange} />
        <input className="form-input" type="password" name="password" placeholder="Password*" value={form.password} onChange={onChange} />
        <input
          className="form-input"
          type="password"
          name="confirmPassword"
          placeholder="Confirm Password*"
          value={form.confirmPassword}
          onChange={onChange}
        />
        <button className="btn-primary w-full justify-center" type="submit" disabled={loading}>
          {loading ? 'Creating account...' : 'Create Account'}
        </button>
      </form>

      <p className="mt-4 text-xs text-brand-grey-light">
        Already have an account?{' '}
        <Link to="/login" className="text-brand-yellow">
          Sign in
        </Link>
      </p>
    </AuthLayout>
  );
}