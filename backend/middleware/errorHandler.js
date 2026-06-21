const mongoose = require('mongoose');
const AppError = require('../utils/AppError');

const sendDevError = (err, res) => {
  res.status(err.statusCode || 500).json({
    success: false,
    status: err.status,
    message: err.message,
    stack: err.stack,
  });
};

const sendProdError = (err, res) => {
  if (err.isOperational) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
    });
  }

  return res.status(500).json({
    success: false,
    message: 'Something went wrong. Please try again later.',
  });
};

const handleMongooseValidationError = (err) => {
  const message = Object.values(err.errors)
    .map((entry) => entry.message)
    .join(', ');

  return new AppError(message, 400);
};

const handleMongooseCastError = (err) =>
  new AppError(`Invalid ${err.path}: ${err.value}`, 400);

const handleDuplicateKey = (err) => {
  const duplicateField = Object.keys(err.keyValue || {})[0] || 'field';
  return new AppError(`Duplicate value for ${duplicateField}. Please use another value.`, 400);
};

const handleJwtErrors = (err) => {
  if (err.name === 'TokenExpiredError') {
    return new AppError('Session expired. Please login again.', 401);
  }

  return new AppError('Invalid token. Please login again.', 401);
};

const errorHandler = (err, _req, res, _next) => {
  let formattedError = err;

  if (!(formattedError instanceof AppError)) {
    formattedError = new AppError(err.message || 'Unexpected server error.', err.statusCode || 500);
  }

  if (err instanceof mongoose.Error.ValidationError) {
    formattedError = handleMongooseValidationError(err);
  }

  if (err instanceof mongoose.Error.CastError) {
    formattedError = handleMongooseCastError(err);
  }

  if (err.code === 11000) {
    formattedError = handleDuplicateKey(err);
  }

  if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
    formattedError = handleJwtErrors(err);
  }

  if (process.env.NODE_ENV === 'production') {
    return sendProdError(formattedError, res);
  }

  return sendDevError(formattedError, res);
};

module.exports = errorHandler;