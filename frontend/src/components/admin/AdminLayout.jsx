import { useState } from 'react'
import { Outlet, NavLink, useNavigate, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  FileText, 
  Settings, 
  LogOut,
  Menu,
  X,
  ExternalLink
} from 'lucide-react'

export default function AdminLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const navigate = useNavigate()

  const handleLogout = () => {
    localStorage.removeItem('ml-baking-admin-token')
    navigate('/admin/login')
  }

  const navItems = [
    { to: '/admin', icon: <LayoutDashboard className="w-5 h-5" />, label: 'Dashboard', end: true },
    { to: '/admin/products', icon: <Package className="w-5 h-5" />, label: 'Products' },
    { to: '/admin/orders', icon: <ShoppingCart className="w-5 h-5" />, label: 'Orders' },
    { to: '/admin/blog', icon: <FileText className="w-5 h-5" />, label: 'Blog' },
    { to: '/admin/settings', icon: <Settings className="w-5 h-5" />, label: 'Settings' },
  ]

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Mobile Header */}
      <header className="lg:hidden bg-walnut-800 text-white p-4 flex items-center justify-between">
        <Link to="/admin" className="flex items-center gap-2">
          <span className="text-2xl">🥐</span>
          <span className="font-serif text-xl">ML Baking Admin</span>
        </Link>
        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
          {isSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <AnimatePresence>
          {(isSidebarOpen || window.innerWidth >= 1024) && (
            <>
              {/* Mobile Overlay */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsSidebarOpen(false)}
                className="lg:hidden fixed inset-0 bg-black/50 z-40"
              />

              {/* Sidebar Content */}
              <motion.aside
                initial={{ x: -280 }}
                animate={{ x: 0 }}
                exit={{ x: -280 }}
                className="fixed lg:sticky top-0 left-0 h-screen w-64 bg-walnut-800 text-white z-50 flex flex-col"
              >
                {/* Logo */}
                <div className="p-6 border-b border-walnut-700 hidden lg:block">
                  <Link to="/admin" className="flex items-center gap-3">
                    <span className="text-3xl">🥐</span>
                    <div>
                      <h1 className="font-serif text-xl font-semibold">ML Baking</h1>
                      <p className="text-xs text-dusty-rose-300">Admin Portal</p>
                    </div>
                  </Link>
                </div>

                {/* Navigation */}
                <nav className="flex-grow p-4 space-y-2">
                  {navItems.map((item) => (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      end={item.end}
                      onClick={() => setIsSidebarOpen(false)}
                      className={({ isActive }) =>
                        `flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                          isActive
                            ? 'bg-dusty-rose-400 text-walnut-800'
                            : 'text-dusty-rose-200 hover:bg-walnut-700'
                        }`
                      }
                    >
                      {item.icon}
                      {item.label}
                    </NavLink>
                  ))}
                </nav>

                {/* Footer */}
                <div className="p-4 border-t border-walnut-700 space-y-2">
                  <a
                    href="/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-dusty-rose-200 hover:bg-walnut-700 transition-colors"
                  >
                    <ExternalLink className="w-5 h-5" />
                    View Store
                  </a>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-dusty-rose-200 hover:bg-red-600 hover:text-white transition-colors"
                  >
                    <LogOut className="w-5 h-5" />
                    Logout
                  </button>
                </div>
              </motion.aside>
            </>
          )}
        </AnimatePresence>

        {/* Main Content */}
        <main className="flex-grow min-h-screen lg:ml-0">
          <Outlet />
        </main>
      </div>
    </div>
  )
}


