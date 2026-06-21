const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    designation: {
      type: String,
      default: 'Administrator',
    },
    permissions: {
      manageProducts: { type: Boolean, default: true },
      manageEnquiries: { type: Boolean, default: true },
      manageUsers: { type: Boolean, default: true },
      manageContent: { type: Boolean, default: true },
      manageSettings: { type: Boolean, default: true },
    },
    notes: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Admin', adminSchema);