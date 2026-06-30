import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import axios from 'axios';
import toast from 'react-hot-toast';
import { FiShoppingCart, FiStar, FiTruck, FiShield, FiArrowLeft } from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { user } = useAuth();

  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const [activeImg, setActiveImg] = useState(0);
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '' });
  const [submitting, setSubmitting] = useState(false);
  const contentRef = useRef(null);

  useEffect(() => {
    fetchProduct();
    fetchReviews();
  }, [id]);

  useEffect(() => {
    if (product && contentRef.current) {
      gsap.fromTo('.product-detail-content',
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7, stagger: 0.1, ease: 'power3.out' }
      );
    }
  }, [product]);

  const fetchProduct = async () => {
    try {
      const res = await axios.get(`/api/products/${id}`);
      setProduct(res.data.product);
    } catch { toast.error('Product not found'); navigate('/shop'); }
    finally { setLoading(false); }
  };

  const fetchReviews = async () => {
    try {
      const res = await axios.get(`/api/reviews/${id}`);
      setReviews(res.data.reviews);
    } catch {}
  };

  const handleAddToCart = () => {
    addToCart(product, qty);
    toast.success(`Added ${qty} × ${product.name} to cart! 🚴`);
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!user) return toast.error('Please login to write a review');
    setSubmitting(true);
    try {
      await axios.post('/api/reviews', { productId: id, ...reviewForm });
      toast.success('Review submitted!');
      fetchReviews();
      fetchProduct();
      setReviewForm({ rating: 5, comment: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit review');
    } finally { setSubmitting(false); }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#FAF9F9] dark:bg-[#0F0F1A]">
      <div className="w-12 h-12 border-4 border-red-600 dark:border-orange-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (!product) return null;

  const finalPrice = product.discountPrice > 0 ? product.discountPrice : product.price;

  return (
    <div className="min-h-screen bg-[#FAF9F9] dark:bg-[#0F0F1A] pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        {/* Back button */}
        <button onClick={() => navigate('/shop')} className="flex items-center gap-2 text-gray-500 hover:text-red-600 dark:hover:text-orange-400 mb-8 transition-colors">
          <FiArrowLeft /> Back to Shop
        </button>

        <div ref={contentRef} className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Images */}
          <div className="product-detail-content">
            <div className="bg-white dark:bg-[#1C1C2E] rounded-3xl overflow-hidden h-80 md:h-96 flex items-center justify-center mb-4 shadow-lg">
              {product.images?.[activeImg] ? (
                <img src={product.images[activeImg]} alt={product.name} className="w-full h-full object-cover" />
              ) : (
                <div className="text-8xl">🚴</div>
              )}
            </div>
            {product.images?.length > 1 && (
              <div className="flex gap-3">
                {product.images.map((img, i) => (
                  <button key={i} onClick={() => setActiveImg(i)}
                    className={`w-16 h-16 rounded-xl overflow-hidden border-2 transition-all ${activeImg === i ? 'border-red-600 dark:border-orange-500' : 'border-transparent'}`}>
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="product-detail-content space-y-5">
            <div>
              <div className="text-sm text-red-600 dark:text-orange-400 font-semibold uppercase tracking-wider mb-1">{product.category} • {product.brand}</div>
              <h1 className="font-heading font-black text-3xl md:text-4xl text-gray-900 dark:text-white">{product.name}</h1>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-2">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <FiStar key={i} size={16} className={i < Math.round(product.ratings) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'} />
                ))}
              </div>
              <span className="text-gray-500 text-sm">{product.ratings} ({product.numReviews} reviews)</span>
            </div>

            {/* Price */}
            <div className="flex items-center gap-3">
              <span className="font-black text-4xl text-gray-900 dark:text-white">₹{finalPrice.toLocaleString()}</span>
              {product.discountPrice > 0 && product.discountPrice < product.price && (
                <>
                  <span className="text-xl text-gray-400 line-through">₹{product.price.toLocaleString()}</span>
                  <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-lg text-sm font-bold">{product.discountPercent}% OFF</span>
                </>
              )}
            </div>

            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{product.description}</p>

            {/* Specs */}
            {product.specs && (
              <div className="bg-white dark:bg-[#1C1C2E] rounded-2xl p-5 border border-gray-100 dark:border-gray-700">
                <h3 className="font-heading font-semibold text-gray-900 dark:text-white mb-3">Specifications</h3>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  {Object.entries(product.specs).filter(([, v]) => v).map(([key, value]) => (
                    <div key={key} className="flex justify-between py-1 border-b border-gray-50 dark:border-gray-700">
                      <span className="text-gray-500 capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                      <span className="font-medium text-gray-800 dark:text-gray-200">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Qty & Add to Cart */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 bg-white dark:bg-[#1C1C2E] border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-2">
                <button onClick={() => setQty(q => Math.max(1, q - 1))} className="w-7 h-7 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:text-red-600 font-bold text-lg">−</button>
                <span className="w-8 text-center font-semibold text-gray-900 dark:text-white">{qty}</span>
                <button onClick={() => setQty(q => Math.min(product.stock, q + 1))} className="w-7 h-7 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:text-red-600 font-bold text-lg">+</button>
              </div>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className="flex-1 flex items-center justify-center gap-2 py-3 bg-red-600 dark:bg-orange-500 text-white rounded-xl font-semibold hover:bg-red-700 dark:hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FiShoppingCart /> {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
              </motion.button>
            </div>

            {/* Trust badges */}
            <div className="flex gap-4 pt-2">
              <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400"><FiTruck className="text-red-600 dark:text-orange-400" /> Free Delivery</div>
              <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400"><FiShield className="text-red-600 dark:text-orange-400" /> Quality Assured</div>
            </div>
          </div>
        </div>

        {/* Reviews */}
        <div className="mt-16">
          <h2 className="font-heading font-bold text-2xl text-gray-900 dark:text-white mb-8">
            Customer Reviews <span className="text-red-600 dark:text-orange-400">({reviews.length})</span>
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Review List */}
            <div className="space-y-4">
              {reviews.length === 0 ? (
                <p className="text-gray-400 py-8 text-center">No reviews yet. Be the first to review!</p>
              ) : (
                reviews.map((rev) => (
                  <motion.div key={rev._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    className="bg-white dark:bg-[#1C1C2E] rounded-2xl p-5 border border-gray-100 dark:border-gray-700">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-9 h-9 rounded-full bg-red-600 dark:bg-orange-500 flex items-center justify-center text-white font-bold text-sm">
                        {rev.user?.name?.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-white text-sm">{rev.user?.name}</p>
                        <p className="text-xs text-gray-400">{new Date(rev.createdAt).toLocaleDateString()}</p>
                      </div>
                      <div className="ml-auto flex">
                        {[...Array(5)].map((_, i) => (
                          <FiStar key={i} size={12} className={i < rev.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'} />
                        ))}
                      </div>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">{rev.comment}</p>
                  </motion.div>
                ))
              )}
            </div>

            {/* Write Review */}
            {user && (
              <div className="bg-white dark:bg-[#1C1C2E] rounded-2xl p-6 border border-gray-100 dark:border-gray-700 h-fit">
                <h3 className="font-heading font-semibold text-gray-900 dark:text-white mb-5">Write a Review</h3>
                <form onSubmit={handleReviewSubmit} className="space-y-4">
                  <div>
                    <label className="text-sm text-gray-500 dark:text-gray-400 mb-2 block">Rating</label>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((r) => (
                        <button type="button" key={r} onClick={() => setReviewForm(f => ({ ...f, rating: r }))}>
                          <FiStar size={24} className={r <= reviewForm.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'} />
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500 dark:text-gray-400 mb-2 block">Comment</label>
                    <textarea
                      rows={4}
                      value={reviewForm.comment}
                      onChange={(e) => setReviewForm(f => ({ ...f, comment: e.target.value }))}
                      required
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-[#FAF9F9] dark:bg-[#0F0F1A] text-gray-900 dark:text-white resize-none focus:ring-2 focus:ring-red-500 outline-none"
                      placeholder="Share your experience..."
                    />
                  </div>
                  <motion.button whileTap={{ scale: 0.95 }} type="submit" disabled={submitting}
                    className="w-full btn-primary disabled:opacity-50">
                    {submitting ? 'Submitting...' : 'Submit Review'}
                  </motion.button>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
