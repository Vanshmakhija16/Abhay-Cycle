import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

/**
 * useProducts — fetch & filter products from the API
 * @param {object} initialFilters - { category, search, sort, page, limit }
 */
const useProducts = (initialFilters = {}) => {
  const [products, setProducts]   = useState([]);
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState(null);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal]         = useState(0);
  const [filters, setFilters]     = useState({
    category: '',
    search: '',
    sort: 'newest',
    page: 1,
    limit: 9,
    ...initialFilters,
  });

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = { ...filters };
      if (params.category === 'All') delete params.category;
      if (!params.search) delete params.search;
      const res = await axios.get('/api/products', { params });
      setProducts(res.data.products);
      setTotalPages(res.data.pages);
      setTotal(res.data.total);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load products');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const updateFilter = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value, page: key !== 'page' ? 1 : value }));
  };

  const resetFilters = () => setFilters({ category: '', search: '', sort: 'newest', page: 1, limit: 9 });

  return { products, loading, error, totalPages, total, filters, updateFilter, resetFilters, refetch: fetchProducts };
};

export default useProducts;
