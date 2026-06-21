const crypto = require('crypto');
const User = require('../models/User');
const Admin = require('../models/Admin');
const asyncHandler = require('../utils/asyncHandler');
const AppError = require('../utils/AppError');
const { signToken } = require('../middleware/auth');
const { sendPasswordResetEmail } = require('../services/emailService');

const sendAuthResponse = (res, user, statusCode = 200, message = 'Success') => {
  const token = signToken({ id: user._id, role: user.role });

  return res.status(statusCode).json({
    success: true,
    message,
    token,
    user: user.toPublic(),
  });
};

const register = asyncHandler(async (req, res) => {
  const { name, email, phone = '', password, confirmPassword } = req.body;

  if (password !== confirmPassword) {
    throw new AppError('Password and confirm password must match.', 400);
  }

  const existingUser = await User.findOne({ email: email.toLowerCase().trim() });

  if (existingUser) {
    throw new AppError('An account with this email already exists.', 409);
  }

  const user = await User.create({
    name: name.trim(),
    email: email.toLowerCase().trim(),
    phone: phone.trim(),
    password,
  });

  if (user.role === 'admin') {
    await Admin.findOneAndUpdate(
      { user: user._id },
      { user: user._id, designation: 'Administrator' },
      { upsert: true, new: true }
    );
  }

  return sendAuthResponse(res, user, 201, 'Account created successfully.');
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email: email.toLowerCase().trim() }).select('+password');

  if (!user || !(await user.comparePassword(password))) {
    throw new AppError('Invalid email or password.', 401);
  }

  if (!user.isActive) {
    throw new AppError('This account is inactive. Please contact support.', 403);
  }

  user.lastLoginAt = new Date();
  await user.save({ validateBeforeSave: false });

  return sendAuthResponse(res, user, 200, 'Logged in successfully.');
});

const getProfile = asyncHandler(async (req, res) => {
  res.status(200).json({
    success: true,
    user: req.user.toPublic(),
  });
});

const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email: email.toLowerCase().trim() });
  const successMessage = 'If that email exists, a password reset link has been sent.';

  if (!user) {
    return res.status(200).json({
      success: true,
      message: successMessage,
    });
  }

  const rawToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  const baseUrl = process.env.CLIENT_URL || process.env.FRONTEND_URL || 'http://localhost:3000';
  const resetUrl = `${baseUrl}/reset-password/${rawToken}`;

  try {
    await sendPasswordResetEmail({
      name: user.name,
      email: user.email,
      resetUrl,
    });
  } catch (error) {
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;
    await user.save({ validateBeforeSave: false });
    throw new AppError('Unable to send reset email right now. Please try again later.', 500);
  }

  return res.status(200).json({
    success: true,
    message: successMessage,
    _devResetUrl: process.env.NODE_ENV !== 'production' ? resetUrl : undefined,
  });
});

const resetPassword = asyncHandler(async (req, res) => {
  const incomingToken = req.params.token || req.body.token;
  const { password, confirmPassword } = req.body;

  if (!incomingToken) {
    throw new AppError('Reset token is required.', 400);
  }

  if (password !== confirmPassword) {
    throw new AppError('Password and confirm password must match.', 400);
  }

  const hashedToken = crypto.createHash('sha256').update(incomingToken).digest('hex');

  const user = await User.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpires: { $gt: Date.now() },
  }).select('+password');

  if (!user) {
    throw new AppError('Reset link is invalid or expired. Please request a new link.', 400);
  }

  user.password = password;
  user.resetPasswordToken = null;
  user.resetPasswordExpires = null;
  await user.save();

  return sendAuthResponse(res, user, 200, 'Password reset successful.');
});

module.exports = {
  register,
  login,
  getProfile,
  forgotPassword,
  resetPassword,
};