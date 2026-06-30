import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiCheckCircle, FiPackage, FiArrowRight } from 'react-icons/fi';

const OrderSuccess = () => {
  const { state } = useLocation();
  const order = state?.order;

  return (
    <div className="min-h-screen bg-[#FAF9F9] dark:bg-[#0F0F1A] flex items-center justify-center px-4 pt-20">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-lg bg-white dark:bg-[#1C1C2E] rounded-3xl p-10 shadow-2xl text-center border border-gray-100 dark:border-gray-700"
      >
        <motion.div
          initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
          className="w-20 h-20 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto mb-6"
        >
          <FiCheckCircle size={40} className="text-green-500" />
        </motion.div>

        <h1 className="font-heading font-black text-3xl text-gray-900 dark:text-white mb-2">Order Placed! 🎉</h1>
        <p className="text-gray-500 dark:text-gray-400 mb-6">
          Thank you for shopping with Abhay Cycle. Your order has been confirmed!
        </p>

        {order && (
          <div className="bg-gray-50 dark:bg-[#0F0F1A] rounded-2xl p-5 mb-6 text-left space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Order ID</span>
              <span className="font-mono font-semibold text-gray-700 dark:text-gray-300 text-xs">{order._id}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Payment</span>
              <span className="font-semibold text-gray-700 dark:text-gray-300">{order.paymentMethod}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Total</span>
              <span className="font-bold text-red-600 dark:text-orange-400">₹{order.totalPrice?.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Status</span>
              <span className="px-2 py-0.5 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 rounded-full text-xs font-semibold">{order.orderStatus}</span>
            </div>
          </div>
        )}

        <div className="flex items-center gap-2 justify-center text-sm text-gray-400 mb-8">
          <FiPackage size={14} className="text-red-600 dark:text-orange-400" />
          We'll notify you once your order is shipped
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <Link to="/profile" className="flex-1">
            <button className="w-full btn-outline flex items-center justify-center gap-2">
              Track Order
            </button>
          </Link>
          <Link to="/shop" className="flex-1">
            <button className="w-full btn-primary flex items-center justify-center gap-2">
              Shop More <FiArrowRight />
            </button>
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default OrderSuccess;
