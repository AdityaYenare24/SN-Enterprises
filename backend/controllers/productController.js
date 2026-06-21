const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const Product = require('../models/Product');
const asyncHandler = require('../utils/asyncHandler');
const AppError = require('../utils/AppError');

const sortMap = {
  latest: { createdAt: -1 },
  oldest: { createdAt: 1 },
  price_asc: { pricePerDay: 1 },
  price_desc: { pricePerDay: -1 },
  rating_desc: { rating: -1 },
  name_asc: { name: 1 },
};

const parseBoolean = (value) => {
  if (value === undefined) return undefined;
  if (typeof value === 'boolean') return value;
  return String(value).toLowerCase() === 'true';
};

const parseNumber = (value, fallback = undefined) => {
  const parsed = Number(value);
  return Number.isNaN(parsed) ? fallback : parsed;
};

const parseCsvList = (value) =>
  String(value)
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);

const parseJsonIfPossible = (value, fallback) => {
  if (value === undefined || value === null || value === '') return fallback;

  if (typeof value !== 'string') return value;

  try {
    return JSON.parse(value);
  } catch (_error) {
    return fallback;
  }
};

const getProducts = asyncHandler(async (req, res) => {
  const page = Math.max(1, parseNumber(req.query.page, 1));
  const limit = Math.min(50, Math.max(1, parseNumber(req.query.limit, 12)));
  const skip = (page - 1) * limit;

  const {
    search,
    category,
    availability,
    sort = 'latest',
    minPrice,
    maxPrice,
    featured,
  } = req.query;

  const filter = { isActive: true };

  if (search) {
    const regex = new RegExp(search.trim(), 'i');
    filter.$or = [{ name: regex }, { description: regex }, { category: regex }, { materialType: regex }];
  }

  if (category) {
    const categories = parseCsvList(category);
    filter.category = { $in: categories };
  }

  if (availability) {
    const statuses = parseCsvList(availability);
    filter.availabilityStatus = { $in: statuses };
  }

  if (minPrice !== undefined || maxPrice !== undefined) {
    filter.pricePerDay = {};
    if (minPrice !== undefined) filter.pricePerDay.$gte = parseNumber(minPrice, 0);
    if (maxPrice !== undefined) filter.pricePerDay.$lte = parseNumber(maxPrice, 0);
  }

  const featuredValue = parseBoolean(featured);
  if (featuredValue !== undefined) {
    filter.featured = featuredValue;
  }

  const [products, total] = await Promise.all([
    Product.find(filter)
      .sort(sortMap[sort] || sortMap.latest)
      .skip(skip)
      .limit(limit),
    Product.countDocuments(filter),
  ]);

  return res.status(200).json({
    success: true,
    data: products,
    pagination: {
      total,
      page,
      limit,
      pages: Math.ceil(total / limit),
    },
  });
});

const getProductByIdOrSlug = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const query = mongoose.Types.ObjectId.isValid(id)
    ? { $or: [{ _id: id }, { slug: id }] }
    : { slug: id };

  const product = await Product.findOne({ ...query, isActive: true });

  if (!product) {
    throw new AppError('Product not found.', 404);
  }

  return res.status(200).json({
    success: true,
    data: product,
  });
});

const buildProductPayload = (req, existingProduct = null) => {
  const payload = {
    name: req.body.name,
    category: req.body.category,
    description: req.body.description,
    pricePerDay: parseNumber(req.body.pricePerDay),
    pricePerWeek: parseNumber(req.body.pricePerWeek),
    availabilityStatus: req.body.availabilityStatus,
    quantity: parseNumber(req.body.quantity, 0),
    dimensions: req.body.dimensions,
    materialType: req.body.materialType,
    rating: parseNumber(req.body.rating, 4.5),
    featured: parseBoolean(req.body.featured) ?? false,
    specifications: {
      loadCapacity: req.body.loadCapacity || req.body.specifications?.loadCapacity || '',
      platformHeight: req.body.platformHeight || req.body.specifications?.platformHeight || '',
      weight: req.body.weight || req.body.specifications?.weight || '',
    },
    seo: {
      metaTitle: req.body.metaTitle || req.body.seo?.metaTitle || '',
      metaDescription: req.body.metaDescription || req.body.seo?.metaDescription || '',
      keywords: parseJsonIfPossible(req.body.keywords || req.body.seo?.keywords, []),
    },
  };

  Object.keys(payload).forEach((key) => {
    if (payload[key] === undefined) delete payload[key];
  });

  const uploadedImages = (req.files || []).map((file) => `/uploads/${file.filename}`);
  const bodyImages = parseJsonIfPossible(req.body.images, []);
  const validBodyImages = Array.isArray(bodyImages)
    ? bodyImages.filter((entry) => typeof entry === 'string' && entry.trim())
    : [];

  const replaceImages = parseBoolean(req.body.replaceImages) ?? false;

  if (replaceImages) {
    payload.images = [...validBodyImages, ...uploadedImages];
  } else if (uploadedImages.length || validBodyImages.length) {
    payload.images = [
      ...(existingProduct?.images || []),
      ...validBodyImages,
      ...uploadedImages,
    ];
  }

  if (!payload.images && !existingProduct) {
    payload.images = [
      'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1200&q=80',
    ];
  }

  return payload;
};

const createProduct = asyncHandler(async (req, res) => {
  const payload = buildProductPayload(req);

  const product = await Product.create(payload);

  return res.status(201).json({
    success: true,
    message: 'Product created successfully.',
    data: product,
  });
});

const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    throw new AppError('Product not found.', 404);
  }

  const payload = buildProductPayload(req, product);

  Object.assign(product, payload);
  await product.save();

  return res.status(200).json({
    success: true,
    message: 'Product updated successfully.',
    data: product,
  });
});

const deleteUploadedFile = (imagePath) => {
  if (!imagePath?.startsWith('/uploads/')) return;

  const normalized = imagePath.replace(/^\//, '');
  const absolutePath = path.join(__dirname, '..', normalized);
  if (fs.existsSync(absolutePath)) {
    fs.unlinkSync(absolutePath);
  }
};

const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    throw new AppError('Product not found.', 404);
  }

  (product.images || []).forEach(deleteUploadedFile);
  await product.deleteOne();

  return res.status(200).json({
    success: true,
    message: 'Product deleted successfully.',
  });
});

const updateProductAvailability = asyncHandler(async (req, res) => {
  const { availabilityStatus, quantity } = req.body;

  const product = await Product.findById(req.params.id);

  if (!product) {
    throw new AppError('Product not found.', 404);
  }

  if (availabilityStatus) {
    product.availabilityStatus = availabilityStatus;
  }

  if (quantity !== undefined) {
    product.quantity = parseNumber(quantity, product.quantity);
  }

  await product.save();

  return res.status(200).json({
    success: true,
    message: 'Availability updated successfully.',
    data: product,
  });
});

module.exports = {
  getProducts,
  getProductByIdOrSlug,
  createProduct,
  updateProduct,
  deleteProduct,
  updateProductAvailability,
};
