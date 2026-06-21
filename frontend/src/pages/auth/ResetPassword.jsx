import React, { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import AuthLayout from '../../layouts/AuthLayout';
import { resetPassword } from '../../services/authService';
import { useAuth } from '../../context/AuthContext';

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { token } = useParams();
  const navigate = useNavigate();
  const { login } = useAuth();

  const onSubmit = async (event) => {
    event.preventDefault();

    if (!password || !confirmPassword) {
      toast.error('Please enter password and confirm password.');
      return;
    }

    if (password !== confirmPassword) {
      toast.error('Password and confirm password do not match.');
      return;
    }

    try {
      setLoading(true);
      const response = await resetPassword({ password, confirmPassword }, token);
      if (response.token && response.user) {
        login(response.token, response.user);
      }
      toast.success(response.message || 'Password reset successful.');
      navigate('/');
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Unable to reset password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Reset Password" subtitle="Set your new password and continue.">
      <form onSubmit={onSubmit} className="space-y-3">
        <input className="form-input" type="password" placeholder="New Password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <input
          className="form-input"
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        <button className="btn-primary w-full justify-center" type="submit" disabled={loading}>
          {loading ? 'Resetting...' : 'Reset Password'}
        </button>
      </form>

      <p className="mt-4 text-xs text-brand-grey-light">
        Back to{' '}
        <Link to="/login" className="text-brand-yellow">
          login
        </Link>
      </p>
    </AuthLayout>
  );
}