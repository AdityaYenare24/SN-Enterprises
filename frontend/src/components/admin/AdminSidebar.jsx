import React from 'react';
import { NavLink } from 'react-router-dom';
import { HiOutlineChartBarSquare, HiOutlineClipboardDocumentList, HiOutlineCube, HiOutlineUsers } from 'react-icons/hi2';

const links = [
  { to: '/admin/dashboard', label: 'Overview', icon: HiOutlineChartBarSquare },
  { to: '/admin/products', label: 'Products', icon: HiOutlineCube },
  { to: '/admin/bookings', label: 'Bookings', icon: HiOutlineClipboardDocumentList },
  { to: '/admin/users', label: 'Users', icon: HiOutlineUsers },
];

export default function AdminSidebar() {
  return (
    <aside className="border-r border-brand-steel/30 bg-brand-dark px-4 py-6 sm:px-6 lg:min-h-screen lg:px-5">
      <div className="mb-8">
        <p className="font-display text-xl uppercase tracking-[0.12em] text-brand-white">
          S N <span className="text-brand-yellow">Admin</span>
        </p>
        <p className="mt-1 text-xs uppercase tracking-[0.14em] text-brand-grey-light">Control Center</p>
      </div>

      <nav className="space-y-1">
        {links.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-3 py-3 text-sm uppercase tracking-[0.08em] transition ${
                  isActive
                    ? 'bg-brand-yellow text-brand-black'
                    : 'text-brand-grey-light hover:bg-brand-steel/20 hover:text-brand-yellow'
                }`
              }
            >
              <Icon size={18} />
              {item.label}
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
}
