const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
require('dotenv').config();

// Route imports
const authRoutes     = require('./routes/authRoutes');
const productRoutes  = require('./routes/productRoutes');
const orderRoutes    = require('./routes/orderRoutes');
const userRoutes     = require('./routes/userRoutes');
const reviewRoutes   = require('./routes/reviewRoutes');
const paymentRoutes  = require('./routes/paymentRoutes');
const adminRoutes    = require('./routes/adminRoutes');
const categoryRoutes = require('./routes/categoryRoutes');

const app = express();

// ── CORS — allows localhost in dev, Vercel domain in production ───────────────
const allowedOrigins = [
  'http://localhost:3000',
  process.env.CLIENT_URL, // set this to your Vercel URL on Render
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, Postman, curl)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    callback(new Error(`CORS blocked: ${origin}`));
  },
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
if (process.env.NODE_ENV !== 'production') app.use(morgan('dev'));

// ── Static uploads folder ─────────────────────────────
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ── API Routes ────────────────────────────────────────
app.use('/api/auth',       authRoutes);
app.use('/api/products',   productRoutes);
app.use('/api/orders',     orderRoutes);
app.use('/api/users',      userRoutes);
app.use('/api/reviews',    reviewRoutes);
app.use('/api/payment',    paymentRoutes);
app.use('/api/admin',      adminRoutes);
app.use('/api/categories', categoryRoutes);

// ── Health check ──────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Abhay Cycle API running 🚴' });
});

// ── Global error handler ──────────────────────────────
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});

// ── Seed default categories if none exist ─────────────
async function seedCategories() {
  const Category = require('./models/Category');
  const count = await Category.countDocuments();
  if (count === 0) {
    await Category.insertMany([
      { name: 'MTB',  slug: 'mtb',  description: 'Mountain Bikes', order: 1 },
      { name: 'Road', slug: 'road', description: 'Road Bikes',     order: 2 },
      { name: 'Kids', slug: 'kids', description: 'Kids Cycles',    order: 3 },
    ]);
    console.log('✅ Default categories seeded');
  }
}

// ── Connect DB & Start ────────────────────────────────
mongoose
  .connect(process.env.MONGO_URI)
  .then(async () => {
    console.log('✅ MongoDB connected');
    await seedCategories();
    const port = process.env.PORT || 5000;
    app.listen(port, () =>
      console.log(`🚴 Server running on port ${port}`)
    );
  })
  .catch((err) => {
    console.error('❌ MongoDB connection failed:', err.message);
    process.exit(1);
  });
