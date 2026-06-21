import React from 'react';
import { Link } from 'react-router-dom';
import { HiOutlineEnvelope, HiOutlineMapPin, HiOutlinePhone } from 'react-icons/hi2';
import { company, navLinks, serviceHighlights, socialLinks } from '../../assets/data/siteData';

export default function Footer() {
  return (
    <footer className="border-t border-brand-steel/30 bg-brand-black">
      <div className="h-1 bg-[repeating-linear-gradient(-45deg,#f5c400,#f5c400_6px,#181818_6px,#181818_12px)]" />
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-4 py-14 sm:px-6 lg:grid-cols-4 lg:px-8">
        <div>
          <h3 className="font-display text-2xl font-bold text-brand-white">
            S N <span className="text-brand-yellow">Enterprises</span>
          </h3>
          <p className="mt-3 text-sm leading-relaxed text-brand-grey-light">{company.description}</p>
          <a
            className="mt-5 inline-flex items-center gap-2 rounded-full border border-brand-yellow/50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-brand-yellow transition hover:bg-brand-yellow hover:text-brand-black"
            href={`https://wa.me/${company.whatsapp.replace('+', '')}`}
            target="_blank"
            rel="noreferrer"
          >
            WhatsApp Support
          </a>
        </div>

        <div>
          <h4 className="font-display text-lg uppercase tracking-[0.14em] text-brand-white">Quick Links</h4>
          <div className="mt-4 space-y-2 text-sm text-brand-grey-light">
            {navLinks.map((item) => (
              <Link key={item.to} className="block transition hover:text-brand-yellow" to={item.to}>
                {item.label}
              </Link>
            ))}
            <a href="/brochure.pdf" target="_blank" rel="noreferrer" className="block transition hover:text-brand-yellow">
              Download Brochure
            </a>
          </div>
        </div>

        <div>
          <h4 className="font-display text-lg uppercase tracking-[0.14em] text-brand-white">Core Services</h4>
          <ul className="mt-4 space-y-2 text-sm text-brand-grey-light">
            {serviceHighlights.map((item) => (
              <li key={item.title}>{item.title}</li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-display text-lg uppercase tracking-[0.14em] text-brand-white">Contact</h4>
          <div className="mt-4 space-y-3 text-sm text-brand-grey-light">
            <p className="flex items-start gap-2">
              <HiOutlineMapPin size={18} className="mt-0.5 text-brand-yellow" />
              <span>{company.address}</span>
            </p>
            <a className="flex items-center gap-2 transition hover:text-brand-yellow" href={`tel:${company.phone.replace(/\s+/g, '')}`}>
              <HiOutlinePhone size={18} className="text-brand-yellow" />
              {company.phone}
            </a>
            <a className="flex items-center gap-2 transition hover:text-brand-yellow" href={`mailto:${company.email}`}>
              <HiOutlineEnvelope size={18} className="text-brand-yellow" />
              {company.email}
            </a>
          </div>
          <div className="mt-5 flex flex-wrap gap-2">
            {socialLinks.map((social) => (
              <a
                key={social.label}
                href={social.url}
                target="_blank"
                rel="noreferrer"
                className="rounded-full border border-brand-steel/60 px-3 py-1 text-xs uppercase tracking-[0.08em] text-brand-grey-light transition hover:border-brand-yellow hover:text-brand-yellow"
              >
                {social.label}
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="border-t border-brand-steel/20">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-4 text-xs text-brand-grey sm:flex-row sm:px-6 lg:px-8">
          <span>Copyright {new Date().getFullYear()} S N Enterprises. All rights reserved.</span>
          <span>Scaffolding Rental & Services | Pune, Maharashtra</span>
        </div>
      </div>
    </footer>
  );
}