import React, { useMemo, useState } from 'react';
import Seo from '../../components/common/Seo';
import { galleryCategories, galleryItems } from '../../assets/data/siteData';

export default function GalleryPage() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [activeImage, setActiveImage] = useState(null);

  const categories = useMemo(() => ['All', ...galleryCategories], []);

  const filteredItems = useMemo(() => {
    if (activeCategory === 'All') return galleryItems;
    return galleryItems.filter((item) => item.category === activeCategory);
  }, [activeCategory]);

  return (
    <>
      <Seo
        title="Gallery"
        description="Explore real project visuals from S N Enterprises including scaffolding setup, industrial work, and safety equipment deployment."
        path="/gallery"
      />

      <section className="bg-brand-black px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <p className="text-xs uppercase tracking-[0.14em] text-brand-yellow">Project Visuals</p>
          <h1 className="mt-2 font-display text-5xl uppercase text-brand-white sm:text-6xl">Scaffolding Gallery</h1>
          <p className="mt-4 max-w-3xl text-sm text-brand-grey-light sm:text-base">
            Construction site execution, industrial maintenance setups, rental equipment readiness, and safety implementation snapshots.
          </p>
        </div>
      </section>

      <section className="bg-brand-dark px-4 pb-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-6 flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => setActiveCategory(category)}
                className={`rounded-full border px-4 py-2 text-xs uppercase tracking-[0.1em] transition ${
                  activeCategory === category
                    ? 'border-brand-yellow bg-brand-yellow text-brand-black'
                    : 'border-brand-steel/50 text-brand-grey-light hover:border-brand-yellow hover:text-brand-yellow'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          <div className="columns-1 gap-4 sm:columns-2 lg:columns-3">
            {filteredItems.map((item, index) => (
              <button
                key={`${item.title}-${index}`}
                type="button"
                className="group mb-4 w-full break-inside-avoid overflow-hidden rounded-2xl border border-brand-steel/30 bg-brand-dark2 text-left"
                onClick={() => setActiveImage(item)}
              >
                <img src={item.image} alt={item.title} loading="lazy" className="w-full object-cover transition duration-500 group-hover:scale-105" />
                <div className="p-4">
                  <p className="text-[11px] uppercase tracking-[0.12em] text-brand-yellow">{item.category}</p>
                  <h3 className="mt-1 font-display text-xl uppercase text-brand-white">{item.title}</h3>
                  <p className="text-xs text-brand-grey-light">{item.location}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {activeImage ? (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 px-4" role="dialog" aria-modal="true">
          <button type="button" className="absolute inset-0" onClick={() => setActiveImage(null)} aria-label="Close preview" />
          <div className="relative z-10 w-full max-w-5xl overflow-hidden rounded-2xl border border-brand-steel/30 bg-brand-dark">
            <img src={activeImage.image} alt={activeImage.title} className="max-h-[70vh] w-full object-cover" />
            <div className="p-5">
              <p className="text-xs uppercase tracking-[0.12em] text-brand-yellow">{activeImage.category}</p>
              <h3 className="mt-1 font-display text-3xl uppercase text-brand-white">{activeImage.title}</h3>
              <p className="text-sm text-brand-grey-light">{activeImage.location}</p>
            </div>
            <button
              type="button"
              onClick={() => setActiveImage(null)}
              className="absolute right-3 top-3 rounded-full border border-brand-steel/40 bg-brand-black/70 px-3 py-1 text-xs uppercase tracking-[0.1em] text-brand-white"
            >
              Close
            </button>
          </div>
        </div>
      ) : null}
    </>
  );
}