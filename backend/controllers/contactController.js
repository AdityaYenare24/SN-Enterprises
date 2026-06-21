const Contact = require('../models/Contact');
const asyncHandler = require('../utils/asyncHandler');

const createContactMessage = asyncHandler(async (req, res) => {
  const payload = {
    name: req.body.name?.trim(),
    phone: req.body.phone?.trim(),
    email: req.body.email?.trim().toLowerCase(),
    companyName: req.body.companyName?.trim() || '',
    subject: req.body.subject?.trim() || 'General enquiry',
    message: req.body.message?.trim(),
  };

  const contact = await Contact.create(payload);

  return res.status(201).json({
    success: true,
    message: 'Thank you! Your message has been received.',
    data: contact,
  });
});

const getContactMessages = asyncHandler(async (req, res) => {
  const page = Math.max(1, Number(req.query.page) || 1);
  const limit = Math.min(50, Math.max(1, Number(req.query.limit) || 20));
  const skip = (page - 1) * limit;

  const filter = {};
  if (req.query.status) filter.status = req.query.status;

  const [messages, total] = await Promise.all([
    Contact.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
    Contact.countDocuments(filter),
  ]);

  return res.status(200).json({
    success: true,
    data: messages,
    pagination: {
      total,
      page,
      limit,
      pages: Math.ceil(total / limit),
    },
  });
});

module.exports = {
  createContactMessage,
  getContactMessages,
};