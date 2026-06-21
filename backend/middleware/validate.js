const { validationResult } = require('express-validator');
const AppError = require('../utils/AppError');

const validateRequest = (req, _res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const message = errors
      .array()
      .map((entry) => entry.msg)
      .join(', ');

    return next(new AppError(message, 400));
  }

  return next();
};

module.exports = {
  validateRequest,
};