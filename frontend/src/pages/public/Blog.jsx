import React from 'react';
import Seo from '../../components/common/Seo';
import { blogPosts } from '../../assets/data/siteData';

export default function BlogPage() {
  return (
    <>
      <Seo
        title="Blog & News"
        description="Latest scaffolding safety, rental planning, and project execution insights from S N Enterprises."
        path="/blog"
      />

      <section className="bg-brand-black px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <p className="text-xs uppercase tracking-[0.14em] text-brand-yellow">Knowledge Center</p>
          <h1 className="mt-2 font-display text-5xl uppercase text-brand-white sm:text-6xl">Blog & News</h1>
          <p className="mt-4 max-w-2xl text-sm text-brand-grey-light sm:text-base">
            Practical guidance for builders, plant managers, and site engineers managing access and scaffolding operations.
          </p>
        </div>
      </section>

      <section className="bg-brand-dark px-4 pb-16 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-4 md:grid-cols-2 xl:grid-cols-3">
          {blogPosts.map((post) => (
            <article key={post.slug} className="rounded-2xl border border-brand-steel/30 bg-brand-dark2/70 p-5">
              <p className="text-xs uppercase tracking-[0.12em] text-brand-yellow">{post.date}</p>
              <h2 className="mt-2 font-display text-3xl uppercase leading-tight text-brand-white">{post.title}</h2>
              <p className="mt-3 text-sm text-brand-grey-light">{post.excerpt}</p>
              <p className="mt-4 text-xs uppercase tracking-[0.12em] text-brand-grey">{post.readTime}</p>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}