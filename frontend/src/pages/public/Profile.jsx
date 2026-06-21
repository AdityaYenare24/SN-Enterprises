import React from 'react';
import Seo from '../../components/common/Seo';
import { useAuth } from '../../context/AuthContext';

export default function ProfilePage() {
  const { user } = useAuth();

  return (
    <>
      <Seo title="My Account" path="/profile" />
      <section className="bg-brand-black px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl rounded-2xl border border-brand-steel/30 bg-brand-dark2/70 p-6 sm:p-8">
          <p className="text-xs uppercase tracking-[0.14em] text-brand-yellow">Account</p>
          <h1 className="mt-2 font-display text-4xl uppercase text-brand-white">Welcome, {user?.name}</h1>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl border border-brand-steel/30 bg-brand-dark px-4 py-3">
              <p className="text-xs uppercase tracking-[0.12em] text-brand-grey">Email</p>
              <p className="mt-1 text-sm text-brand-white">{user?.email}</p>
            </div>
            <div className="rounded-xl border border-brand-steel/30 bg-brand-dark px-4 py-3">
              <p className="text-xs uppercase tracking-[0.12em] text-brand-grey">Phone</p>
              <p className="mt-1 text-sm text-brand-white">{user?.phone || 'Not provided'}</p>
            </div>
            <div className="rounded-xl border border-brand-steel/30 bg-brand-dark px-4 py-3">
              <p className="text-xs uppercase tracking-[0.12em] text-brand-grey">Role</p>
              <p className="mt-1 text-sm text-brand-white">{user?.role}</p>
            </div>
          </div>
          <p className="mt-6 text-sm text-brand-grey-light">
            To raise a new rental request, browse products and submit enquiry from product details. Our operations team will contact you shortly.
          </p>
        </div>
      </section>
    </>
  );
}