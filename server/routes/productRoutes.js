const express = require('express');
const router  = express.Router();
const multer  = require('multer');
const path    = require('path');
const fs      = require('fs');

const {
  getProducts, getProduct, createProduct,
  updateProduct, deleteProduct, getFeatured,
} = require('../controllers/productController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

/* ── Multer storage config ───────────────────────────── */
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join(__dirname, '..', 'uploads');
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const ext  = path.extname(file.originalname).toLowerCase();
    const name = `product_${Date.now()}_${Math.round(Math.random() * 1e6)}${ext}`;
    cb(null, name);
  },
});

const fileFilter = (req, file, cb) => {
  const allowed = ['.jpg', '.jpeg', '.png', '.webp', '.avif'];
  const ext     = path.extname(file.originalname).toLowerCase();
  if (allowed.includes(ext)) cb(null, true);
  else cb(new Error('Only image files are allowed (jpg, jpeg, png, webp)'), false);
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 8 * 1024 * 1024 }, // 8 MB per file
});

/* ── Routes ─────────────────────────────────────────── */
router.get('/',          getProducts);
router.get('/featured',  getFeatured);
router.get('/:id',       getProduct);

// Create — accepts up to 5 images
router.post(
  '/',
  protect, adminOnly,
  upload.array('images', 5),
  createProduct,
);

// Update — also accepts new images (optional)
router.put(
  '/:id',
  protect, adminOnly,
  upload.array('images', 5),
  updateProduct,
);

router.delete('/:id', protect, adminOnly, deleteProduct);

module.exports = router;
