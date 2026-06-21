import React from 'react';
import { Outlet } from 'react-router-dom';
import { HiOutlineArrowRightOnRectangle } from 'react-icons/hi2';
import AdminSidebar from '../components/admin/AdminSidebar';
import { useAuth } from '../context/AuthContext';

export default function AdminLayout() {
  const { logout, user } = useAuth();

  return (
    <div className="min-h-screen bg-brand-black text-brand-white">
      <div className="mx-auto grid min-h-screen max-w-[1400px] grid-cols-1 lg:grid-cols-[260px_1fr]">
        <AdminSidebar />
        <div className="border-l border-brand-steel/30 bg-brand-dark/60">
          <header className="sticky top-0 z-20 flex items-center justify-between border-b border-brand-steel/30 bg-brand-dark/90 px-5 py-4 backdrop-blur sm:px-8">
            <div>
              <p className="font-display text-lg uppercase tracking-[0.12em] text-brand-white">Admin Dashboard</p>
              <p className="text-xs text-brand-grey-light">Welcome, {user?.name || 'Administrator'}</p>
            </div>
            <button
              type="button"
              onClick={logout}
              className="inline-flex items-center gap-2 rounded-full border border-brand-steel/50 px-4 py-2 text-xs uppercase tracking-[0.12em] text-brand-grey-light transition hover:border-brand-yellow hover:text-brand-yellow"
            >
              <HiOutlineArrowRightOnRectangle size={16} />
              Logout
            </button>
          </header>
          <main className="px-5 py-6 sm:px-8">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}