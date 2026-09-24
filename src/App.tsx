import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './stores/authStore';
import { useProductStore } from './stores/productStore';
import { useRequestStore } from './stores/requestStore';
import { ProtectedRoute, AdminRoute } from './routes/ProtectedRoute';

// Layouts
import UserLayout from './layouts/UserLayout';
import AdminLayout from './layouts/AdminLayout';

// User Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Cart from './pages/Cart';
import SellScrap from './pages/SellScrap';
import MyOrders from './pages/MyOrders';
import Favorites from './pages/Favorites';
import About from './pages/About';

// Admin Pages
import AdminLogin from './pages/admin/AdminLogin';
import Dashboard from './pages/admin/Dashboard';
import Products from './pages/admin/Products';
import Requests from './pages/admin/Requests';
import PurchaseRequests from './pages/admin/PurchaseRequests';
import Customers from './pages/admin/Customers';
import Settings from './pages/admin/Settings';

function App() {
  const { seedUsers, restoreSupabaseSession } = useAuthStore();
  const { fetchProducts } = useProductStore();
  const { seedRequests } = useRequestStore();

  useEffect(() => {
    // Seed local demo data (auth/requests) + load real product catalog
    seedUsers();
    restoreSupabaseSession();
    fetchProducts();
    seedRequests();
  }, [seedUsers, restoreSupabaseSession, fetchProducts, seedRequests]);

  return (
    <BrowserRouter>
      <Routes>
        {/* User Routes */}
        <Route element={<UserLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/about" element={<About />} />
          
          <Route element={<ProtectedRoute />}>
            <Route path="/cart" element={<Cart />} />
            <Route path="/sell-scrap" element={<SellScrap />} />
            <Route path="/my-orders" element={<MyOrders />} />
            <Route path="/favorites" element={<Favorites />} />
          </Route>
        </Route>

        {/* Admin Routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        
        <Route path="/admin" element={<AdminRoute />}>
          <Route element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="products" element={<Products />} />
            <Route path="requests" element={<Requests />} />
            <Route path="purchase-requests" element={<PurchaseRequests />} />
            <Route path="customers" element={<Customers />} />
            <Route path="settings" element={<Settings />} />
          </Route>
        </Route>

        {/* 404 Redirect */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
