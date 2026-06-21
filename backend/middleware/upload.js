const path = require('path');
const fs = require('fs');
const multer = require('multer');
const AppError = require('../utils/AppError');

const uploadsPath = path.join(__dirname, '..', 'uploads');

if (!fs.existsSync(uploadsPath)) {
  fs.mkdirSync(uploadsPath, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadsPath);
  },
  filename: (_req, file, cb) => {
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${file.fieldname}-${unique}${path.extname(file.originalname)}`);
  },
});

const allowedMime = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

const fileFilter = (_req, file, cb) => {
  if (!allowedMime.includes(file.mimetype)) {
    return cb(new AppError('Only jpg, jpeg, png, and webp images are allowed.', 400));
  }

  cb(null, true);
};

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter,
});

module.exports = upload;