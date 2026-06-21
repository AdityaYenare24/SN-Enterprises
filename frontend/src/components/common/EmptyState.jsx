import React from 'react';

export default function EmptyState({ title, description, action }) {
  return (
    <div className="rounded-2xl border border-dashed border-brand-steel/40 bg-brand-dark2/60 p-10 text-center">
      <h3 className="font-display text-2xl uppercase tracking-[0.08em] text-brand-white">{title}</h3>
      <p className="mx-auto mt-2 max-w-lg text-sm text-brand-grey-light">{description}</p>
      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  );
}