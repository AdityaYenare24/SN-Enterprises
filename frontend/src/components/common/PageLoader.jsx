import React from 'react';

export default function PageLoader({ label = 'Loading...' }) {
  return (
    <div className="flex min-h-[280px] flex-col items-center justify-center gap-4 text-brand-grey-light">
      <div className="relative h-12 w-12">
        <span className="absolute inset-0 rounded-full border-2 border-brand-yellow/40" />
        <span className="absolute inset-0 animate-spin rounded-full border-2 border-transparent border-t-brand-yellow" />
      </div>
      <p className="font-body text-sm uppercase tracking-[0.16em]">{label}</p>
    </div>
  );
}