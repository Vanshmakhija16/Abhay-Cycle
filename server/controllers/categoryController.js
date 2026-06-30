const Category = require('../models/Category');
const Product  = require('../models/Product');

// @GET /api/categories — public
exports.getCategories = async (req, res) => {
  try {
    const categories = await Category.find({ isActive: true }).sort({ order: 1, name: 1 });
    res.json({ success: true, categories });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @GET /api/categories/all — admin (includes inactive)
exports.getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort({ order: 1, name: 1 });
    res.json({ success: true, categories });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @POST /api/categories — admin
exports.createCategory = async (req, res) => {
  try {
    const { name, description, order } = req.body;
    if (!name) return res.status(400).json({ success: false, message: 'Name is required' });

    const exists = await Category.findOne({ name: name.trim() });
    if (exists) return res.status(400).json({ success: false, message: 'Category already exists' });

    const slug = name.trim().toUpperCase().replace(/\s+/g, '-');
    const category = await Category.create({ name: name.trim(), slug, description, order: order || 0 });
    res.status(201).json({ success: true, category });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @PUT /api/categories/:id — admin
exports.updateCategory = async (req, res) => {
  try {
    const { name, description, isActive, order } = req.body;
    const slug = name ? name.trim().toUpperCase().replace(/\s+/g, '-') : undefined;

    const category = await Category.findByIdAndUpdate(
      req.params.id,
      { ...(name && { name: name.trim(), slug }), description, isActive, order },
      { new: true, runValidators: true }
    );
    if (!category) return res.status(404).json({ success: false, message: 'Category not found' });
    res.json({ success: true, category });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @DELETE /api/categories/:id — admin
exports.deleteCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) return res.status(404).json({ success: false, message: 'Category not found' });

    // Check if any products use this category
    const productCount = await Product.countDocuments({ category: category.name });
    if (productCount > 0) {
      return res.status(400).json({
        success: false,
        message: `Cannot delete — ${productCount} product(s) are using this category. Reassign them first.`,
      });
    }

    await Category.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Category deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
