import React, { useEffect, useState } from 'react';
import { HiOutlineArrowLongUp } from 'react-icons/hi2';

export default function ScrollToTopButton() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 320);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  if (!visible) return null;

  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      className="fixed bottom-20 right-5 z-50 inline-flex h-11 w-11 items-center justify-center rounded-full border border-brand-yellow/70 bg-brand-black text-brand-yellow shadow-lg transition hover:-translate-y-1"
      aria-label="Scroll to top"
    >
      <HiOutlineArrowLongUp size={20} />
    </button>
  );
}