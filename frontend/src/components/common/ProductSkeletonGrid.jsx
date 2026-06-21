import React from 'react';

export default function ProductSkeletonGrid({ count = 6 }) {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="overflow-hidden rounded-2xl border border-brand-steel/30 bg-brand-dark2/90">
          <div className="h-44 animate-pulse bg-brand-steel/30" />
          <div className="space-y-3 p-4">
            <div className="h-4 w-2/3 animate-pulse rounded bg-brand-steel/40" />
            <div className="h-3 w-full animate-pulse rounded bg-brand-steel/30" />
            <div className="h-3 w-5/6 animate-pulse rounded bg-brand-steel/30" />
            <div className="h-8 w-1/2 animate-pulse rounded bg-brand-yellow/20" />
          </div>
        </div>
      ))}
    </div>
  );
}