const express = require('express');
const { body } = require('express-validator');
const {
  createContactMessage,
  getContactMessages,
} = require('../controllers/contactController');
const { protect, authorize } = require('../middleware/auth');
const { validateRequest } = require('../middleware/validate');

const router = express.Router();

router.post(
  '/',
  [
    body('name').trim().isLength({ min: 2 }).withMessage('Name is required.'),
    body('phone').matches(/^\+?[\d\s-]{7,15}$/).withMessage('Valid phone number is required.'),
    body('email').isEmail().withMessage('Valid email is required.'),
    body('message').trim().isLength({ min: 10 }).withMessage('Message should be at least 10 characters.'),
  ],
  validateRequest,
  createContactMessage
);

router.get('/', protect, authorize('admin'), getContactMessages);

module.exports = router;