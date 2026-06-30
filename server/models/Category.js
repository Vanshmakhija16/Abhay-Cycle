const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema(
  {
    name:        { type: String, required: true, unique: true, trim: true },
    slug:        { type: String, required: true, unique: true, trim: true, lowercase: true },
    description: { type: String, default: '' },
    isActive:    { type: Boolean, default: true },
    order:       { type: Number, default: 0 },
  },
  { timestamps: true }
);

// Auto-generate slug from name before save
categorySchema.pre('save', function (next) {
  if (this.isModified('name')) {
    this.slug = this.name.trim().toUpperCase().replace(/\s+/g, '-');
  }
  next();
});

module.exports = mongoose.model('Category', categorySchema);
