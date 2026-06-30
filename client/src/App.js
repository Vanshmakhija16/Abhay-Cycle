import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import { ThemeProvider }  from './context/ThemeContext';
import { AuthProvider }   from './context/AuthContext';
import { CartProvider }   from './context/CartContext';

import Navbar      from './components/layout/Navbar';
import Footer      from './components/layout/Footer';
import ScrollCycle from './components/ui/ScrollCycle';
import ScrollToTop from './components/ui/ScrollToTop';

import Home          from './pages/Home';
import Shop          from './pages/Shop';
import ProductDetail from './pages/ProductDetail';
import Login         from './pages/Login';
import Register      from './pages/Register';
import NotFound      from './pages/NotFound';
import Cart          from './pages/Cart';
import Checkout      from './pages/Checkout';
import Profile       from './pages/Profile';
import OrderSuccess  from './pages/OrderSuccess';

import AdminDashboard  from './pages/admin/AdminDashboard';
import AdminProducts   from './pages/admin/AdminProducts';
import AdminOrders     from './pages/admin/AdminOrders';
import AdminCustomers  from './pages/admin/AdminCustomers';
import AdminCategories from './pages/admin/AdminCategories';

import ProtectedRoute from './components/ui/ProtectedRoute';
import AdminRoute     from './components/ui/AdminRoute';

const AppContent = () => {
  const location = useLocation();
  const isAdmin  = location.pathname.startsWith('/admin');

  return (
    <>
      <ScrollToTop />
      {!isAdmin && <Navbar />}
      {!isAdmin && <ScrollCycle />}

      <Routes>
        {/* Public */}
        <Route path="/"              element={<Home />} />
        <Route path="/shop"          element={<Shop />} />
        <Route path="/product/:id"   element={<ProductDetail />} />
        <Route path="/login"         element={<Login />} />
        <Route path="/register"      element={<Register />} />

        {/* Protected customer */}
        <Route path="/cart"          element={<ProtectedRoute><Cart /></ProtectedRoute>} />
        <Route path="/checkout"      element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
        <Route path="/profile"       element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/order-success" element={<ProtectedRoute><OrderSuccess /></ProtectedRoute>} />

        {/* Admin */}
        <Route path="/admin"               element={<AdminRoute><AdminDashboard /></AdminRoute>} />
        <Route path="/admin/products"      element={<AdminRoute><AdminProducts /></AdminRoute>} />
        <Route path="/admin/categories"    element={<AdminRoute><AdminCategories /></AdminRoute>} />
        <Route path="/admin/orders"        element={<AdminRoute><AdminOrders /></AdminRoute>} />
        <Route path="/admin/customers"     element={<AdminRoute><AdminCustomers /></AdminRoute>} />

        <Route path="*" element={<NotFound />} />
      </Routes>

      {!isAdmin && <Footer />}
    </>
  );
};

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <CartProvider>
          <Router>
            <div className="min-h-screen bg-[#0A0A0F] text-white">
              <AppContent />
            </div>
            <Toaster
              position="top-right"
              toastOptions={{
                style: {
                  background: '#12121A',
                  color: '#F5F5F0',
                  border: '1px solid rgba(245,166,35,0.2)',
                  borderRadius: '0px',
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '12px',
                },
                success: { iconTheme: { primary: '#F5A623', secondary: '#0A0A0F' } },
                error:   { iconTheme: { primary: '#ef4444', secondary: '#fff' } },
              }}
            />
          </Router>
        </CartProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
