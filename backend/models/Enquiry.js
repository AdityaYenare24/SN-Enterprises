const mongoose = require('mongoose');

const enquirySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
      match: [/^\+?[\d\s-]{7,15}$/, 'Please enter a valid phone number'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address'],
    },
    companyName: {
      type: String,
      trim: true,
      default: '',
    },
    address: {
      type: String,
      required: [true, 'Address is required'],
      trim: true,
      maxlength: [400, 'Address cannot exceed 400 characters'],
    },
    rentalStartDate: {
      type: Date,
      required: [true, 'Rental start date is required'],
    },
    rentalEndDate: {
      type: Date,
      required: [true, 'Rental end date is required'],
      validate: {
        validator(value) {
          return !this.rentalStartDate || value >= this.rentalStartDate;
        },
        message: 'Rental end date must be after start date.',
      },
    },
    quantity: {
      type: Number,
      required: [true, 'Quantity is required'],
      min: [1, 'Quantity must be at least 1'],
    },
    productSelected: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: [true, 'Product is required'],
    },
    message: {
      type: String,
      trim: true,
      maxlength: [1500, 'Message cannot exceed 1500 characters'],
      default: '',
    },
    adminMessage: {
      type: String,
      trim: true,
      maxlength: [1500, 'Admin message cannot exceed 1500 characters'],
      default: '',
    },
    status: {
      type: String,
      enum: ['Pending', 'Reviewed', 'Approved', 'Rejected', 'Closed'],
      default: 'Pending',
    },
    source: {
      type: String,
      enum: ['website', 'phone', 'whatsapp', 'email'],
      default: 'website',
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

enquirySchema.index({ status: 1, createdAt: -1 });

enquirySchema.virtual('rentalDays').get(function rentalDays() {
  if (!this.rentalStartDate || !this.rentalEndDate) return 0;
  const diff = this.rentalEndDate.getTime() - this.rentalStartDate.getTime();
  return Math.max(1, Math.ceil(diff / (1000 * 60 * 60 * 24)));
});

module.exports = mongoose.model('Enquiry', enquirySchema);
