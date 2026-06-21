import React from 'react';

export default function StatCard({ label, value, accent = 'yellow', subtext }) {
  const accents = {
    yellow: 'from-brand-yellow/20 to-brand-yellow/5 border-brand-yellow/40',
    blue: 'from-sky-500/20 to-sky-500/5 border-sky-400/40',
    green: 'from-emerald-500/20 to-emerald-500/5 border-emerald-400/40',
    orange: 'from-orange-500/20 to-orange-500/5 border-orange-400/40',
  };

  return (
    <div className={`rounded-2xl border bg-gradient-to-br p-5 ${accents[accent] || accents.yellow}`}>
      <p className="text-xs uppercase tracking-[0.14em] text-brand-grey-light">{label}</p>
      <p className="mt-2 font-display text-4xl text-brand-white">{value}</p>
      {subtext ? <p className="mt-2 text-xs text-brand-grey-light">{subtext}</p> : null}
    </div>
  );
}