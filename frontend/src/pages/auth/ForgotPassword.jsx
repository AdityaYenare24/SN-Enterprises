import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import AuthLayout from '../../layouts/AuthLayout';
import { forgotPassword } from '../../services/authService';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [devUrl, setDevUrl] = useState('');

  const onSubmit = async (event) => {
    event.preventDefault();
    if (!email) {
      toast.error('Please enter your email address.');
      return;
    }

    try {
      setLoading(true);
      const response = await forgotPassword({ email });
      setDevUrl(response._devResetUrl || '');
      toast.success(response.message || 'Reset instructions sent.');
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Unable to process request.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Forgot Password" subtitle="Enter your registered email to receive reset link.">
      <form onSubmit={onSubmit} className="space-y-3">
        <input className="form-input" type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <button className="btn-primary w-full justify-center" type="submit" disabled={loading}>
          {loading ? 'Sending...' : 'Send Reset Link'}
        </button>
      </form>

      {devUrl ? (
        <div className="mt-4 rounded-xl border border-brand-yellow/30 bg-brand-yellow/10 p-3 text-xs text-brand-yellow">
          Dev reset link: <a href={devUrl}>{devUrl}</a>
        </div>
      ) : null}

      <p className="mt-4 text-xs text-brand-grey-light">
        Back to{' '}
        <Link to="/login" className="text-brand-yellow">
          login
        </Link>
      </p>
    </AuthLayout>
  );
}