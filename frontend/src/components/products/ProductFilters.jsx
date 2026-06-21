import React from 'react';
import { availabilityOptions, sortOptions } from '../../utils/constants';

export default function ProductFilters({
  search,
  setSearch,
  category,
  setCategory,
  availability,
  setAvailability,
  sort,
  setSort,
  categories,
}) {
  return (
    <div className="rounded-2xl border border-brand-steel/30 bg-brand-dark2/70 p-4 sm:p-5">
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-4">
        <label className="text-sm text-brand-grey-light">
          Search
          <input
            type="text"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Product name or material"
            className="mt-1 w-full rounded-lg border border-brand-steel/40 bg-brand-dark px-3 py-2 text-sm text-brand-white outline-none ring-brand-yellow focus:ring-2"
          />
        </label>

        <label className="text-sm text-brand-grey-light">
          Category
          <select
            value={category}
            onChange={(event) => setCategory(event.target.value)}
            className="mt-1 w-full rounded-lg border border-brand-steel/40 bg-brand-dark px-3 py-2 text-sm text-brand-white outline-none ring-brand-yellow focus:ring-2"
          >
            <option value="">All Categories</option>
            {categories.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </label>

        <label className="text-sm text-brand-grey-light">
          Availability
          <select
            value={availability}
            onChange={(event) => setAvailability(event.target.value)}
            className="mt-1 w-full rounded-lg border border-brand-steel/40 bg-brand-dark px-3 py-2 text-sm text-brand-white outline-none ring-brand-yellow focus:ring-2"
          >
            <option value="">Any Status</option>
            {availabilityOptions.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </label>

        <label className="text-sm text-brand-grey-light">
          Sort By
          <select
            value={sort}
            onChange={(event) => setSort(event.target.value)}
            className="mt-1 w-full rounded-lg border border-brand-steel/40 bg-brand-dark px-3 py-2 text-sm text-brand-white outline-none ring-brand-yellow focus:ring-2"
          >
            {sortOptions.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>
        </label>
      </div>
    </div>
  );
}