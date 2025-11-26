import { Routes, Route, Navigate } from 'react-router-dom'
import { useConfig } from './context/ConfigContext'

// Layout
import Layout from './components/Layout'
import AdminLayout from './components/admin/AdminLayout'

// Public Pages
import Home from './pages/Home'
import Shop from './pages/Shop'
import ProductDetail from './pages/ProductDetail'
import Blog from './pages/Blog'
import BlogPost from './pages/BlogPost'
import About from './pages/About'
import Contact from './pages/Contact'
import Checkout from './pages/Checkout'
import OrderConfirmation from './pages/OrderConfirmation'

// Admin Pages
import AdminLogin from './pages/admin/AdminLogin'
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminProducts from './pages/admin/AdminProducts'
import AdminOrders from './pages/admin/AdminOrders'
import AdminBlog from './pages/admin/AdminBlog'
import AdminSettings from './pages/admin/AdminSettings'

// Protected Route Component
import ProtectedRoute from './components/admin/ProtectedRoute'

function App() {
  const { config } = useConfig()
  const isBlogVisible = config?.BLOG_VISIBLE === true || config?.BLOG_VISIBLE === 'true'

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="shop" element={<Shop />} />
        <Route path="shop/:id" element={<ProductDetail />} />
        {isBlogVisible ? (
          <>
            <Route path="blog" element={<Blog />} />
            <Route path="blog/:id" element={<BlogPost />} />
          </>
        ) : (
          <>
            <Route path="blog" element={<Navigate to="/" replace />} />
            <Route path="blog/:id" element={<Navigate to="/" replace />} />
          </>
        )}
        <Route path="about" element={<About />} />
        <Route path="contact" element={<Contact />} />
        <Route path="checkout" element={<Checkout />} />
        <Route path="order-confirmation" element={<OrderConfirmation />} />
      </Route>

      {/* Admin Routes */}
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<AdminDashboard />} />
        <Route path="products" element={<AdminProducts />} />
        <Route path="orders" element={<AdminOrders />} />
        <Route path="blog" element={<AdminBlog />} />
        <Route path="settings" element={<AdminSettings />} />
      </Route>

      {/* 404 - Redirect to Home */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App


