import React from 'react';
import { HiMiniMoon, HiMiniSun } from 'react-icons/hi2';
import { useTheme } from '../../context/ThemeContext';

export default function ThemeToggle() {
  const { isDark, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="rounded-full border border-brand-steel/50 bg-brand-dark2/80 p-2 text-brand-grey-light transition hover:border-brand-yellow hover:text-brand-yellow"
      aria-label="Toggle theme"
      title="Toggle theme"
    >
      {isDark ? <HiMiniSun size={18} /> : <HiMiniMoon size={18} />}
    </button>
  );
}