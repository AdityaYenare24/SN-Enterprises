const Enquiry = require('../models/Enquiry');
const Product = require('../models/Product');
const asyncHandler = require('../utils/asyncHandler');
const AppError = require('../utils/AppError');
const { sendBookingStatusEmail, sendEnquiryNotification } = require('../services/emailService');

const createEnquiry = asyncHandler(async (req, res) => {
  const payload = {
    name: req.body.name?.trim(),
    phone: req.body.phone?.trim(),
    email: req.body.email?.trim().toLowerCase(),
    companyName: req.body.companyName?.trim() || '',
    address: req.body.address?.trim(),
    rentalStartDate: req.body.rentalStartDate,
    rentalEndDate: req.body.rentalEndDate,
    quantity: Number(req.body.quantity),
    productSelected: req.body.productSelected,
    message: req.body.message?.trim() || '',
    source: req.body.source || 'website',
    user: req.user?._id || null,
  };

  const product = await Product.findById(payload.productSelected);

  if (!product || !product.isActive) {
    throw new AppError('Selected product is unavailable right now.', 400);
  }

  const enquiry = await Enquiry.create(payload);
  const populated = await enquiry.populate('productSelected', 'name category pricePerDay');

  sendEnquiryNotification({
    adminEmail: process.env.ADMIN_EMAIL,
    enquiry,
    productName: product.name,
  }).catch(() => null);

  return res.status(201).json({
    success: true,
    message: 'Enquiry submitted successfully. Our team will contact you shortly.',
    data: populated,
  });
});

const getEnquiries = asyncHandler(async (req, res) => {
  const page = Math.max(1, Number(req.query.page) || 1);
  const limit = Math.min(50, Math.max(1, Number(req.query.limit) || 20));
  const skip = (page - 1) * limit;
  const sort = req.query.sort === 'oldest' ? { createdAt: 1 } : { createdAt: -1 };

  const filter = {};

  if (req.query.status) {
    filter.status = req.query.status;
  }

  if (req.query.product) {
    filter.productSelected = req.query.product;
  }

  if (req.query.search) {
    const pattern = req.query.search.trim();
    const regex = new RegExp(pattern, 'i');
    filter.$or = [{ name: regex }, { phone: regex }, { email: regex }, { companyName: regex }];
  }

  if (req.query.dateFrom || req.query.dateTo) {
    filter.createdAt = {};

    if (req.query.dateFrom) {
      const fromDate = new Date(req.query.dateFrom);
      if (!Number.isNaN(fromDate.getTime())) {
        filter.createdAt.$gte = fromDate;
      }
    }

    if (req.query.dateTo) {
      const toDate = new Date(req.query.dateTo);
      if (!Number.isNaN(toDate.getTime())) {
        toDate.setHours(23, 59, 59, 999);
        filter.createdAt.$lte = toDate;
      }
    }

    if (!Object.keys(filter.createdAt).length) {
      delete filter.createdAt;
    }
  }

  const [enquiries, total] = await Promise.all([
    Enquiry.find(filter)
      .populate('productSelected', 'name category')
      .populate('user', 'name email')
      .sort(sort)
      .skip(skip)
      .limit(limit),
    Enquiry.countDocuments(filter),
  ]);

  return res.status(200).json({
    success: true,
    data: enquiries,
    pagination: {
      total,
      page,
      limit,
      pages: Math.ceil(total / limit),
    },
  });
});

const updateEnquiry = asyncHandler(async (req, res) => {
  const allowedUpdates = ['status', 'message', 'adminMessage'];
  const updates = {};

  allowedUpdates.forEach((field) => {
    if (req.body[field] !== undefined) updates[field] = req.body[field];
  });

  const enquiry = await Enquiry.findById(req.params.id);
  if (!enquiry) {
    throw new AppError('Enquiry not found.', 404);
  }

  const previousStatus = enquiry.status;

  if (updates.status === 'Rejected' && !String(updates.adminMessage || enquiry.adminMessage || '').trim()) {
    throw new AppError('Admin message is required when rejecting a booking.', 400);
  }

  Object.entries(updates).forEach(([field, value]) => {
    enquiry[field] = typeof value === 'string' ? value.trim() : value;
  });

  await enquiry.save();
  await enquiry.populate('productSelected', 'name category');

  let emailDelivery = null;
  const shouldNotifyCustomer =
    updates.status && updates.status !== previousStatus && ['Approved', 'Rejected'].includes(updates.status);

  if (shouldNotifyCustomer) {
    try {
      emailDelivery = await sendBookingStatusEmail({
        enquiry,
        productName: enquiry.productSelected?.name,
        adminMessage: enquiry.adminMessage,
      });
    } catch (error) {
      emailDelivery = {
        failed: true,
        reason: error.message || 'Unable to send customer email.',
      };
    }
  }

  return res.status(200).json({
    success: true,
    message: 'Enquiry updated successfully.',
    data: enquiry,
    emailDelivery,
  });
});

const deleteEnquiry = asyncHandler(async (req, res) => {
  const enquiry = await Enquiry.findById(req.params.id);

  if (!enquiry) {
    throw new AppError('Enquiry not found.', 404);
  }

  await enquiry.deleteOne();

  return res.status(200).json({
    success: true,
    message: 'Enquiry deleted successfully.',
  });
});

module.exports = {
  createEnquiry,
  getEnquiries,
  updateEnquiry,
  deleteEnquiry,
};
