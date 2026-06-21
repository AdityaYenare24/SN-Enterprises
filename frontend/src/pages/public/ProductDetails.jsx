import React, { useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import Seo from '../../components/common/Seo';
import PageLoader from '../../components/common/PageLoader';
import EmptyState from '../../components/common/EmptyState';
import { fetchProductById } from '../../services/productService';
import { createEnquiry } from '../../services/enquiryService';
import { formatCurrency } from '../../utils/format';

function useProduct(id) {
  const [state, setState] = React.useState({ loading: true, product: null, error: null });

  React.useEffect(() => {
    let mounted = true;

    const load = async () => {
      setState({ loading: true, product: null, error: null });
      try {
        const response = await fetchProductById(id);
        if (mounted) setState({ loading: false, product: response.data, error: null });
      } catch (error) {
        if (mounted) setState({ loading: false, product: null, error });
      }
    };

    load();

    return () => {
      mounted = false;
    };
  }, [id]);

  return state;
}

const initialForm = {
  name: '',
  phone: '',
  email: '',
  companyName: '',
  address: '',
  rentalStartDate: '',
  rentalEndDate: '',
  quantity: 1,
  message: '',
};

export default function ProductDetailsPage() {
  const { id } = useParams();
  const { loading, product, error } = useProduct(id);
  const [activeImage, setActiveImage] = useState(0);
  const [form, setForm] = useState(initialForm);
  const [submitting, setSubmitting] = useState(false);

  const images = useMemo(() => product?.images?.length ? product.images : [], [product]);

  const onChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!product) return;

    const required = ['name', 'phone', 'email', 'address', 'rentalStartDate', 'rentalEndDate'];
    for (const field of required) {
      if (!String(form[field]).trim()) {
        toast.error('Please fill all required enquiry fields.');
        return;
      }
    }

    if (new Date(form.rentalEndDate) < new Date(form.rentalStartDate)) {
      toast.error('Rental end date must be after start date.');
      return;
    }

    try {
      setSubmitting(true);
      const payload = {
        ...form,
        quantity: Number(form.quantity),
        productSelected: product._id,
      };

      const response = await createEnquiry(payload);
      const bookingRef = response?.data?._id ? `SNB-${String(response.data._id).slice(-6).toUpperCase()}` : '';
      toast.success(
        bookingRef
          ? `${response.message || 'Enquiry submitted successfully.'} Booking ID: ${bookingRef}`
          : response.message || 'Enquiry submitted successfully.'
      );
      setForm(initialForm);
    } catch (submitError) {
      toast.error(submitError?.response?.data?.message || 'Unable to submit enquiry right now.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <PageLoader label="Loading product" />;

  if (error || !product) {
    return (
      <div className="bg-brand-black px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <EmptyState
            title="Product not found"
            description="The product may have been removed or is temporarily unavailable."
          />
        </div>
      </div>
    );
  }

  return (
    <>
      <Seo
        title={product.name}
        description={product.description}
        path={`/products/${product._id}`}
        keywords={[product.name, product.category, product.materialType]}
        image={images[0]}
      />

      <section className="bg-brand-black px-4 py-14 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1.2fr_1fr]">
          <div>
            <div className="overflow-hidden rounded-2xl border border-brand-steel/30">
              <img
                src={images[activeImage] || 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1200&q=80'}
                alt={product.name}
                className="h-[420px] w-full object-cover"
              />
            </div>

            {images.length > 1 ? (
              <div className="mt-3 grid grid-cols-4 gap-2">
                {images.map((image, index) => (
                  <button
                    key={image}
                    type="button"
                    onClick={() => setActiveImage(index)}
                    className={`overflow-hidden rounded-lg border ${
                      activeImage === index ? 'border-brand-yellow' : 'border-brand-steel/40'
                    }`}
                  >
                    <img src={image} alt={`${product.name}-${index + 1}`} className="h-20 w-full object-cover" />
                  </button>
                ))}
              </div>
            ) : null}

            <div className="mt-6 rounded-2xl border border-brand-steel/30 bg-brand-dark2/70 p-5">
              <p className="text-xs uppercase tracking-[0.13em] text-brand-yellow">Specifications</p>
              <div className="mt-3 grid grid-cols-2 gap-3 text-sm text-brand-grey-light sm:grid-cols-3">
                <div className="rounded-lg border border-brand-steel/30 bg-brand-dark px-3 py-2">
                  <p className="text-xs uppercase tracking-[0.12em] text-brand-grey">Category</p>
                  <p className="mt-1 text-brand-white">{product.category}</p>
                </div>
                <div className="rounded-lg border border-brand-steel/30 bg-brand-dark px-3 py-2">
                  <p className="text-xs uppercase tracking-[0.12em] text-brand-grey">Material</p>
                  <p className="mt-1 text-brand-white">{product.materialType}</p>
                </div>
                <div className="rounded-lg border border-brand-steel/30 bg-brand-dark px-3 py-2">
                  <p className="text-xs uppercase tracking-[0.12em] text-brand-grey">Dimensions</p>
                  <p className="mt-1 text-brand-white">{product.dimensions}</p>
                </div>
                <div className="rounded-lg border border-brand-steel/30 bg-brand-dark px-3 py-2">
                  <p className="text-xs uppercase tracking-[0.12em] text-brand-grey">Quantity</p>
                  <p className="mt-1 text-brand-white">{product.quantity}</p>
                </div>
                <div className="rounded-lg border border-brand-steel/30 bg-brand-dark px-3 py-2">
                  <p className="text-xs uppercase tracking-[0.12em] text-brand-grey">Per Day</p>
                  <p className="mt-1 text-brand-white">{formatCurrency(product.pricePerDay)}</p>
                </div>
                <div className="rounded-lg border border-brand-steel/30 bg-brand-dark px-3 py-2">
                  <p className="text-xs uppercase tracking-[0.12em] text-brand-grey">Per Week</p>
                  <p className="mt-1 text-brand-white">{formatCurrency(product.pricePerWeek)}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-5">
            <div className="rounded-2xl border border-brand-steel/30 bg-brand-dark2/70 p-5">
              <p className="text-xs uppercase tracking-[0.13em] text-brand-yellow">{product.availabilityStatus}</p>
              <h1 className="mt-2 font-display text-4xl uppercase text-brand-white">{product.name}</h1>
              <p className="mt-3 text-sm leading-relaxed text-brand-grey-light">{product.description}</p>
            </div>

            <form onSubmit={handleSubmit} className="rounded-2xl border border-brand-steel/30 bg-brand-dark2/70 p-5">
              <h2 className="font-display text-2xl uppercase text-brand-white">Rental Enquiry</h2>
              <p className="mt-1 text-xs text-brand-grey-light">Fill the details and our team will contact you in 24 hours.</p>

              <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                <input className="form-input" name="name" placeholder="Full Name*" value={form.name} onChange={onChange} />
                <input className="form-input" name="phone" placeholder="Phone*" value={form.phone} onChange={onChange} />
                <input className="form-input" name="email" placeholder="Email*" value={form.email} onChange={onChange} />
                <input className="form-input" name="companyName" placeholder="Company Name" value={form.companyName} onChange={onChange} />
                <input className="form-input" name="rentalStartDate" type="date" value={form.rentalStartDate} onChange={onChange} />
                <input className="form-input" name="rentalEndDate" type="date" value={form.rentalEndDate} onChange={onChange} />
                <input className="form-input" name="quantity" type="number" min={1} value={form.quantity} onChange={onChange} />
                <input className="form-input" name="address" placeholder="Address*" value={form.address} onChange={onChange} />
              </div>

              <textarea
                className="form-input mt-3 min-h-[120px] resize-y"
                name="message"
                placeholder="Message"
                value={form.message}
                onChange={onChange}
              />

              <button type="submit" disabled={submitting} className="btn-primary mt-4 w-full justify-center disabled:opacity-70">
                {submitting ? 'Submitting...' : 'Submit Enquiry'}
              </button>
            </form>
          </div>
        </div>
      </section>
    </>
  );
}
