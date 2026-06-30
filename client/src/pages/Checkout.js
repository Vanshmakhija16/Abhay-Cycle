import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import toast from 'react-hot-toast';
import { FiTruck, FiSmartphone } from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const PAYMENT_METHODS = [
  { id: 'COD', label: 'Cash on Delivery', icon: FiTruck, desc: 'Pay when your order arrives' },
  { id: 'UPI', label: 'UPI', icon: FiSmartphone, desc: 'Pay via UPI (GPay, PhonePe, Paytm)' },
];

const Checkout = () => {
  const { cartItems, cartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [paymentMethod, setPaymentMethod] = useState('COD');
  const [loading, setLoading] = useState(false);
  const [address, setAddress] = useState({
    fullName: user?.name || '',
    phone: user?.phone || '',
    street: user?.address?.street || '',
    city: user?.address?.city || '',
    state: user?.address?.state || '',
    pincode: user?.address?.pincode || '',
  });

  const shipping = cartTotal >= 5000 ? 0 : 299;
  const grandTotal = cartTotal + shipping;

  const handleChange = (e) => setAddress({ ...address, [e.target.name]: e.target.value });

  const placeOrder = async (e) => {
    e.preventDefault();
    const requiredFields = ['fullName', 'phone', 'street', 'city', 'state', 'pincode'];
    for (const field of requiredFields) {
      if (!address[field]) return toast.error(`Please fill in ${field}`);
    }

    setLoading(true);
    const orderPayload = {
      orderItems: cartItems.map(item => ({
        product: item._id,
        name: item.name,
        image: item.images?.[0] || '',
        price: item.discountPrice > 0 ? item.discountPrice : item.price,
        quantity: item.quantity,
      })),
      shippingAddress: address,
      paymentMethod,
      itemsPrice: cartTotal,
      shippingPrice: shipping,
      totalPrice: grandTotal,
    };

    try {
      const res = await axios.post('/api/orders', orderPayload);
      clearCart();
      toast.success('Order placed successfully! 🎉');
      navigate('/order-success', { state: { order: res.data.order } });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to place order');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF9F9] dark:bg-[#0F0F1A] pt-24 pb-16">
      <div className="max-w-5xl mx-auto px-4 md:px-8">
        <h1 className="font-heading font-black text-3xl text-gray-900 dark:text-white mb-8">
          Checkout
        </h1>

        <form onSubmit={placeOrder}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left: Address + Payment */}
            <div className="lg:col-span-2 space-y-6">
              {/* Shipping Address */}
              <div className="bg-white dark:bg-[#1C1C2E] rounded-2xl p-6 border border-gray-100 dark:border-gray-700">
                <h2 className="font-heading font-bold text-lg text-gray-900 dark:text-white mb-5">Shipping Address</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { name: 'fullName', label: 'Full Name', placeholder: 'Your full name' },
                    { name: 'phone', label: 'Phone Number', placeholder: '+91 XXXXX XXXXX' },
                    { name: 'street', label: 'Street Address', placeholder: 'House no, Street name', full: true },
                    { name: 'city', label: 'City', placeholder: 'City' },
                    { name: 'state', label: 'State', placeholder: 'State' },
                    { name: 'pincode', label: 'Pincode', placeholder: '000000' },
                  ].map(({ name, label, placeholder, full }) => (
                    <div key={name} className={full ? 'md:col-span-2' : ''}>
                      <label className="block text-sm text-gray-500 dark:text-gray-400 mb-1">{label}</label>
                      <input
                        type="text" name={name} value={address[name]}
                        onChange={handleChange} placeholder={placeholder} required
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-[#FAF9F9] dark:bg-[#0F0F1A] text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 dark:focus:ring-orange-500 outline-none transition"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Payment Method */}
              <div className="bg-white dark:bg-[#1C1C2E] rounded-2xl p-6 border border-gray-100 dark:border-gray-700">
                <h2 className="font-heading font-bold text-lg text-gray-900 dark:text-white mb-5">Payment Method</h2>
                <div className="space-y-3">
                  {PAYMENT_METHODS.map(({ id, label, icon: Icon, desc }) => (
                    <label key={id} className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                      paymentMethod === id
                        ? 'border-red-600 dark:border-orange-500 bg-red-50 dark:bg-orange-900/20'
                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                    }`}>
                      <input type="radio" name="payment" value={id} checked={paymentMethod === id} onChange={() => setPaymentMethod(id)} className="sr-only" />
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${paymentMethod === id ? 'bg-red-600 dark:bg-orange-500' : 'bg-gray-100 dark:bg-gray-700'}`}>
                        <Icon size={18} className={paymentMethod === id ? 'text-white' : 'text-gray-500'} />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-white text-sm">{label}</p>
                        <p className="text-xs text-gray-400">{desc}</p>
                      </div>
                      {paymentMethod === id && (
                        <div className="ml-auto w-5 h-5 rounded-full bg-red-600 dark:bg-orange-500 flex items-center justify-center">
                          <div className="w-2 h-2 rounded-full bg-white" />
                        </div>
                      )}
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white dark:bg-[#1C1C2E] rounded-2xl p-6 border border-gray-100 dark:border-gray-700 sticky top-28">
                <h3 className="font-heading font-bold text-lg text-gray-900 dark:text-white mb-4">Order Summary</h3>
                <div className="space-y-3 mb-5">
                  {cartItems.map(item => (
                    <div key={item._id} className="flex gap-3 items-center">
                      <div className="w-10 h-10 bg-gray-50 dark:bg-gray-800 rounded-lg flex items-center justify-center flex-shrink-0">
                        {item.images?.[0] ? <img src={item.images[0]} alt="" className="w-full h-full object-cover rounded-lg" /> : <span className="text-lg">🚴</span>}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-gray-700 dark:text-gray-300 truncate">{item.name}</p>
                        <p className="text-xs text-gray-400">×{item.quantity}</p>
                      </div>
                      <p className="text-sm font-semibold text-gray-900 dark:text-white whitespace-nowrap">
                        ₹{((item.discountPrice > 0 ? item.discountPrice : item.price) * item.quantity).toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>
                <div className="border-t border-gray-100 dark:border-gray-700 pt-4 space-y-2 text-sm">
                  <div className="flex justify-between text-gray-500"><span>Subtotal</span><span>₹{cartTotal.toLocaleString()}</span></div>
                  <div className="flex justify-between text-gray-500"><span>Shipping</span><span className={shipping === 0 ? 'text-green-500' : ''}>{shipping === 0 ? 'FREE' : `₹${shipping}`}</span></div>
                  <div className="flex justify-between font-bold text-base text-gray-900 dark:text-white pt-1 border-t border-gray-100 dark:border-gray-700">
                    <span>Total</span><span>₹{grandTotal.toLocaleString()}</span>
                  </div>
                </div>
                <motion.button whileTap={{ scale: 0.95 }} type="submit" disabled={loading}
                  className="w-full btn-primary mt-5 disabled:opacity-50">
                  {loading ? 'Placing Order...' : `Place Order • ₹${grandTotal.toLocaleString()}`}
                </motion.button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Checkout;
