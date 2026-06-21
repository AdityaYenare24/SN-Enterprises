import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Seo from '../../components/common/Seo';
import { company } from '../../assets/data/siteData';

const milestones = [
  { year: '2010', title: 'Founded in Pune', desc: 'Started as a local scaffolding supplier for mid-rise projects.' },
  { year: '2014', title: 'Industrial Expansion', desc: 'Entered plant maintenance and heavy industrial access projects.' },
  { year: '2018', title: 'Safety Program Upgrade', desc: 'Introduced dedicated safety checklists and inspection cycles.' },
  { year: '2022', title: 'Large Fleet Modernization', desc: 'Scaled inventory across cuplock, props, jacks, and walkway systems.' },
  { year: '2026', title: 'Digital Rental Platform', desc: 'Launched end-to-end enquiry and admin management platform.' },
];

const leadership = [
  {
    name: 'Suraj Nanvare',
    role: 'Co-Founder | Operations Lead',
    about: 'Leads execution, logistics, and on-site delivery programs for high-priority projects.',
  },
  {
    name: 'Harshad Kumbhar',
    role: 'Co-Founder | Technical Lead',
    about: 'Oversees structural planning, safety controls, and technical quality for rental systems.',
  },
];

export default function AboutPage() {
  return (
    <>
      <Seo
        title="About Us"
        description="Learn about S N Enterprises, our leadership, safety-first process, and scaffolding execution capabilities across Pune and Maharashtra."
        path="/about"
      />

      <section className="relative overflow-hidden bg-brand-black px-4 py-16 sm:px-6 lg:px-8">
        <div className="absolute right-0 top-0 h-80 w-80 rounded-full bg-brand-yellow/20 blur-3xl" />
        <div className="mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-2">
          <div>
            <p className="text-xs uppercase tracking-[0.14em] text-brand-yellow">About S N Enterprises</p>
            <h1 className="mt-2 font-display text-5xl uppercase leading-[1.06] text-brand-white sm:text-6xl">
              Built on trust.
              <span className="block text-brand-yellow">Engineered for safety.</span>
            </h1>
            <p className="mt-5 text-sm leading-relaxed text-brand-grey-light sm:text-base">{company.description}</p>
            <p className="mt-3 text-sm leading-relaxed text-brand-grey-light">
              We partner with builders, EPC contractors, and maintenance teams to deliver dependable access systems with clear planning, strict safety, and predictable commercial outcomes.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link className="btn-primary" to="/contact">
                Talk to Our Team
              </Link>
              <Link className="btn-outline" to="/products">
                View Product Range
              </Link>
            </div>
          </div>
          <div className="overflow-hidden rounded-2xl border border-brand-steel/30">
            <img
              src="https://images.unsplash.com/photo-1599707367072-cd6ada2bc375?auto=format&fit=crop&w=1200&q=80"
              alt="Scaffolding team at project site"
              className="h-[420px] w-full object-cover"
              loading="lazy"
            />
          </div>
        </div>
      </section>

      <section className="bg-brand-dark px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <p className="text-center text-xs uppercase tracking-[0.14em] text-brand-yellow">Company Journey</p>
          <h2 className="mt-2 text-center font-display text-4xl uppercase text-brand-white">Milestones</h2>
          <div className="mt-8 space-y-4">
            {milestones.map((item, index) => (
              <motion.article
                key={item.year}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{ delay: index * 0.05 }}
                className="rounded-2xl border border-brand-steel/30 bg-brand-dark2/75 p-5"
              >
                <p className="text-xs uppercase tracking-[0.14em] text-brand-yellow">{item.year}</p>
                <h3 className="mt-1 font-display text-2xl uppercase text-brand-white">{item.title}</h3>
                <p className="mt-2 text-sm text-brand-grey-light">{item.desc}</p>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-brand-black px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <h2 className="text-center font-display text-4xl uppercase text-brand-white">Leadership</h2>
          <div className="mx-auto mt-8 grid max-w-4xl grid-cols-1 gap-4 md:grid-cols-2">
            {leadership.map((person) => (
              <article key={person.name} className="rounded-2xl border border-brand-steel/30 bg-brand-dark2/70 p-6 text-center">
                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border border-brand-yellow/50 bg-brand-yellow/10 font-display text-2xl text-brand-yellow">
                  {person.name
                    .split(' ')
                    .map((part) => part[0])
                    .join('')}
                </div>
                <h3 className="mt-4 font-display text-2xl uppercase text-brand-white">{person.name}</h3>
                <p className="text-xs uppercase tracking-[0.13em] text-brand-yellow">{person.role}</p>
                <p className="mt-3 text-sm text-brand-grey-light">{person.about}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}