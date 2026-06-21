import React from 'react';
import { Link } from 'react-router-dom';
import { HiOutlineCalendarDays, HiOutlineCheckCircle, HiOutlineXCircle } from 'react-icons/hi2';
import { formatCurrency } from '../../utils/format';

export default function ProductCard({ product }) {
  const isAvailable = product.availabilityStatus !== 'Out of Stock';

  return (
    <article className="group overflow-hidden rounded-2xl border border-brand-steel/30 bg-brand-dark2/80 transition hover:-translate-y-1 hover:border-brand-yellow/50 hover:shadow-card">
      <div className="relative h-52 overflow-hidden">
        <img
          src={product.images?.[0] || 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=900&q=80'}
          alt={product.name}
          loading="lazy"
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />
        <span className="absolute left-3 top-3 rounded-full bg-brand-black/75 px-3 py-1 text-[11px] uppercase tracking-[0.11em] text-brand-yellow">
          {product.category}
        </span>
      </div>

      <div className="p-4">
        <h3 className="font-display text-xl uppercase tracking-[0.06em] text-brand-white">{product.name}</h3>
        <p className="mt-2 line-clamp-2 text-sm text-brand-grey-light">{product.description}</p>

        <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-brand-grey-light">
          <p className="rounded-lg border border-brand-steel/40 px-2 py-1">Day: {formatCurrency(product.pricePerDay)}</p>
          <p className="rounded-lg border border-brand-steel/40 px-2 py-1">Week: {formatCurrency(product.pricePerWeek)}</p>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <span
            className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs uppercase tracking-[0.08em] ${
              isAvailable
                ? 'bg-emerald-600/15 text-emerald-300'
                : 'bg-red-600/15 text-red-300'
            }`}
          >
            {isAvailable ? <HiOutlineCheckCircle size={14} /> : <HiOutlineXCircle size={14} />}
            {product.availabilityStatus}
          </span>

          <span className="inline-flex items-center gap-1 text-xs text-brand-grey-light">
            <HiOutlineCalendarDays size={14} />
            Qty {product.quantity}
          </span>
        </div>

        <Link
          to={`/products/${product._id || product.id || product.slug}`}
          className="mt-4 inline-flex w-full items-center justify-center rounded-full bg-brand-yellow px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-brand-black transition hover:bg-brand-yellow-dark"
        >
          View Details
        </Link>
      </div>
    </article>
  );
}