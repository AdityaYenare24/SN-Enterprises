import React from 'react';
import { Link } from 'react-router-dom';
import Seo from '../../components/common/Seo';

export default function NotFoundPage() {
  return (
    <>
      <Seo title="Page Not Found" path="/404" />
      <section className="bg-brand-black px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs uppercase tracking-[0.14em] text-brand-yellow">404</p>
          <h1 className="mt-3 font-display text-5xl uppercase text-brand-white">Page not found</h1>
          <p className="mt-4 text-sm text-brand-grey-light">The page you are looking for is unavailable or moved.</p>
          <Link className="btn-primary mt-6" to="/">
            Back to Home
          </Link>
        </div>
      </section>
    </>
  );
}