const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name:         { type: String, required: [true, 'Product name required'], trim: true },
    description:  { type: String, required: true },
    price:        { type: Number, required: true, min: 0 },
    discountPrice:{ type: Number, default: 0 },
    category:     { type: String, required: true },   // dynamic — validated against Category collection
    brand:        { type: String, required: true },
    stock:        { type: Number, required: true, default: 0 },
    images:       [{ type: String }],
    specs: {
      frameSize: String,
      gears:     String,
      brakeType: String,
      wheelSize: String,
      weight:    String,
      color:     String,
      material:  String,
    },
    ratings:    { type: Number, default: 0 },
    numReviews: { type: Number, default: 0 },
    isFeatured: { type: Boolean, default: false },
    isActive:   { type: Boolean, default: true },
  },
  { timestamps: true }
);

// Virtual for discount percentage
productSchema.virtual('discountPercent').get(function () {
  if (this.discountPrice && this.discountPrice < this.price) {
    return Math.round(((this.price - this.discountPrice) / this.price) * 100);
  }
  return 0;
});

productSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Product', productSchema);
