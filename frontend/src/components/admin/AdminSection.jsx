import React from 'react';

export default function AdminSection({ title, subtitle, rightSlot, children }) {
  return (
    <section className="rounded-2xl border border-brand-steel/30 bg-brand-dark2/70 p-5 sm:p-6">
      <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="font-display text-2xl uppercase tracking-[0.1em] text-brand-white">{title}</h2>
          {subtitle ? <p className="mt-1 text-sm text-brand-grey-light">{subtitle}</p> : null}
        </div>
        {rightSlot ? <div>{rightSlot}</div> : null}
      </div>
      {children}
    </section>
  );
}