const Product = require('../models/Product');
const Enquiry = require('../models/Enquiry');
const User = require('../models/User');
const Contact = require('../models/Contact');
const Admin = require('../models/Admin');
const asyncHandler = require('../utils/asyncHandler');
const AppError = require('../utils/AppError');

const getDashboardStats = asyncHandler(async (_req, res) => {
  const [
    totalProducts,
    totalEnquiries,
    totalUsers,
    availableProducts,
    pendingEnquiries,
    approvedEnquiries,
    closedEnquiries,
    recentEnquiries,
    recentContacts,
  ] = await Promise.all([
    Product.countDocuments({ isActive: true }),
    Enquiry.countDocuments(),
    User.countDocuments({ role: 'user' }),
    Product.countDocuments({ isActive: true, availabilityStatus: { $in: ['Available', 'Limited'] } }),
    Enquiry.countDocuments({ status: 'Pending' }),
    Enquiry.countDocuments({ status: 'Approved' }),
    Enquiry.countDocuments({ status: 'Closed' }),
    Enquiry.find()
      .populate('productSelected', 'name category')
      .sort({ createdAt: -1 })
      .limit(6),
    Contact.find().sort({ createdAt: -1 }).limit(5),
  ]);

  return res.status(200).json({
    success: true,
    data: {
      totalProducts,
      totalEnquiries,
      totalUsers,
      availableProducts,
      pendingEnquiries,
      approvedEnquiries,
      closedEnquiries,
      recentEnquiries,
      recentContacts,
    },
  });
});

const getUsers = asyncHandler(async (req, res) => {
  const page = Math.max(1, Number(req.query.page) || 1);
  const limit = Math.min(50, Math.max(1, Number(req.query.limit) || 20));
  const skip = (page - 1) * limit;

  const filter = {};
  if (req.query.role) filter.role = req.query.role;
  if (req.query.search) {
    const regex = new RegExp(req.query.search, 'i');
    filter.$or = [{ name: regex }, { email: regex }, { phone: regex }];
  }

  const [users, total] = await Promise.all([
    User.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
    User.countDocuments(filter),
  ]);

  return res.status(200).json({
    success: true,
    data: users.map((user) => user.toPublic()),
    pagination: {
      total,
      page,
      limit,
      pages: Math.ceil(total / limit),
    },
  });
});

const createUser = asyncHandler(async (req, res) => {
  const { name, email, phone = '', password, role = 'user' } = req.body;
  const normalizedEmail = email.toLowerCase().trim();
  const existingUser = await User.findOne({ email: normalizedEmail });

  if (existingUser) {
    throw new AppError('An account with this email already exists.', 409);
  }

  const user = await User.create({
    name: name.trim(),
    email: normalizedEmail,
    phone: phone.trim(),
    password,
    role,
    isVerified: true,
  });

  if (user.role === 'admin') {
    await Admin.findOneAndUpdate(
      { user: user._id },
      { user: user._id, designation: 'Administrator' },
      { upsert: true, new: true }
    );
  }

  return res.status(201).json({
    success: true,
    message: 'User added successfully.',
    data: user.toPublic(),
  });
});

const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    throw new AppError('User not found.', 404);
  }

  if (String(user._id) === String(req.user._id)) {
    throw new AppError('You cannot delete your own admin account.', 400);
  }

  await Admin.deleteOne({ user: user._id });
  await user.deleteOne();

  return res.status(200).json({
    success: true,
    message: 'User deleted successfully.',
  });
});

const getAnalytics = asyncHandler(async (_req, res) => {
  const monthlyEnquiries = await Enquiry.aggregate([
    {
      $group: {
        _id: {
          year: { $year: '$createdAt' },
          month: { $month: '$createdAt' },
        },
        count: { $sum: 1 },
      },
    },
    { $sort: { '_id.year': 1, '_id.month': 1 } },
  ]);

  const categoryStats = await Product.aggregate([
    { $match: { isActive: true } },
    {
      $group: {
        _id: '$category',
        count: { $sum: 1 },
      },
    },
    { $sort: { count: -1 } },
  ]);

  const enquiryStatusStats = await Enquiry.aggregate([
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 },
      },
    },
    { $sort: { count: -1 } },
  ]);

  return res.status(200).json({
    success: true,
    data: {
      monthlyEnquiries,
      categoryStats,
      enquiryStatusStats,
    },
  });
});

const setProductAvailability = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    throw new AppError('Product not found.', 404);
  }

  if (req.body.availabilityStatus) {
    product.availabilityStatus = req.body.availabilityStatus;
  }

  if (req.body.quantity !== undefined) {
    const quantity = Number(req.body.quantity);
    if (!Number.isNaN(quantity)) {
      product.quantity = quantity;
    }
  }

  await product.save();

  return res.status(200).json({
    success: true,
    message: 'Product availability updated.',
    data: product,
  });
});

module.exports = {
  getDashboardStats,
  getUsers,
  createUser,
  deleteUser,
  getAnalytics,
  setProductAvailability,
};
