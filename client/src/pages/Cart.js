import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiTrash2, FiPlus, FiMinus, FiShoppingBag, FiArrowRight } from 'react-icons/fi';
import { useCart } from '../context/CartContext';

const Cart = () => {
  const { cartItems, removeFromCart, updateQuantity, cartTotal } = useCart();
  const navigate = useNavigate();

  const shipping = cartTotal >= 5000 ? 0 : 299;
  const grandTotal = cartTotal + shipping;

  if (cartItems.length === 0) return (
    <div className="min-h-screen bg-[#FAF9F9] dark:bg-[#0F0F1A] flex flex-col items-center justify-center gap-6 pt-24">
      <div className="text-7xl">🛒</div>
      <h2 className="font-heading font-bold text-2xl text-gray-700 dark:text-gray-300">Your cart is empty</h2>
      <p className="text-gray-400">Add some cycles to get started!</p>
      <Link to="/shop"><button className="btn-primary">Browse Cycles</button></Link>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#FAF9F9] dark:bg-[#0F0F1A] pt-24 pb-16">
      <div className="max-w-6xl mx-auto px-4 md:px-8">
        <h1 className="font-heading font-black text-3xl md:text-4xl text-gray-900 dark:text-white mb-8">
          Shopping <span className="text-gradient-red dark:text-gradient-orange">Cart</span>
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            <AnimatePresence>
              {cartItems.map((item) => (
                <motion.div
                  key={item._id}
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="bg-white dark:bg-[#1C1C2E] rounded-2xl p-4 flex gap-4 items-center shadow-sm border border-gray-100 dark:border-gray-700"
                >
                  <div className="w-20 h-20 bg-gray-50 dark:bg-[#0F0F1A] rounded-xl flex items-center justify-center overflow-hidden flex-shrink-0">
                    {item.images?.[0] ? <img src={item.images[0]} alt={item.name} className="w-full h-full object-cover" /> : <span className="text-3xl">🚴</span>}
                  </div>
                  <div className="flex-1 min-w-0">
                    <Link to={`/product/${item._id}`} className="font-semibold text-gray-900 dark:text-white hover:text-red-600 dark:hover:text-orange-400 line-clamp-1">{item.name}</Link>
                    <p className="text-xs text-gray-400 mt-0.5">{item.category} • {item.brand}</p>
                    <p className="font-bold text-red-600 dark:text-orange-400 mt-1">₹{(item.discountPrice > 0 ? item.discountPrice : item.price).toLocaleString()}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => updateQuantity(item._id, item.quantity - 1)} className="w-7 h-7 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center hover:bg-red-100 dark:hover:bg-orange-900/30 transition-colors">
                      <FiMinus size={12} />
                    </button>
                    <span className="w-6 text-center font-semibold text-gray-900 dark:text-white">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item._id, item.quantity + 1)} className="w-7 h-7 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center hover:bg-red-100 dark:hover:bg-orange-900/30 transition-colors">
                      <FiPlus size={12} />
                    </button>
                  </div>
                  <button onClick={() => removeFromCart(item._id)} className="p-2 text-gray-400 hover:text-red-600 dark:hover:text-orange-400 transition-colors ml-2">
                    <FiTrash2 size={16} />
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-[#1C1C2E] rounded-2xl p-6 border border-gray-100 dark:border-gray-700 sticky top-28">
              <h3 className="font-heading font-bold text-lg text-gray-900 dark:text-white mb-5 flex items-center gap-2">
                <FiShoppingBag /> Order Summary
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                  <span>Subtotal</span><span>₹{cartTotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                  <span>Shipping</span>
                  <span className={shipping === 0 ? 'text-green-500 font-medium' : ''}>{shipping === 0 ? 'FREE' : `₹${shipping}`}</span>
                </div>
                {shipping > 0 && <p className="text-xs text-gray-400">Add ₹{(5000 - cartTotal).toLocaleString()} more for free delivery</p>}
                <div className="border-t border-gray-100 dark:border-gray-700 pt-3 flex justify-between font-bold text-lg text-gray-900 dark:text-white">
                  <span>Total</span><span>₹{grandTotal.toLocaleString()}</span>
                </div>
              </div>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/checkout')}
                className="w-full btn-primary flex items-center justify-center gap-2 mt-6"
              >
                Proceed to Checkout <FiArrowRight />
              </motion.button>
              <Link to="/shop" className="block text-center text-sm text-gray-400 hover:text-red-600 dark:hover:text-orange-400 mt-3 transition-colors">
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
