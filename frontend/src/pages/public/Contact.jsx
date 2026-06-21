import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { HiOutlineClock, HiOutlineEnvelope, HiOutlineMapPin, HiOutlinePhone } from 'react-icons/hi2';
import Seo from '../../components/common/Seo';
import { company } from '../../assets/data/siteData';
import { sendContactMessage } from '../../services/contactService';

const initialForm = {
  name: '',
  phone: '',
  email: '',
  companyName: '',
  subject: 'General enquiry',
  message: '',
};

export default function ContactPage() {
  const [form, setForm] = useState(initialForm);
  const [submitting, setSubmitting] = useState(false);

  const onChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmit = async (event) => {
    event.preventDefault();

    if (!form.name || !form.phone || !form.email || !form.message) {
      toast.error('Please fill all required fields.');
      return;
    }

    try {
      setSubmitting(true);
      const response = await sendContactMessage(form);
      toast.success(response.message || 'Message sent successfully.');
      setForm(initialForm);
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Unable to send message right now.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Seo
        title="Contact"
        description="Contact S N Enterprises for scaffolding rental quotes, industrial support, and project consultations in Pune and Maharashtra."
        path="/contact"
      />

      <section className="bg-brand-black px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <p className="text-xs uppercase tracking-[0.14em] text-brand-yellow">Get in touch</p>
          <h1 className="mt-2 font-display text-5xl uppercase text-brand-white sm:text-6xl">Contact S N Enterprises</h1>
          <p className="mt-4 max-w-3xl text-sm text-brand-grey-light sm:text-base">
            Share your project scope and rental duration. Our team responds within 24 hours with a practical plan and quotation.
          </p>
        </div>
      </section>

      <section className="bg-brand-dark px-4 pb-16 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[1fr_1.15fr]">
          <div className="space-y-4">
            <article className="rounded-2xl border border-brand-steel/30 bg-brand-dark2/70 p-5">
              <p className="flex items-center gap-2 text-xs uppercase tracking-[0.12em] text-brand-yellow">
                <HiOutlinePhone size={15} /> Phone
              </p>
              <a className="mt-2 block text-sm text-brand-grey-light" href={`tel:${company.phone.replace(/\s+/g, '')}`}>
                {company.phone}
              </a>
            </article>

            <article className="rounded-2xl border border-brand-steel/30 bg-brand-dark2/70 p-5">
              <p className="flex items-center gap-2 text-xs uppercase tracking-[0.12em] text-brand-yellow">
                <HiOutlineEnvelope size={15} /> Email
              </p>
              <a className="mt-2 block text-sm text-brand-grey-light" href={`mailto:${company.email}`}>
                {company.email}
              </a>
            </article>

            <article className="rounded-2xl border border-brand-steel/30 bg-brand-dark2/70 p-5">
              <p className="flex items-center gap-2 text-xs uppercase tracking-[0.12em] text-brand-yellow">
                <HiOutlineMapPin size={15} /> Address
              </p>
              <p className="mt-2 text-sm text-brand-grey-light">{company.address}</p>
            </article>

            <article className="rounded-2xl border border-brand-steel/30 bg-brand-dark2/70 p-5">
              <p className="flex items-center gap-2 text-xs uppercase tracking-[0.12em] text-brand-yellow">
                <HiOutlineClock size={15} /> Business Hours
              </p>
              <ul className="mt-2 space-y-1 text-sm text-brand-grey-light">
                {company.businessHours.map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ul>
            </article>

            <a
              href={`https://wa.me/${company.whatsapp.replace('+', '')}?text=Hello%20S%20N%20Enterprises%2C%20I%20need%20a%20scaffolding%20quote.`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex w-full items-center justify-center rounded-xl bg-[#25D366] px-5 py-3 text-sm font-semibold text-white"
            >
              Chat on WhatsApp
            </a>
          </div>

          <div className="space-y-4">
            <form onSubmit={onSubmit} className="rounded-2xl border border-brand-steel/30 bg-brand-dark2/70 p-6">
              <h2 className="font-display text-3xl uppercase text-brand-white">Send message</h2>
              <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                <input name="name" value={form.name} onChange={onChange} className="form-input" placeholder="Name*" />
                <input name="phone" value={form.phone} onChange={onChange} className="form-input" placeholder="Phone*" />
                <input name="email" value={form.email} onChange={onChange} className="form-input" placeholder="Email*" />
                <input name="companyName" value={form.companyName} onChange={onChange} className="form-input" placeholder="Company" />
              </div>
              <input name="subject" value={form.subject} onChange={onChange} className="form-input mt-3" placeholder="Subject" />
              <textarea
                name="message"
                value={form.message}
                onChange={onChange}
                className="form-input mt-3 min-h-[150px] resize-y"
                placeholder="Message*"
              />
              <button type="submit" disabled={submitting} className="btn-primary mt-4 w-full justify-center disabled:opacity-70">
                {submitting ? 'Sending...' : 'Send Message'}
              </button>
            </form>

            <div className="overflow-hidden rounded-2xl border border-brand-steel/30">
              <iframe
                title="Company location"
                src={company.mapEmbed}
                width="100%"
                height="320"
                loading="lazy"
                style={{ border: 0 }}
                allowFullScreen
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}