const express = require('express');
const { body } = require('express-validator');
const {
  createEnquiry,
  getEnquiries,
  updateEnquiry,
  deleteEnquiry,
} = require('../controllers/enquiryController');
const { protect, authorize } = require('../middleware/auth');
const { validateRequest } = require('../middleware/validate');

const router = express.Router();

router.post(
  '/',
  [
    body('name').trim().isLength({ min: 2 }).withMessage('Name is required.'),
    body('phone').matches(/^\+?[\d\s-]{7,15}$/).withMessage('Valid phone number is required.'),
    body('email').isEmail().withMessage('Valid email is required.'),
    body('address').trim().isLength({ min: 5 }).withMessage('Address is required.'),
    body('rentalStartDate').isISO8601().withMessage('Valid rental start date is required.'),
    body('rentalEndDate').isISO8601().withMessage('Valid rental end date is required.'),
    body('quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1.'),
    body('productSelected').isMongoId().withMessage('A valid product is required.'),
  ],
  validateRequest,
  createEnquiry
);

router.get('/', protect, authorize('admin'), getEnquiries);

router.put(
  '/:id',
  protect,
  authorize('admin'),
  [
    body('status').optional().isIn(['Pending', 'Reviewed', 'Approved', 'Rejected', 'Closed']).withMessage('Invalid status.'),
    body('adminMessage')
      .optional()
      .trim()
      .isLength({ max: 1500 })
      .withMessage('Admin message cannot exceed 1500 characters.'),
    body('status').custom((status, { req }) => {
      if (status === 'Rejected' && !String(req.body.adminMessage || '').trim()) {
        throw new Error('Admin message is required when rejecting a booking.');
      }

      return true;
    }),
  ],
  validateRequest,
  updateEnquiry
);

router.delete('/:id', protect, authorize('admin'), deleteEnquiry);

module.exports = router;
