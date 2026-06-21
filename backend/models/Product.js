const mongoose = require('mongoose');
const { PRODUCT_CATEGORIES, AVAILABILITY_STATUSES } = require('../config/constants');

const slugify = (value) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
      maxlength: [120, 'Product name cannot exceed 120 characters'],
    },
    slug: {
      type: String,
      unique: true,
      index: true,
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: PRODUCT_CATEGORIES,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
      minlength: [20, 'Description must be at least 20 characters'],
    },
    pricePerDay: {
      type: Number,
      required: [true, 'Rent price per day is required'],
      min: [0, 'Price per day cannot be negative'],
    },
    pricePerWeek: {
      type: Number,
      required: [true, 'Rent price per week is required'],
      min: [0, 'Price per week cannot be negative'],
    },
    availabilityStatus: {
      type: String,
      enum: AVAILABILITY_STATUSES,
      default: 'Available',
    },
    quantity: {
      type: Number,
      min: [0, 'Quantity cannot be negative'],
      default: 0,
    },
    dimensions: {
      type: String,
      trim: true,
      default: 'Standard',
    },
    materialType: {
      type: String,
      trim: true,
      default: 'Steel',
    },
    rating: {
      type: Number,
      min: [0, 'Rating cannot be less than 0'],
      max: [5, 'Rating cannot be more than 5'],
      default: 4.5,
    },
    images: {
      type: [String],
      default: [],
    },
    featured: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    specifications: {
      loadCapacity: {
        type: String,
        default: '',
      },
      platformHeight: {
        type: String,
        default: '',
      },
      weight: {
        type: String,
        default: '',
      },
    },
    seo: {
      metaTitle: {
        type: String,
        default: '',
      },
      metaDescription: {
        type: String,
        default: '',
      },
      keywords: {
        type: [String],
        default: [],
      },
    },
  },
  {
    timestamps: true,
  }
);

productSchema.index({ name: 'text', description: 'text', category: 'text', materialType: 'text' });
productSchema.index({ category: 1, availabilityStatus: 1, createdAt: -1 });

productSchema.pre('validate', function preValidate(next) {
  if (!this.slug || this.isModified('name')) {
    const baseSlug = slugify(this.name || 'product');
    this.slug = `${baseSlug}-${this._id.toString().slice(-6)}`;
  }

  if (this.quantity === 0 && this.availabilityStatus === 'Available') {
    this.availabilityStatus = 'Limited';
  }

  next();
});

module.exports = mongoose.model('Product', productSchema);