const express = require('express');
const { body } = require('express-validator');
const {
  register,
  login,
  forgotPassword,
  resetPassword,
  getProfile,
} = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const { validateRequest } = require('../middleware/validate');

const router = express.Router();

router.post(
  '/register',
  [
    body('name').trim().isLength({ min: 2 }).withMessage('Name must be at least 2 characters.'),
    body('email').isEmail().withMessage('Valid email is required.'),
    body('phone').optional({ values: 'falsy' }).matches(/^\+?[\d\s-]{7,15}$/).withMessage('Please enter a valid phone number.'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters.'),
    body('confirmPassword').notEmpty().withMessage('Confirm password is required.'),
  ],
  validateRequest,
  register
);

router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Valid email is required.'),
    body('password').notEmpty().withMessage('Password is required.'),
  ],
  validateRequest,
  login
);

router.post(
  '/forgot-password',
  [body('email').isEmail().withMessage('Valid email is required.')],
  validateRequest,
  forgotPassword
);

router.post(
  '/reset-password',
  [
    body('token').notEmpty().withMessage('Reset token is required.'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters.'),
    body('confirmPassword').notEmpty().withMessage('Confirm password is required.'),
  ],
  validateRequest,
  resetPassword
);

router.post(
  '/reset-password/:token',
  [
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters.'),
    body('confirmPassword').notEmpty().withMessage('Confirm password is required.'),
  ],
  validateRequest,
  resetPassword
);

router.get('/profile', protect, getProfile);

module.exports = router;