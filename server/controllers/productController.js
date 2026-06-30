const Product = require('../models/Product');
const path    = require('path');
const fs      = require('fs');

/* ── helper: build public URL list from multer files ── */
const filesToUrls = (files) =>
  (files || []).map(f => `/uploads/${f.filename}`);

/* ── helper: delete old image files from disk ────────── */
const deleteFile = (urlPath) => {
  try {
    const abs = path.join(__dirname, '..', urlPath);
    if (fs.existsSync(abs)) fs.unlinkSync(abs);
  } catch (_) { /* ignore */ }
};

// @GET /api/products
exports.getProducts = async (req, res) => {
  try {
    const { category, search, minPrice, maxPrice, sort, page = 1, limit = 12 } = req.query;
    const query = { isActive: true };

    if (category)              query.category = category;
    if (search)                query.name = { $regex: search, $options: 'i' };
    if (minPrice || maxPrice)  query.price = {};
    if (minPrice)              query.price.$gte = Number(minPrice);
    if (maxPrice)              query.price.$lte = Number(maxPrice);

    const sortMap = {
      'price-asc':  { price: 1 },
      'price-desc': { price: -1 },
      'newest':     { createdAt: -1 },
      'rating':     { ratings: -1 },
    };

    const skip     = (page - 1) * limit;
    const total    = await Product.countDocuments(query);
    const products = await Product.find(query)
      .sort(sortMap[sort] || { createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    res.json({ success: true, products, total, page: Number(page), pages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @GET /api/products/featured
exports.getFeatured = async (req, res) => {
  try {
    const products = await Product.find({ isFeatured: true, isActive: true }).limit(6);
    res.json({ success: true, products });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @GET /api/products/:id
exports.getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
    res.json({ success: true, product });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @POST /api/products  (Admin)
exports.createProduct = async (req, res) => {
  try {
    /* uploaded images → URL array */
    const uploadedImages = filesToUrls(req.files);

    /* also accept image URLs sent as plain text (fallback) */
    let existingImages = [];
    if (req.body.images) {
      existingImages = Array.isArray(req.body.images)
        ? req.body.images
        : [req.body.images];
    }

    const images  = [...uploadedImages, ...existingImages].filter(Boolean);
    const product = await Product.create({ ...req.body, images });
    res.status(201).json({ success: true, product });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @PUT /api/products/:id  (Admin)
exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });

    const newUploads = filesToUrls(req.files);

    /* keepImages = images that were already saved and the admin wants to keep */
    let keepImages = [];
    if (req.body.keepImages) {
      keepImages = Array.isArray(req.body.keepImages)
        ? req.body.keepImages
        : [req.body.keepImages];
    }

    /* images that were removed → delete from disk */
    const removed = product.images.filter(img => !keepImages.includes(img));
    removed.forEach(deleteFile);

    const images  = [...keepImages, ...newUploads].filter(Boolean);
    const updated = await Product.findByIdAndUpdate(
      req.params.id,
      { ...req.body, images },
      { new: true, runValidators: true }
    );

    res.json({ success: true, product: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @DELETE /api/products/:id  (Admin — soft delete)
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
    res.json({ success: true, message: 'Product deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
