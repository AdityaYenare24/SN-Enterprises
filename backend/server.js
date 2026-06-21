require('dotenv').config();

const path = require('path');
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const mongoSanitize = require('express-mongo-sanitize');
const rateLimit = require('express-rate-limit');
const hpp = require('hpp');
const cookieParser = require('cookie-parser');

const { connectDatabase } = require('./config/db');
const notFound = require('./middleware/notFound');
const errorHandler = require('./middleware/errorHandler');

const app = express();
const PORT = Number(process.env.PORT) || 5000;
const normalizeOrigin = (value = '') => value.trim().replace(/\/+$/, '').toLowerCase();
const localOrigins = ['http://localhost:3000', 'http://127.0.0.1:3000', 'http://localhost:5173'];

const allowedOrigins = [
  ...(process.env.FRONTEND_URL || '').split(','),
  ...(process.env.CLIENT_URL || '').split(','),
  ...localOrigins,
]
  .map((origin) => normalizeOrigin(origin))
  .filter(Boolean);

const isDevEnvironment = (process.env.NODE_ENV || 'development') !== 'production';

const isLocalOrigin = (origin) => {
  try {
    const url = new URL(origin);
    return ['localhost', '127.0.0.1', '::1'].includes(url.hostname);
  } catch (_error) {
    return false;
  }
};

app.set('trust proxy', 1);

app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  })
);

app.use(
  cors({
    origin(origin, callback) {
      if (!origin) {
        return callback(null, true);
      }

      const normalizedOrigin = normalizeOrigin(origin);

      if (allowedOrigins.includes('*') || allowedOrigins.includes(normalizedOrigin)) {
        return callback(null, true);
      }

      if (isDevEnvironment || isLocalOrigin(normalizedOrigin)) {
        return callback(null, true);
      }

      return callback(new Error(`CORS policy blocked this origin: ${origin}`));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  })
);

const globalRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 500,
  standardHeaders: true,
  legacyHeaders: false,
  message: 'Too many requests from this IP. Please try again after 15 minutes.',
});

const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 40,
  standardHeaders: true,
  legacyHeaders: false,
  message: 'Too many auth attempts. Please retry after 15 minutes.',
});

app.use(globalRateLimiter);
app.use('/api/auth', authRateLimiter);

app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(mongoSanitize());
app.use(hpp());
app.use(compression());

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.get('/api/health', (_req, res) => {
  res.status(200).json({
    success: true,
    status: 'ok',
    service: 'S N Enterprises API',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
  });
});

app.use('/api/auth', require('./routes/auth'));
app.use('/api/products', require('./routes/products'));
app.use('/api/enquiries', require('./routes/enquiries'));
app.use('/api/contact', require('./routes/contact'));
app.use('/api/admin', require('./routes/admin'));

app.use(notFound);
app.use(errorHandler);

const startServer = async () => {
  try {
    await connectDatabase(process.env.MONGODB_URI);
    console.log('MongoDB connected successfully.');

    app.listen(PORT, () => {
      console.log(`S N Enterprises API running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Server startup failed:', error.message);
    process.exit(1);
  }
};

startServer();
