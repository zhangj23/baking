import { Routes, Route, Navigate } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import { useConfig } from './context/ConfigContext'

// Layout - eagerly loaded (needed immediately)
import Layout from './components/Layout'

// Critical pages - eagerly loaded for fast initial render
import Home from './pages/Home'
import Shop from './pages/Shop'

// Lazy loaded pages - loaded on demand
const ProductDetail = lazy(() => import('./pages/ProductDetail'))
const Blog = lazy(() => import('./pages/Blog'))
const BlogPost = lazy(() => import('./pages/BlogPost'))
const About = lazy(() => import('./pages/About'))
const Contact = lazy(() => import('./pages/Contact'))
const Checkout = lazy(() => import('./pages/Checkout'))
const OrderConfirmation = lazy(() => import('./pages/OrderConfirmation'))

// Admin pages - all lazy loaded (not needed for regular users)
const AdminLayout = lazy(() => import('./components/admin/AdminLayout'))
const AdminLogin = lazy(() => import('./pages/admin/AdminLogin'))
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'))
const AdminProducts = lazy(() => import('./pages/admin/AdminProducts'))
const AdminOrders = lazy(() => import('./pages/admin/AdminOrders'))
const AdminBlog = lazy(() => import('./pages/admin/AdminBlog'))
const AdminContent = lazy(() => import('./pages/admin/AdminContent'))
const AdminSettings = lazy(() => import('./pages/admin/AdminSettings'))

// Protected Route Component
import ProtectedRoute from './components/admin/ProtectedRoute'

// Loading fallback component
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-rice-50">
    <div className="w-10 h-10 border-3 border-theme-secondary border-t-theme-primary rounded-full animate-spin" />
  </div>
)

function App() {
  const { config } = useConfig()
  const isBlogVisible = config?.BLOG_VISIBLE === true || config?.BLOG_VISIBLE === 'true'

  return (
    <Suspense fallback={<PageLoader />}>
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
          <Route path="content" element={<AdminContent />} />
          <Route path="settings" element={<AdminSettings />} />
        </Route>

        {/* 404 - Redirect to Home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  )
}

export default App


