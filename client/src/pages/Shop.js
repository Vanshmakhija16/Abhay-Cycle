import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import axios from 'axios';
import { FiSearch, FiX, FiStar, FiShoppingCart, FiHeart } from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';

gsap.registerPlugin(ScrollTrigger);

const CATEGORIES = ['All', 'MTB', 'Road', 'Kids'];
const SORT_OPTIONS = [
  { label: 'Newest',            value: 'newest'     },
  { label: 'Price: Low to High', value: 'price-asc'  },
  { label: 'Price: High to Low', value: 'price-desc' },
  { label: 'Top Rated',          value: 'rating'     },
];

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const [wishlisted, setWishlisted] = useState(false);

  const handleAddToCart = (e) => {
    e.preventDefault();
    addToCart(product);
    toast.success(`${product.name} added to cart! 🚴`);
  };

  const finalPrice  = product.discountPrice > 0 ? product.discountPrice : product.price;
  const hasDiscount = product.discountPrice > 0 && product.discountPrice < product.price;

  return (
    <motion.div
      whileHover={{ y: -6 }}
      className="group bg-white dark:bg-[#1C1C2E] rounded-2xl overflow-hidden shadow-md hover:shadow-2xl hover:shadow-[#C0FF00]/10 transition-all duration-300 border border-gray-100 dark:border-gray-800"
    >
      <Link to={`/product/${product._id}`}>
        <div className="relative h-52 bg-gray-50 dark:bg-[#0F0F1A] overflow-hidden">
          {product.images?.[0] ? (
            <img src={product.images[0]} alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-6xl">🚴</div>
          )}
          {hasDiscount && (
            <div className="absolute top-3 left-3 px-2 py-1 bg-[#F5A623] text-[#0A0A0F] text-xs font-bold rounded-lg">
              -{product.discountPercent}%
            </div>
          )}
          <button
            onClick={(e) => { e.preventDefault(); setWishlisted(!wishlisted); }}
            className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white dark:bg-gray-800 flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <FiHeart size={14} className={wishlisted ? 'text-[#F5A623] fill-[#F5A623]' : 'text-gray-400'} />
          </button>
        </div>

        <div className="p-4">
          <div className="text-xs text-[#F5A623] font-semibold uppercase tracking-wider mb-1">
            {product.category} • {product.brand}
          </div>
          <h3 className="font-heading font-semibold text-gray-900 dark:text-white text-sm mb-2 line-clamp-2">
            {product.name}
          </h3>
          <div className="flex items-center gap-1 mb-3">
            {[...Array(5)].map((_, i) => (
              <FiStar key={i} size={12}
                className={i < Math.round(product.ratings) ? 'text-[#F5A623] fill-[#F5A623]' : 'text-gray-300'} />
            ))}
            <span className="text-xs text-gray-400 ml-1">({product.numReviews})</span>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <span className="font-bold text-lg text-gray-900 dark:text-white">
                ₹{finalPrice.toLocaleString()}
              </span>
              {hasDiscount && (
                <span className="text-xs text-gray-400 line-through ml-2">
                  ₹{product.price.toLocaleString()}
                </span>
              )}
            </div>
            <span className={`text-xs px-2 py-1 rounded-full font-medium ${
              product.stock > 0
                ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                : 'bg-red-100 text-red-600'
            }`}>
              {product.stock > 0 ? 'In Stock' : 'Sold Out'}
            </span>
          </div>
        </div>
      </Link>

      <div className="px-4 pb-4">
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={handleAddToCart}
          disabled={product.stock === 0}
          className="w-full flex items-center justify-center gap-2 py-2.5 bg-[#F5A623] text-[#0A0A0F] rounded-xl font-medium text-sm hover:bg-[#FFD166] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <FiShoppingCart size={15} /> Add to Cart
        </motion.button>
      </div>
    </motion.div>
  );
};

const Shop = () => {
  const [products,    setProducts]    = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [category,    setCategory]    = useState('All');
  const [search,      setSearch]      = useState('');
  const [sort,        setSort]        = useState('newest');
  const [page,        setPage]        = useState(1);
  const [totalPages,  setTotalPages]  = useState(1);
  const gridRef    = useRef(null);
  const debounceRef = useRef(null);

  // Fetch when category / sort / page changes immediately
  useEffect(() => {
    fetchProducts();
  }, [category, sort, page]);

  // Debounce search — fires 400ms after user stops typing
  useEffect(() => {
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setPage(1);          // reset to page 1 on new search
      fetchProducts();
    }, 400);

    return () => clearTimeout(debounceRef.current);
  }, [search]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = { sort, page, limit: 9 };
      if (category !== 'All') params.category = category;
      if (search.trim())       params.search   = search.trim();
      const res = await axios.get('/api/products', { params });
      setProducts(res.data.products);
      setTotalPages(res.data.pages);
    } catch {
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!loading && gridRef.current) {
      gsap.fromTo('.product-card',
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, stagger: 0.07, ease: 'power2.out' }
      );
    }
  }, [loading, products]);

  return (
    <div className="min-h-screen bg-[#FAF9F9] dark:bg-[#0F0F1A] pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 md:px-8">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
          <h1 className="font-heading font-black text-4xl md:text-5xl text-gray-900 dark:text-white mb-2">
            Our <span className="text-[#F5A623]">Collection</span>
          </h1>
          <p className="text-gray-500 dark:text-gray-400">Find your perfect ride from our curated selection</p>
        </motion.div>

        {/* Filters Bar */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">

          {/* Search — live filter as you type */}
          <div className="relative flex-1">
            <FiSearch size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search cycles..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-10 py-3 rounded-xl border border-gray-200 dark:border-gray-700
                bg-white dark:bg-[#1C1C2E] text-gray-900 dark:text-white
                focus:ring-2 focus:ring-[#F5A623]/50 focus:border-[#F5A623] outline-none transition"
            />
            {/* Clear button */}
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#F5A623] transition-colors"
              >
                <FiX size={15} />
              </button>
            )}
          </div>

          {/* Sort */}
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700
              bg-white dark:bg-[#1C1C2E] text-gray-900 dark:text-white
              focus:ring-2 focus:ring-[#F5A623]/50 focus:border-[#F5A623] outline-none"
          >
            {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </div>

        {/* Category Tabs */}
        <div className="flex gap-2 mb-8 flex-wrap">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => { setCategory(cat); setPage(1); }}
              className={`px-5 py-2 rounded-full font-medium text-sm transition-all ${
                category === cat
                  ? 'bg-[#F5A623] text-[#0A0A0F] shadow-lg'
                  : 'bg-white dark:bg-[#1C1C2E] text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:border-[#F5A623] dark:hover:border-[#F5A623]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search indicator */}
        {search.trim() && (
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
            Showing results for <span className="text-[#F5A623] font-medium">"{search}"</span>
          </p>
        )}

        {/* Products Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white dark:bg-[#1C1C2E] rounded-2xl h-80 animate-pulse" />
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-24">
            <div className="text-6xl mb-4">🚴</div>
            <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300">No cycles found</h3>
            <p className="text-gray-400 mt-2">Try a different category or search term</p>
          </div>
        ) : (
          <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <div key={product._id} className="product-card">
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-12">
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => setPage(i + 1)}
                className={`w-10 h-10 rounded-xl font-medium transition-all ${
                  page === i + 1
                    ? 'bg-[#F5A623] text-[#0A0A0F]'
                    : 'bg-white dark:bg-[#1C1C2E] text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:border-[#F5A623]'
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        )}

      </div>
    </div>
  );
};

export default Shop;
