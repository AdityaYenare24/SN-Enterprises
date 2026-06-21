const express = require('express');
const { body } = require('express-validator');
const {
  getDashboardStats,
  getUsers,
  createUser,
  deleteUser,
  getAnalytics,
  setProductAvailability,
} = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/auth');
const { validateRequest } = require('../middleware/validate');

const router = express.Router();

router.use(protect, authorize('admin'));

router.get('/dashboard', getDashboardStats);
router.get('/users', getUsers);
router.post(
  '/users',
  [
    body('name').trim().isLength({ min: 2 }).withMessage('Name is required.'),
    body('email').isEmail().withMessage('Valid email is required.'),
    body('phone').optional({ checkFalsy: true }).matches(/^\+?[\d\s-]{7,15}$/).withMessage('Valid phone number is required.'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters.'),
    body('role').optional().isIn(['user', 'admin']).withMessage('Invalid role.'),
  ],
  validateRequest,
  createUser
);
router.delete('/users/:id', deleteUser);
router.get('/analytics', getAnalytics);

router.patch(
  '/products/:id/availability',
  [
    body('availabilityStatus').optional().isIn(['Available', 'Limited', 'Out of Stock']).withMessage('Invalid availability status.'),
    body('quantity').optional().isInt({ min: 0 }).withMessage('Quantity cannot be negative.'),
  ],
  validateRequest,
  setProductAvailability
);

module.exports = router;
