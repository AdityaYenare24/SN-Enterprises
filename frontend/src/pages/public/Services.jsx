import React from 'react';
import { Link } from 'react-router-dom';
import Seo from '../../components/common/Seo';
import { serviceHighlights } from '../../assets/data/siteData';

const detailedServices = [
  {
    title: 'Scaffolding Rental',
    subtitle: 'Daily to long-term rental models',
    image:
      'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1300&q=80',
    points: [
      'Cuplock, frames, jacks, and shuttering inventory',
      'Flexible billing by day, week, or month',
      'Material issue and return tracking support',
      'On-call replacement for damaged components',
    ],
  },
  {
    title: 'Installation & Dismantling',
    subtitle: 'Certified execution with site supervision',
    image:
      'https://images.unsplash.com/photo-1590644365607-5af4e9ed4ab3?auto=format&fit=crop&w=1300&q=80',
    points: [
      'Pre-start site inspection and access planning',
      'Systematic erection sequence with safety checks',
      'Inspection-ready handover for site teams',
      'Structured dismantling after milestone completion',
    ],
  },
  {
    title: 'Industrial Access Solutions',
    subtitle: 'Plant shutdown and maintenance support',
    image:
      'https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&w=1300&q=80',
    points: [
      'Specialized layouts for confined and elevated work',
      'Critical turnaround mobilization support',
      'High-load and modular configurations',
      'Coordination with maintenance and safety officers',
    ],
  },
  {
    title: 'Inspection & Compliance',
    subtitle: 'Safety-first periodic review framework',
    image:
      'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=1300&q=80',
    points: [
      'Routine structural and fastener checks',
      'Corrective action logs and issue tracking',
      'Risk alerts for overloaded platforms',
      'Inspection reports for client documentation',
    ],
  },
];

const process = [
  'Requirement discussion and project scope mapping',
  'Site survey and material planning',
  'Commercial quote and execution timeline',
  'Mobilization, erection, and compliance handover',
  'Periodic support and final dismantling',
];

export default function ServicesPage() {
  return (
    <>
      <Seo
        title="Services"
        description="End-to-end scaffolding services including rental, installation, industrial support, and safety compliance inspections."
        path="/services"
      />

      <section className="bg-brand-black px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <p className="text-xs uppercase tracking-[0.14em] text-brand-yellow">Core Service Portfolio</p>
          <h1 className="mt-2 max-w-4xl font-display text-5xl uppercase leading-[1.06] text-brand-white sm:text-6xl">
            Rental. Installation.
            <span className="block text-brand-yellow">Industrial support.</span>
          </h1>
          <p className="mt-5 max-w-3xl text-sm text-brand-grey-light sm:text-base">
            Our teams handle the full scaffolding lifecycle with execution discipline and measurable safety controls.
          </p>
        </div>
      </section>

      <section className="bg-brand-dark px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl space-y-6">
          {detailedServices.map((service, index) => (
            <article
              key={service.title}
              className="grid overflow-hidden rounded-3xl border border-brand-steel/30 bg-brand-dark2/80 lg:grid-cols-2"
            >
              <div className={`${index % 2 ? 'lg:order-2' : ''}`}>
                <img src={service.image} alt={service.title} className="h-full w-full object-cover" loading="lazy" />
              </div>
              <div className={`p-6 sm:p-8 ${index % 2 ? 'lg:order-1' : ''}`}>
                <p className="text-xs uppercase tracking-[0.14em] text-brand-yellow">{service.subtitle}</p>
                <h2 className="mt-2 font-display text-3xl uppercase text-brand-white">{service.title}</h2>
                <ul className="mt-4 space-y-2 text-sm text-brand-grey-light">
                  {service.points.map((point) => (
                    <li key={point} className="flex gap-2">
                      <span className="mt-1 h-1.5 w-1.5 rounded-full bg-brand-yellow" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-brand-black px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-2">
          <div>
            <p className="text-xs uppercase tracking-[0.14em] text-brand-yellow">How We Execute</p>
            <h2 className="mt-2 font-display text-4xl uppercase text-brand-white">Project Delivery Process</h2>
            <ol className="mt-5 space-y-3 text-sm text-brand-grey-light">
              {process.map((step, index) => (
                <li key={step} className="rounded-xl border border-brand-steel/30 bg-brand-dark2/70 px-4 py-3">
                  <span className="font-display text-brand-yellow">0{index + 1}.</span> {step}
                </li>
              ))}
            </ol>
          </div>

          <div className="rounded-2xl border border-brand-steel/30 bg-brand-dark2/70 p-6">
            <h3 className="font-display text-3xl uppercase text-brand-white">Need a custom access plan?</h3>
            <p className="mt-3 text-sm text-brand-grey-light">
              We can prepare tailored scaffolding plans for facade, shaft, tank, and industrial shutdown operations.
            </p>
            <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {serviceHighlights.map((item) => (
                <div key={item.title} className="rounded-xl border border-brand-steel/30 bg-brand-dark px-4 py-3">
                  <p className="font-display text-base uppercase text-brand-white">{item.title}</p>
                  <p className="mt-1 text-xs text-brand-grey-light">{item.description}</p>
                </div>
              ))}
            </div>
            <Link className="btn-primary mt-6" to="/contact">
              Request Service Proposal
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}