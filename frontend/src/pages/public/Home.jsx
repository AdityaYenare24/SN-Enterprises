import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  blogPosts,
  company,
  faqs,
  stats,
  testimonials,
  trustedClients,
  whyChooseUs,
} from '../../assets/data/siteData';
import Seo from '../../components/common/Seo';
import ProductCard from '../../components/products/ProductCard';
import ProductSkeletonGrid from '../../components/common/ProductSkeletonGrid';
import EmptyState from '../../components/common/EmptyState';
import useCountUp from '../../hooks/useCountUp';
import { fetchProducts } from '../../services/productService';

function StatCounter({ item }) {
  const count = useCountUp(item.value, 1200);
  return (
    <div className="rounded-2xl border border-brand-steel/40 bg-brand-dark2/80 p-5 text-center">
      <p className="font-display text-4xl text-brand-yellow">
        {count}
        {item.suffix}
      </p>
      <p className="mt-1 text-xs uppercase tracking-[0.14em] text-brand-grey-light">{item.label}</p>
    </div>
  );
}

export default function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoadingProducts(true);
      try {
        const response = await fetchProducts({ featured: true, limit: 6, sort: 'latest' });
        setFeaturedProducts(response.data || []);
      } catch (_error) {
        setFeaturedProducts([]);
      } finally {
        setLoadingProducts(false);
      }
    };

    load();
  }, []);

  return (
    <>
      <Seo
        title="Scaffolding Rental Platform"
        description="Premium scaffolding material rental and industrial access services by S N Enterprises in Pune and Maharashtra."
        keywords={[
          'scaffolding rental pune',
          'cuplock scaffolding',
          'industrial scaffolding services',
          'scaffolding company maharashtra',
        ]}
      />

      <section className="relative isolate overflow-hidden bg-brand-black">
        <img
          src="https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1800&q=80"
          alt="Scaffolding construction hero"
          className="absolute inset-0 -z-20 h-full w-full object-cover opacity-25"
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-brand-black via-brand-black/90 to-brand-black/50" />
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_20%_20%,rgba(245,196,0,.2),transparent_36%)]" />

        <div className="mx-auto flex min-h-[86vh] max-w-7xl flex-col justify-center px-4 py-16 sm:px-6 lg:px-8">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-5 inline-flex w-fit rounded-full border border-brand-yellow/40 bg-brand-yellow/10 px-4 py-2 text-xs uppercase tracking-[0.14em] text-brand-yellow"
          >
            Trusted Industrial Access Partner
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08 }}
            className="max-w-4xl font-display text-5xl uppercase leading-[1.02] text-brand-white sm:text-6xl lg:text-7xl"
          >
            Safe, Fast, and
            <span className="block text-brand-yellow">Production-Ready Scaffolding Rentals</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.16 }}
            className="mt-5 max-w-2xl text-base leading-relaxed text-brand-grey-light sm:text-lg"
          >
            {company.description} From facade work to refinery shutdowns, our teams deliver engineered access solutions with strict compliance and zero compromise on safety.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.22 }}
            className="mt-8 flex flex-wrap gap-3"
          >
            <Link to="/products" className="btn-primary">
              Explore Rental Products
            </Link>
            <Link to="/contact" className="btn-outline">
              Request Site Quote
            </Link>
            <a
              href="/brochure.pdf"
              className="rounded-full border border-brand-steel/50 px-5 py-3 text-xs font-semibold uppercase tracking-[0.12em] text-brand-grey-light transition hover:border-brand-yellow hover:text-brand-yellow"
              target="_blank"
              rel="noreferrer"
            >
              Download Brochure
            </a>
          </motion.div>
        </div>
      </section>

      <section className="bg-brand-dark px-4 py-14 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-4 lg:grid-cols-4">
          {stats.map((item) => (
            <StatCounter key={item.label} item={item} />
          ))}
        </div>
      </section>

      <section className="bg-brand-black px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-[0.16em] text-brand-yellow">Featured Inventory</p>
              <h2 className="mt-2 font-display text-4xl uppercase text-brand-white">Top Rental Products</h2>
            </div>
            <Link className="text-sm uppercase tracking-[0.12em] text-brand-yellow hover:underline" to="/products">
              View all products
            </Link>
          </div>

          {loadingProducts ? (
            <ProductSkeletonGrid count={6} />
          ) : featuredProducts.length ? (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {featuredProducts.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          ) : (
            <EmptyState
              title="Products are being updated"
              description="Our featured scaffolding inventory will appear here shortly. Contact us for immediate rental requirements."
              action={
                <Link className="btn-primary" to="/contact">
                  Talk to Team
                </Link>
              }
            />
          )}
        </div>
      </section>

      <section className="bg-brand-dark px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <p className="text-xs uppercase tracking-[0.16em] text-brand-yellow">Why Choose Us</p>
          <h2 className="mt-2 max-w-3xl font-display text-4xl uppercase text-brand-white">Built for reliability on high-pressure job sites</h2>
          <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {whyChooseUs.map((item) => (
              <motion.article
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.25 }}
                className="rounded-2xl border border-brand-steel/40 bg-brand-dark2/80 p-5"
              >
                <h3 className="font-display text-xl uppercase text-brand-white">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-brand-grey-light">{item.description}</p>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-brand-black px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-3">
          {testimonials.map((item) => (
            <article key={item.name} className="rounded-2xl border border-brand-steel/30 bg-brand-dark2/70 p-6">
              <p className="text-sm leading-relaxed text-brand-grey-light">"{item.quote}"</p>
              <div className="mt-4 border-t border-brand-steel/40 pt-4">
                <p className="font-display text-lg uppercase text-brand-white">{item.name}</p>
                <p className="text-xs uppercase tracking-[0.12em] text-brand-yellow">{item.role}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-brand-dark px-4 py-14 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <p className="text-center text-xs uppercase tracking-[0.16em] text-brand-yellow">Trusted by leading project teams</p>
          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {trustedClients.map((client) => (
              <div key={client} className="rounded-xl border border-brand-steel/30 bg-brand-dark2/80 px-3 py-4 text-center text-xs uppercase tracking-[0.1em] text-brand-grey-light">
                {client}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-brand-black px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-2">
          <div>
            <p className="text-xs uppercase tracking-[0.16em] text-brand-yellow">Frequently Asked Questions</p>
            <h2 className="mt-2 font-display text-4xl uppercase text-brand-white">Rental FAQs</h2>
            <p className="mt-3 max-w-xl text-sm text-brand-grey-light">
              Quick answers about deployment timelines, site execution, and rental planning.
            </p>
            <Link className="mt-6 inline-flex text-xs uppercase tracking-[0.12em] text-brand-yellow hover:underline" to="/contact">
              Need a custom answer? Contact our engineers.
            </Link>
          </div>
          <div className="space-y-3">
            {faqs.map((faq) => (
              <details key={faq.question} className="rounded-xl border border-brand-steel/30 bg-brand-dark2/70 p-4">
                <summary className="cursor-pointer font-display text-lg uppercase text-brand-white">{faq.question}</summary>
                <p className="mt-2 text-sm text-brand-grey-light">{faq.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-brand-dark px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 flex items-end justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-[0.16em] text-brand-yellow">Latest Insights</p>
              <h2 className="mt-2 font-display text-4xl uppercase text-brand-white">Blog & News</h2>
            </div>
            <Link className="text-xs uppercase tracking-[0.12em] text-brand-yellow hover:underline" to="/blog">
              View all posts
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {blogPosts.map((post) => (
              <article key={post.slug} className="rounded-2xl border border-brand-steel/30 bg-brand-dark2/80 p-5">
                <p className="text-xs uppercase tracking-[0.12em] text-brand-yellow">{post.date}</p>
                <h3 className="mt-2 font-display text-2xl uppercase leading-tight text-brand-white">{post.title}</h3>
                <p className="mt-2 text-sm text-brand-grey-light">{post.excerpt}</p>
                <p className="mt-4 text-[11px] uppercase tracking-[0.12em] text-brand-grey">{post.readTime}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-brand-yellow px-4 py-14 text-brand-black sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-6 lg:flex-row lg:items-center">
          <div>
            <p className="text-xs uppercase tracking-[0.14em]">Start your rental workflow today</p>
            <h2 className="mt-2 font-display text-4xl uppercase">Need immediate scaffolding support?</h2>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link className="rounded-full bg-brand-black px-6 py-3 text-xs font-semibold uppercase tracking-[0.12em] text-brand-yellow" to="/contact">
              Submit Enquiry
            </Link>
            <a className="rounded-full border border-brand-black px-6 py-3 text-xs font-semibold uppercase tracking-[0.12em]" href={`tel:${company.phone.replace(/\s+/g, '')}`}>
              Call {company.phone}
            </a>
          </div>
        </div>
      </section>
    </>
  );
}