const nodemailer = require('nodemailer');

const isEmailConfigured = () =>
  Boolean(process.env.EMAIL_HOST && process.env.EMAIL_PORT && process.env.EMAIL_USER && process.env.EMAIL_PASS);

const createTransporter = () => {
  if (!isEmailConfigured()) {
    return null;
  }

  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT),
    secure: Number(process.env.EMAIL_PORT) === 465,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
};

const sendEmail = async ({ to, subject, html, text }) => {
  const transporter = createTransporter();

  if (!transporter) {
    return { skipped: true, reason: 'Email transporter not configured.' };
  }

  const info = await transporter.sendMail({
    from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
    to,
    subject,
    html,
    text,
  });

  return { skipped: false, messageId: info.messageId };
};

const escapeHtml = (value = '') =>
  String(value ?? '').replace(/[&<>"']/g, (char) => {
    const entities = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;',
    };

    return entities[char];
  });

const formatDate = (value) => {
  if (!value) return 'N/A';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'N/A';

  return date.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

const getBookingReference = (id) => `SNB-${String(id || '').slice(-6).toUpperCase()}`;

const sendPasswordResetEmail = async ({ name, email, resetUrl }) => {
  const subject = 'Reset your S N Enterprises password';
  const text = `Hi ${name},\n\nUse this link to reset your password: ${resetUrl}\n\nThis link will expire in 15 minutes.\n\nIf you did not request this, please ignore this email.`;
  const html = `
    <div style="font-family:Arial,sans-serif;line-height:1.6;color:#111;">
      <h2 style="margin-bottom:8px;">S N Enterprises</h2>
      <p>Hi ${name},</p>
      <p>We received a request to reset your password.</p>
      <p>
        <a href="${resetUrl}" style="display:inline-block;background:#f5c400;color:#111;padding:10px 16px;border-radius:6px;text-decoration:none;font-weight:700;">
          Reset Password
        </a>
      </p>
      <p>This link will expire in 15 minutes.</p>
      <p>If you did not request this, you can safely ignore this email.</p>
    </div>
  `;

  return sendEmail({ to: email, subject, text, html });
};

const sendBookingStatusEmail = async ({ enquiry, productName, adminMessage = '' }) => {
  const status = enquiry.status;
  const isApproved = status === 'Approved';
  const isRejected = status === 'Rejected';

  if (!isApproved && !isRejected) {
    return { skipped: true, reason: 'No customer email is configured for this status.' };
  }

  const bookingReference = getBookingReference(enquiry._id);
  const safeName = escapeHtml(enquiry.name);
  const safeProductName = escapeHtml(productName || enquiry.productSelected?.name || 'Selected product');
  const safeAdminMessage = escapeHtml(adminMessage || enquiry.adminMessage || '');
  const rentalDates = `${formatDate(enquiry.rentalStartDate)} to ${formatDate(enquiry.rentalEndDate)}`;
  const subject = isApproved
    ? `Booking approved - ${bookingReference}`
    : `Booking update - ${bookingReference}`;
  const statusLine = isApproved
    ? 'Your booking has been approved by S N Enterprises.'
    : 'Your booking request has been rejected by S N Enterprises.';
  const textLines = [
    `Hi ${enquiry.name},`,
    '',
    statusLine,
    '',
    `Booking ID: ${bookingReference}`,
    `Product: ${productName || enquiry.productSelected?.name || 'Selected product'}`,
    `Quantity: ${enquiry.quantity}`,
    `Rental Dates: ${rentalDates}`,
  ];

  if (isRejected) {
    textLines.push('', `Message from admin: ${adminMessage || enquiry.adminMessage || 'N/A'}`);
  }

  textLines.push('', 'Thank you,', 'S N Enterprises');

  const html = `
    <div style="font-family:Arial,sans-serif;color:#111;line-height:1.6;">
      <h2 style="margin-bottom:8px;">S N Enterprises</h2>
      <p>Hi ${safeName},</p>
      <p>${escapeHtml(statusLine)}</p>
      <ul style="padding-left:18px;">
        <li><strong>Booking ID:</strong> ${bookingReference}</li>
        <li><strong>Product:</strong> ${safeProductName}</li>
        <li><strong>Quantity:</strong> ${enquiry.quantity}</li>
        <li><strong>Rental Dates:</strong> ${escapeHtml(rentalDates)}</li>
      </ul>
      ${
        isRejected
          ? `<p><strong>Message from admin:</strong></p><p style="white-space:pre-line;">${safeAdminMessage}</p>`
          : '<p>Our team will contact you shortly for the next steps.</p>'
      }
      <p>Thank you,<br/>S N Enterprises</p>
    </div>
  `;

  return sendEmail({
    to: enquiry.email,
    subject,
    text: textLines.join('\n'),
    html,
  });
};

const sendEnquiryNotification = async ({ adminEmail, enquiry, productName }) => {
  if (!adminEmail) {
    return { skipped: true, reason: 'ADMIN_EMAIL not configured.' };
  }

  const subject = `New rental enquiry: ${productName}`;
  const text = `
Name: ${enquiry.name}
Phone: ${enquiry.phone}
Email: ${enquiry.email}
Company: ${enquiry.companyName || 'N/A'}
Product: ${productName}
Quantity: ${enquiry.quantity}
Rental: ${new Date(enquiry.rentalStartDate).toDateString()} to ${new Date(enquiry.rentalEndDate).toDateString()}
Message: ${enquiry.message || 'N/A'}
  `;

  const html = `
    <div style="font-family:Arial,sans-serif;color:#111;line-height:1.6;">
      <h2>New Rental Enquiry</h2>
      <ul style="padding-left:18px;">
        <li><strong>Name:</strong> ${enquiry.name}</li>
        <li><strong>Phone:</strong> ${enquiry.phone}</li>
        <li><strong>Email:</strong> ${enquiry.email}</li>
        <li><strong>Company:</strong> ${enquiry.companyName || 'N/A'}</li>
        <li><strong>Product:</strong> ${productName}</li>
        <li><strong>Quantity:</strong> ${enquiry.quantity}</li>
        <li><strong>Rental Dates:</strong> ${new Date(enquiry.rentalStartDate).toDateString()} to ${new Date(enquiry.rentalEndDate).toDateString()}</li>
      </ul>
      <p><strong>Message:</strong> ${enquiry.message || 'N/A'}</p>
    </div>
  `;

  return sendEmail({ to: adminEmail, subject, text, html });
};

module.exports = {
  sendEmail,
  sendPasswordResetEmail,
  sendBookingStatusEmail,
  sendEnquiryNotification,
};
