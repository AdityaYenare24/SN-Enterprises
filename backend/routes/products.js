const express = require('express');
const { body } = require('express-validator');
const {
  getProducts,
  getProductByIdOrSlug,
  createProduct,
  updateProduct,
  deleteProduct,
  updateProductAvailability,
} = require('../controllers/productController');
const { protect, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');
const { validateRequest } = require('../middleware/validate');

const router = express.Router();

const productValidation = [
  body('name').optional().trim().isLength({ min: 3 }).withMessage('Product name must be at least 3 characters.'),
  body('category').optional().notEmpty().withMessage('Category is required.'),
  body('description').optional().isLength({ min: 20 }).withMessage('Description must be at least 20 characters.'),
  body('pricePerDay').optional().isFloat({ min: 0 }).withMessage('Price per day must be a positive number.'),
  body('pricePerWeek').optional().isFloat({ min: 0 }).withMessage('Price per week must be a positive number.'),
  body('quantity').optional().isInt({ min: 0 }).withMessage('Quantity cannot be negative.'),
  body('rating').optional().isFloat({ min: 0, max: 5 }).withMessage('Rating must be between 0 and 5.'),
];

router.get('/', getProducts);
router.get('/:id', getProductByIdOrSlug);

router.post(
  '/',
  protect,
  authorize('admin'),
  upload.array('images', 10),
  productValidation,
  validateRequest,
  createProduct
);

router.put(
  '/:id',
  protect,
  authorize('admin'),
  upload.array('images', 10),
  productValidation,
  validateRequest,
  updateProduct
);

router.delete('/:id', protect, authorize('admin'), deleteProduct);

router.patch(
  '/:id/availability',
  protect,
  authorize('admin'),
  [
    body('availabilityStatus').optional().isIn(['Available', 'Limited', 'Out of Stock']).withMessage('Invalid availability status.'),
    body('quantity').optional().isInt({ min: 0 }).withMessage('Quantity cannot be negative.'),
  ],
  validateRequest,
  updateProductAvailability
);

module.exports = router;