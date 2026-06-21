import React, { useEffect, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { HiBars3BottomRight, HiOutlinePhone, HiOutlineXMark } from 'react-icons/hi2';
import { company, navLinks } from '../../assets/data/siteData';
import { useAuth } from '../../context/AuthContext';
import ThemeToggle from './ThemeToggle';

const activeClass = 'text-brand-yellow';
const baseClass = 'transition hover:text-brand-yellow';

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { isAuthenticated, isAdmin, logout, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 16);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) setOpen(false);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleLogout = () => {
    logout();
    setOpen(false);
    navigate('/');
  };

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div className="bg-brand-yellow px-4 py-1 text-center text-xs font-medium text-brand-black md:text-sm">
        <span className="inline-flex items-center gap-2">
          <HiOutlinePhone size={14} />
          <a className="font-semibold" href={`tel:${company.phone.replace(/\s+/g, '')}`}>
            {company.phone}
          </a>
          <span className="hidden sm:inline">|</span>
          <a className="hidden sm:inline" href={`mailto:${company.email}`}>
            {company.email}
          </a>
        </span>
      </div>

      <nav
        className={`transition-all duration-300 ${
          scrolled
            ? 'border-b border-brand-steel/40 bg-brand-black/95 shadow-2xl backdrop-blur'
            : 'bg-brand-black/80'
        }`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
          <Link className="group flex items-center gap-3" to="/" onClick={() => setOpen(false)}>
            <div className="flex h-10 w-10 items-center justify-center rounded-md bg-brand-yellow font-display text-xl font-bold text-brand-black">
              SN
            </div>
            <div>
              <p className="font-display text-lg font-bold uppercase tracking-wide text-brand-white">
                S N <span className="text-brand-yellow">Enterprises</span>
              </p>
              <p className="text-[10px] uppercase tracking-[0.26em] text-brand-grey-light">Scaffolding Rental</p>
            </div>
          </Link>

          <div className="hidden items-center gap-6 font-body text-sm uppercase tracking-[0.1em] text-brand-grey-light lg:flex">
            {navLinks.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) => `${baseClass} ${isActive ? activeClass : ''}`}
              >
                {item.label}
              </NavLink>
            ))}
            <a className="btn-outline !px-4 !py-2 text-xs" href="/brochure.pdf" target="_blank" rel="noreferrer">
              Brochure
            </a>
            <ThemeToggle />
            {isAuthenticated ? (
              <>
                <Link to={isAdmin ? '/admin/dashboard' : '/profile'} className="btn-primary !px-4 !py-2 text-xs">
                  {isAdmin ? 'Admin Panel' : user?.name?.split(' ')[0] || 'Dashboard'}
                </Link>
                <button className="text-xs text-brand-grey-light transition hover:text-brand-yellow" onClick={handleLogout}>
                  Logout
                </button>
              </>
            ) : (
              <Link to="/login" className="btn-primary !px-4 !py-2 text-xs">
                Login
              </Link>
            )}
          </div>

          <div className="flex items-center gap-3 lg:hidden">
            <ThemeToggle />
            <button
              type="button"
              className="rounded-md border border-brand-steel/60 p-2 text-brand-white"
              onClick={() => setOpen((value) => !value)}
              aria-label="Toggle menu"
            >
              {open ? <HiOutlineXMark size={20} /> : <HiBars3BottomRight size={20} />}
            </button>
          </div>
        </div>

        <div
          className={`overflow-hidden border-t border-brand-steel/30 bg-brand-dark lg:hidden ${
            open ? 'max-h-[600px]' : 'max-h-0'
          } transition-all duration-300`}
        >
          <div className="space-y-1 px-4 py-4 text-sm uppercase tracking-[0.08em] text-brand-grey-light sm:px-6">
            {navLinks.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `block rounded-md px-3 py-3 transition hover:bg-brand-steel/20 hover:text-brand-yellow ${
                    isActive ? 'bg-brand-steel/20 text-brand-yellow' : ''
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}

            <a className="block rounded-md px-3 py-3 transition hover:bg-brand-steel/20 hover:text-brand-yellow" href="/brochure.pdf" target="_blank" rel="noreferrer" onClick={() => setOpen(false)}>
              Download Brochure
            </a>

            {isAuthenticated ? (
              <>
                <Link
                  className="block rounded-md px-3 py-3 transition hover:bg-brand-steel/20 hover:text-brand-yellow"
                  to={isAdmin ? '/admin/dashboard' : '/profile'}
                  onClick={() => setOpen(false)}
                >
                  {isAdmin ? 'Admin Panel' : 'My Account'}
                </Link>
                <button
                  className="block w-full rounded-md px-3 py-3 text-left transition hover:bg-brand-steel/20 hover:text-brand-yellow"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                className="block rounded-md bg-brand-yellow px-3 py-3 font-semibold text-brand-black"
                to="/login"
                onClick={() => setOpen(false)}
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}