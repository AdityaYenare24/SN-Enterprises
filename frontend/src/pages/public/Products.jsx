import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import Seo from '../../components/common/Seo';
import ProductCard from '../../components/products/ProductCard';
import ProductFilters from '../../components/products/ProductFilters';
import ProductSkeletonGrid from '../../components/common/ProductSkeletonGrid';
import EmptyState from '../../components/common/EmptyState';
import useDebounce from '../../hooks/useDebounce';
import { fetchProducts } from '../../services/productService';
import { productCategories } from '../../assets/data/siteData';

export default function ProductsPage() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [availability, setAvailability] = useState('');
  const [sort, setSort] = useState('latest');
  const [page, setPage] = useState(1);

  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [loading, setLoading] = useState(true);

  const debouncedSearch = useDebounce(search);

  const params = useMemo(
    () => ({
      page,
      limit: 9,
      sort,
      search: debouncedSearch || undefined,
      category: category || undefined,
      availability: availability || undefined,
    }),
    [page, sort, debouncedSearch, category, availability]
  );

  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      try {
        const response = await fetchProducts(params);
        setProducts(response.data || []);
        setPagination(response.pagination || { page: 1, pages: 1, total: 0 });
      } catch (_error) {
        setProducts([]);
        setPagination({ page: 1, pages: 1, total: 0 });
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, [params]);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, category, availability, sort]);

  return (
    <>
      <Seo
        title="Rental Products"
        description="Browse scaffolding rental products by category, availability, and pricing. Submit enquiries directly from each product detail page."
        path="/products"
      />

      <section className="bg-brand-black px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <p className="text-xs uppercase tracking-[0.14em] text-brand-yellow">Product Catalogue</p>
          <h1 className="mt-2 font-display text-5xl uppercase text-brand-white sm:text-6xl">Scaffolding Rental Inventory</h1>
          <p className="mt-4 max-w-3xl text-sm text-brand-grey-light sm:text-base">
            Filter by category, check availability, and compare rental rates. For custom bundles, use the enquiry form on product details.
          </p>
        </div>
      </section>

      <section className="bg-brand-dark px-4 pb-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <ProductFilters
            search={search}
            setSearch={setSearch}
            category={category}
            setCategory={setCategory}
            availability={availability}
            setAvailability={setAvailability}
            sort={sort}
            setSort={setSort}
            categories={productCategories}
          />

          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-sm text-brand-grey-light">
            <p>
              Showing <span className="text-brand-yellow">{products.length}</span> of{' '}
              <span className="text-brand-yellow">{pagination.total || 0}</span> products
            </p>
            <Link to="/contact" className="text-xs uppercase tracking-[0.12em] text-brand-yellow hover:underline">
              Need bulk pricing? Get quote
            </Link>
          </div>

          <div className="mt-6">
            {loading ? (
              <ProductSkeletonGrid count={9} />
            ) : products.length ? (
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {products.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            ) : (
              <EmptyState
                title="No matching products"
                description="Try changing filters or search terms. You can also contact us for custom combinations and immediate dispatch support."
                action={
                  <button
                    type="button"
                    className="btn-outline"
                    onClick={() => {
                      setSearch('');
                      setCategory('');
                      setAvailability('');
                      setSort('latest');
                    }}
                  >
                    Reset Filters
                  </button>
                }
              />
            )}
          </div>

          {pagination.pages > 1 ? (
            <div className="mt-8 flex items-center justify-center gap-2">
              <button
                type="button"
                onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                disabled={page <= 1}
                className="rounded-full border border-brand-steel/40 px-4 py-2 text-xs uppercase tracking-[0.1em] text-brand-grey-light disabled:opacity-40"
              >
                Prev
              </button>
              <span className="text-xs uppercase tracking-[0.1em] text-brand-grey-light">
                Page {page} / {pagination.pages}
              </span>
              <button
                type="button"
                onClick={() => setPage((prev) => Math.min(pagination.pages, prev + 1))}
                disabled={page >= pagination.pages}
                className="rounded-full border border-brand-steel/40 px-4 py-2 text-xs uppercase tracking-[0.1em] text-brand-grey-light disabled:opacity-40"
              >
                Next
              </button>
            </div>
          ) : null}
        </div>
      </section>
    </>
  );
}