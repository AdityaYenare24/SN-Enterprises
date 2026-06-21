import React, { useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import AdminSection from '../../components/admin/AdminSection';
import PageLoader from '../../components/common/PageLoader';
import { productCategories } from '../../assets/data/siteData';
import { availabilityOptions } from '../../utils/constants';
import { createProduct, deleteProduct, fetchProducts, updateProduct } from '../../services/productService';
import { updateProductAvailability } from '../../services/adminService';
import { formatCurrency } from '../../utils/format';

const initialForm = {
  name: '',
  category: productCategories[0],
  description: '',
  pricePerDay: '',
  pricePerWeek: '',
  availabilityStatus: 'Available',
  quantity: '',
  dimensions: 'Standard',
  materialType: 'Steel',
  rating: '4.5',
  featured: false,
  imagesText: '',
  replaceImages: false,
};

const hFrameImageUrl =
  'https://media.jdmart.com/mediacontent/productimage/17/6000-01703305220-65391813-1-mild-steel-hot-dipped-galvanized-h-frame-scaffolding-250.jpg?impolicy=Medium';

export default function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshTick, setRefreshTick] = useState(0);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(initialForm);
  const [files, setFiles] = useState([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const response = await fetchProducts({ limit: 100, sort: 'latest' });
        setProducts(response.data || []);
      } catch (_error) {
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [refreshTick]);

  const sortedProducts = useMemo(() => [...products], [products]);

  const resetForm = () => {
    setEditingId(null);
    setForm(initialForm);
    setFiles([]);
  };

  const onChange = (event) => {
    const { name, value, type, checked } = event.target;
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const addHFrameImage = () => {
    setForm((prev) => {
      if (!prev.imagesText.trim()) {
        return { ...prev, imagesText: hFrameImageUrl };
      }

      if (prev.imagesText.includes(hFrameImageUrl)) {
        return prev;
      }

      return { ...prev, imagesText: `${prev.imagesText.trim()}, ${hFrameImageUrl}` };
    });
    toast.success('H-frame image link added.');
  };

  const startEdit = (product) => {
    setEditingId(product._id);
    setForm({
      name: product.name || '',
      category: product.category || productCategories[0],
      description: product.description || '',
      pricePerDay: String(product.pricePerDay ?? ''),
      pricePerWeek: String(product.pricePerWeek ?? ''),
      availabilityStatus: product.availabilityStatus || 'Available',
      quantity: String(product.quantity ?? ''),
      dimensions: product.dimensions || 'Standard',
      materialType: product.materialType || 'Steel',
      rating: String(product.rating ?? '4.5'),
      featured: Boolean(product.featured),
      imagesText: (product.images || []).join(', '),
      replaceImages: false,
    });
    setFiles([]);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const submitForm = async (event) => {
    event.preventDefault();

    if (!form.name || !form.description) {
      toast.error('Please fill mandatory fields.');
      return;
    }

    try {
      setSaving(true);
      const formData = new FormData();
      Object.entries(form).forEach(([key, value]) => {
        if (key === 'imagesText') return;
        formData.append(key, value);
      });

      const urlImages = form.imagesText
        .split(',')
        .map((entry) => entry.trim())
        .filter(Boolean);

      formData.append('images', JSON.stringify(urlImages));

      Array.from(files).forEach((file) => {
        formData.append('images', file);
      });

      if (editingId) {
        await updateProduct(editingId, formData);
        toast.success('Product updated successfully.');
      } else {
        await createProduct(formData);
        toast.success('Product created successfully.');
      }

      resetForm();
      setRefreshTick((prev) => prev + 1);
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Unable to save product.');
    } finally {
      setSaving(false);
    }
  };

  const removeProduct = async (id) => {
    if (!window.confirm('Delete this product permanently?')) return;

    try {
      await deleteProduct(id);
      toast.success('Product deleted.');
      setRefreshTick((prev) => prev + 1);
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Delete failed.');
    }
  };

  const toggleAvailability = async (product) => {
    const nextStatus = product.availabilityStatus === 'Out of Stock' ? 'Available' : 'Out of Stock';

    try {
      await updateProductAvailability(product._id, { availabilityStatus: nextStatus });
      toast.success('Availability updated.');
      setRefreshTick((prev) => prev + 1);
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Unable to update availability.');
    }
  };

  return (
    <div className="space-y-6">
      <AdminSection
        title={editingId ? 'Edit Product' : 'Add Product'}
        subtitle="Manage scaffolding products, pricing, inventory, and media"
        rightSlot={
          editingId ? (
            <button type="button" onClick={resetForm} className="btn-outline !px-4 !py-2 text-xs">
              Cancel Edit
            </button>
          ) : null
        }
      >
        <form onSubmit={submitForm} className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <input className="form-input" name="name" placeholder="Product Name*" value={form.name} onChange={onChange} />
          <select className="form-input" name="category" value={form.category} onChange={onChange}>
            {productCategories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
          <input className="form-input" name="pricePerDay" type="number" placeholder="Price Per Day" value={form.pricePerDay} onChange={onChange} />
          <input className="form-input" name="pricePerWeek" type="number" placeholder="Price Per Week" value={form.pricePerWeek} onChange={onChange} />
          <select className="form-input" name="availabilityStatus" value={form.availabilityStatus} onChange={onChange}>
            {availabilityOptions.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
          <input className="form-input" name="quantity" type="number" placeholder="Quantity" value={form.quantity} onChange={onChange} />
          <input className="form-input" name="dimensions" placeholder="Dimensions" value={form.dimensions} onChange={onChange} />
          <input className="form-input" name="materialType" placeholder="Material Type" value={form.materialType} onChange={onChange} />
          <input className="form-input" name="rating" type="number" step="0.1" min={0} max={5} placeholder="Rating" value={form.rating} onChange={onChange} />
          <label className="flex items-center gap-2 rounded-lg border border-brand-steel/40 px-3 py-2 text-sm text-brand-grey-light">
            <input type="checkbox" name="featured" checked={form.featured} onChange={onChange} /> Featured Product
          </label>

          <textarea
            className="form-input md:col-span-2"
            name="description"
            placeholder="Description*"
            value={form.description}
            onChange={onChange}
            rows={4}
          />

          <textarea
            className="form-input md:col-span-2"
            name="imagesText"
            placeholder="Image URLs (comma separated)"
            value={form.imagesText}
            onChange={onChange}
            rows={3}
          />

          <div className="md:col-span-2">
            <button
              type="button"
              className="rounded-full border border-brand-yellow/60 px-4 py-2 text-xs uppercase tracking-[0.1em] text-brand-yellow hover:bg-brand-yellow/10"
              onClick={addHFrameImage}
            >
              Add H-Frame Image (JD Mart)
            </button>
          </div>

          <label className="rounded-lg border border-brand-steel/40 px-3 py-2 text-sm text-brand-grey-light md:col-span-2">
            Upload Images
            <input
              type="file"
              multiple
              accept="image/*"
              className="mt-2 block w-full text-xs"
              onChange={(event) => setFiles(event.target.files || [])}
            />
          </label>

          <label className="flex items-center gap-2 text-sm text-brand-grey-light md:col-span-2">
            <input type="checkbox" name="replaceImages" checked={form.replaceImages} onChange={onChange} />
            Replace existing images on update
          </label>

          <button type="submit" disabled={saving} className="btn-primary md:col-span-2 w-full justify-center disabled:opacity-70">
            {saving ? 'Saving...' : editingId ? 'Update Product' : 'Create Product'}
          </button>
        </form>
      </AdminSection>

      <AdminSection title="Product List" subtitle="Current rental inventory and quick actions">
        {loading ? (
          <PageLoader label="Loading products" />
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm text-brand-grey-light">
              <thead>
                <tr className="border-b border-brand-steel/30 text-xs uppercase tracking-[0.12em] text-brand-grey">
                  <th className="py-2 pr-3">Product</th>
                  <th className="py-2 pr-3">Category</th>
                  <th className="py-2 pr-3">Day Price</th>
                  <th className="py-2 pr-3">Status</th>
                  <th className="py-2 pr-3">Qty</th>
                  <th className="py-2 pr-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {sortedProducts.map((product) => (
                  <tr key={product._id} className="border-b border-brand-steel/20 align-top">
                    <td className="py-3 pr-3 text-brand-white">{product.name}</td>
                    <td className="py-3 pr-3">{product.category}</td>
                    <td className="py-3 pr-3">{formatCurrency(product.pricePerDay)}</td>
                    <td className="py-3 pr-3">{product.availabilityStatus}</td>
                    <td className="py-3 pr-3">{product.quantity}</td>
                    <td className="py-3 pr-3">
                      <div className="flex flex-wrap gap-2">
                        <button type="button" className="rounded-full border border-brand-steel/50 px-3 py-1 text-xs" onClick={() => startEdit(product)}>
                          Edit
                        </button>
                        <button type="button" className="rounded-full border border-brand-steel/50 px-3 py-1 text-xs" onClick={() => toggleAvailability(product)}>
                          Toggle Availability
                        </button>
                        <button
                          type="button"
                          className="rounded-full border border-red-500/40 px-3 py-1 text-xs text-red-300"
                          onClick={() => removeProduct(product._id)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </AdminSection>
    </div>
  );
}
