import React from 'react';
import { Link } from 'react-router-dom';

export default function AuthLayout({ title, subtitle, children }) {
  return (
    <div className="grid min-h-screen grid-cols-1 bg-brand-black text-brand-white lg:grid-cols-2">
      <aside className="relative hidden overflow-hidden border-r border-brand-steel/30 bg-brand-dark lg:flex lg:flex-col lg:justify-between lg:p-12">
        <img
          src="https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1300&q=80"
          alt="Scaffolding site"
          className="absolute inset-0 h-full w-full object-cover opacity-20"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-brand-black via-brand-black/80 to-brand-dark" />
        <div className="relative z-10">
          <Link to="/" className="inline-flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-md bg-brand-yellow font-display text-xl font-bold text-brand-black">
              SN
            </span>
            <span className="font-display text-2xl uppercase tracking-wider">
              S N <span className="text-brand-yellow">Enterprises</span>
            </span>
          </Link>
          <h2 className="mt-16 max-w-md font-display text-5xl uppercase leading-tight text-brand-white">
            Built for safe
            <span className="block text-brand-yellow">industrial access</span>
          </h2>
          <p className="mt-4 max-w-md text-brand-grey-light">
            Login to manage products, enquiries, and customer communication from one production-ready control panel.
          </p>
        </div>
        <p className="relative z-10 text-xs uppercase tracking-[0.14em] text-brand-grey-light">
          Pune | Maharashtra | India
        </p>
      </aside>

      <section className="flex items-center justify-center px-5 py-10 sm:px-8 lg:px-14">
        <div className="w-full max-w-md rounded-2xl border border-brand-steel/30 bg-brand-dark2/80 p-6 shadow-2xl sm:p-8">
          <h1 className="font-display text-3xl uppercase tracking-[0.1em] text-brand-white">{title}</h1>
          {subtitle ? <p className="mt-2 text-sm text-brand-grey-light">{subtitle}</p> : null}
          <div className="mt-6">{children}</div>
        </div>
      </section>
    </div>
  );
}