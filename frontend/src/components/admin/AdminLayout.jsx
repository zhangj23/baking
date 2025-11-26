import { useState } from "react";
import { Outlet, NavLink, useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  FileText,
  Settings,
  LogOut,
  Menu,
  X,
  ExternalLink,
  PenTool,
} from "lucide-react";

export default function AdminLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("ml-baking-admin-token");
    navigate("/admin/login");
  };

  const navItems = [
    {
      to: "/admin",
      icon: <LayoutDashboard className="w-5 h-5" />,
      label: "Dashboard",
      end: true,
    },
    {
      to: "/admin/products",
      icon: <Package className="w-5 h-5" />,
      label: "Products",
    },
    {
      to: "/admin/orders",
      icon: <ShoppingCart className="w-5 h-5" />,
      label: "Orders",
    },
    {
      to: "/admin/blog",
      icon: <FileText className="w-5 h-5" />,
      label: "Blog",
    },
    {
      to: "/admin/content",
      icon: <PenTool className="w-5 h-5" />,
      label: "Page Content",
    },
    {
      to: "/admin/settings",
      icon: <Settings className="w-5 h-5" />,
      label: "Settings",
    },
  ];

  return (
    <div className="min-h-screen bg-rice-100">
      {/* Mobile Header */}
      <header className="lg:hidden bg-ink-800 text-rice-50 p-4 flex items-center justify-between">
        <Link to="/admin" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-vermillion-600 rounded-full flex items-center justify-center border border-gold-400">
            <span className="text-rice-50 font-serif font-bold text-sm">
              美
            </span>
          </div>
          <span className="font-serif text-xl">MLJJ Cooking Admin</span>
        </Link>
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="text-rice-50"
        >
          {isSidebarOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <Menu className="w-6 h-6" />
          )}
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
                className="fixed lg:sticky top-0 left-0 h-screen w-64 bg-ink-800 text-rice-50 z-50 flex flex-col shadow-xl"
              >
                {/* Decorative top bar */}
                <div className="h-1 bg-gradient-to-r from-vermillion-600 via-gold-400 to-vermillion-600" />

                {/* Logo */}
                <div className="p-6 border-b border-ink-700 hidden lg:block">
                  <Link to="/admin" className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-vermillion-600 rounded-full flex items-center justify-center border-2 border-gold-400">
                      <span className="text-rice-50 font-serif font-bold">
                        美
                      </span>
                    </div>
                    <div>
                      <h1 className="font-serif text-xl font-semibold text-rice-50">
                        MLJJ Cooking
                      </h1>
                      <p className="text-xs text-gold-400">
                        Admin Portal • 管理
                      </p>
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
                        `flex items-center gap-3 px-4 py-3 transition-colors ${
                          isActive
                            ? "bg-vermillion-600 text-rice-50 border-l-4 border-gold-400"
                            : "text-rice-300 hover:bg-ink-700 hover:text-rice-50 border-l-4 border-transparent"
                        }`
                      }
                    >
                      {item.icon}
                      {item.label}
                    </NavLink>
                  ))}
                </nav>

                {/* Footer */}
                <div className="p-4 border-t border-ink-700 space-y-2">
                  <a
                    href="/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 px-4 py-3 text-rice-300 hover:bg-ink-700 hover:text-rice-50 transition-colors"
                  >
                    <ExternalLink className="w-5 h-5" />
                    View Store
                  </a>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 text-rice-300 hover:bg-vermillion-700 hover:text-rice-50 transition-colors"
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
  );
}
