const jwt = require('jsonwebtoken');
const User = require('../models/User');
const asyncHandler = require('../utils/asyncHandler');
const AppError = require('../utils/AppError');

const signToken = (payload) =>
  jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });

const protect = asyncHandler(async (req, _res, next) => {
  let token = null;

  if (req.headers.authorization?.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    throw new AppError('Not authorized. Please login again.', 401);
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const user = await User.findById(decoded.id);

  if (!user || !user.isActive) {
    throw new AppError('User not found or inactive.', 401);
  }

  req.user = user;
  next();
});

const authorize = (...roles) => (req, _res, next) => {
  if (!req.user || !roles.includes(req.user.role)) {
    return next(new AppError('You are not allowed to access this resource.', 403));
  }

  return next();
};

module.exports = {
  protect,
  authorize,
  signToken,
};