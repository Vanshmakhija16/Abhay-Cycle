import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiShoppingCart, FiStar, FiHeart } from 'react-icons/fi';
import { useCart } from '../../context/CartContext';
import toast from 'react-hot-toast';

/**
 * ProductCard — reusable product tile used in Shop, Home featured, Admin previews
 * @param {object}  product   - product document from MongoDB
 * @param {boolean} compact   - smaller card variant (optional)
 */
const ProductCard = ({ product, compact = false }) => {
  const { addToCart } = useCart();
  const [wishlisted, setWishlisted] = useState(false);

  const finalPrice = product.discountPrice > 0 ? product.discountPrice : product.price;
  const hasDiscount = product.discountPrice > 0 && product.discountPrice < product.price;

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
    toast.success(`${product.name} added to cart! 🚴`);
  };

  const toggleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setWishlisted(w => !w);
    toast(wishlisted ? 'Removed from wishlist' : 'Added to wishlist ❤️');
  };

  return (
    <motion.div
      whileHover={{ y: -6 }}
      className={`group bg-white dark:bg-[#1C1C2E] rounded-2xl overflow-hidden shadow-md 
        hover:shadow-2xl hover:shadow-red-500/10 dark:hover:shadow-orange-500/10 
        transition-all duration-300 border border-gray-100 dark:border-gray-800 
        flex flex-col ${compact ? 'text-xs' : ''}`}
    >
      <Link to={`/product/${product._id}`} className="flex flex-col flex-1">
        {/* ── Image ── */}
        <div className={`relative ${compact ? 'h-36' : 'h-52'} bg-gray-50 dark:bg-[#0F0F1A] overflow-hidden`}>
          {product.images?.[0] ? (
            <img
              src={product.images[0]}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className={compact ? 'text-4xl' : 'text-6xl'}>🚴</span>
            </div>
          )}

          {/* Discount badge */}
          {hasDiscount && (
            <div className="absolute top-2 left-2 px-2 py-0.5 bg-red-600 dark:bg-orange-500 text-white text-xs font-bold rounded-lg shadow">
              -{product.discountPercent}%
            </div>
          )}

          {/* Featured badge */}
          {product.isFeatured && (
            <div className="absolute top-2 right-10 px-2 py-0.5 bg-yellow-500 text-white text-xs font-bold rounded-lg shadow">
              ⭐ Featured
            </div>
          )}

          {/* Wishlist btn */}
          <button
            onClick={toggleWishlist}
            className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white dark:bg-gray-800 
              flex items-center justify-center shadow-md 
              opacity-0 group-hover:opacity-100 transition-opacity duration-200"
          >
            <FiHeart
              size={14}
              className={wishlisted ? 'text-red-500 fill-red-500' : 'text-gray-400'}
            />
          </button>
        </div>

        {/* ── Info ── */}
        <div className={`${compact ? 'p-3' : 'p-4'} flex flex-col flex-1`}>
          {/* Category + Brand */}
          <div className="text-xs text-red-600 dark:text-orange-400 font-semibold uppercase tracking-wider mb-1">
            {product.category} • {product.brand}
          </div>

          {/* Name */}
          <h3 className={`font-heading font-semibold text-gray-900 dark:text-white ${compact ? 'text-xs' : 'text-sm'} mb-2 line-clamp-2 flex-1`}>
            {product.name}
          </h3>

          {/* Stars */}
          <div className="flex items-center gap-1 mb-3">
            {[...Array(5)].map((_, i) => (
              <FiStar
                key={i}
                size={compact ? 10 : 12}
                className={i < Math.round(product.ratings) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300 dark:text-gray-600'}
              />
            ))}
            <span className="text-xs text-gray-400 ml-1">({product.numReviews})</span>
          </div>

          {/* Price row */}
          <div className="flex items-center justify-between mt-auto">
            <div className="flex items-baseline gap-1.5">
              <span className={`font-bold ${compact ? 'text-base' : 'text-lg'} text-gray-900 dark:text-white`}>
                ₹{finalPrice.toLocaleString()}
              </span>
              {hasDiscount && (
                <span className="text-xs text-gray-400 line-through">
                  ₹{product.price.toLocaleString()}
                </span>
              )}
            </div>
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
              product.stock > 0
                ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                : 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400'
            }`}>
              {product.stock > 0 ? 'In Stock' : 'Sold Out'}
            </span>
          </div>
        </div>
      </Link>

      {/* ── Add to Cart ── */}
      <div className={`${compact ? 'px-3 pb-3' : 'px-4 pb-4'}`}>
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={handleAddToCart}
          disabled={product.stock === 0}
          className="w-full flex items-center justify-center gap-2 py-2.5 
            bg-red-600 dark:bg-orange-500 text-white rounded-xl font-medium 
            text-sm hover:bg-red-700 dark:hover:bg-orange-600 
            transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <FiShoppingCart size={14} />
          {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
        </motion.button>
      </div>
    </motion.div>
  );
};

export default ProductCard;
