import { Link, NavLink } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Menu, X, ShoppingBag } from "lucide-react";
import { useCart } from "../context/CartContext";
import { useConfig } from "../context/ConfigContext";

export default function Navbar({ onCartClick }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { cartCount } = useCart();
  const { config } = useConfig();
  const isBlogVisible =
    config?.BLOG_VISIBLE === true || config?.BLOG_VISIBLE === "true";

  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/shop", label: "Baked Goods" },
    ...(isBlogVisible ? [{ to: "/blog", label: "Journal" }] : []),
    { to: "/about", label: "Our Story" },
    { to: "/contact", label: "Contact" },
  ];

  return (
    <header className="sticky top-0 z-50 bg-rice-50/95 backdrop-blur-md border-b border-rice-300">
      {/* Top decorative bar */}
      <div className="h-1 gradient-theme-bar" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 sm:gap-3 group">
            <motion.div
              className="relative"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              {/* Decorative circle */}
              <div className="w-9 h-9 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-theme-primary rounded-full flex items-center justify-center border-2 border-theme-secondary">
                <span className="text-base sm:text-lg md:text-xl text-white font-serif font-bold">
                  M
                </span>
              </div>
            </motion.div>
            <div>
              <h1 className="font-serif text-lg sm:text-xl md:text-2xl text-ink-800 font-semibold tracking-wide">
                MLJJ Cooking
              </h1>
              <p className="text-[10px] sm:text-xs text-theme-primary tracking-[0.15em] sm:tracking-[0.2em] uppercase">
                Asian Artisan Kitchen
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `relative font-medium tracking-wide transition-colors duration-200 ${
                    isActive
                      ? "text-theme-primary"
                      : "text-ink-600 hover:text-theme-primary"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {link.label}
                    {isActive && (
                      <motion.div
                        layoutId="navbar-underline"
                        className="absolute -bottom-1 left-0 right-0 h-0.5 gradient-theme-bar"
                        initial={false}
                        transition={{
                          type: "spring",
                          stiffness: 300,
                          damping: 30,
                        }}
                      />
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          {/* Cart Button & Mobile Menu */}
          <div className="flex items-center gap-2 sm:gap-4">
            <motion.button
              onClick={onCartClick}
              className="relative p-1.5 sm:p-2 text-ink-800 hover:text-theme-primary transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ShoppingBag className="w-5 h-5 sm:w-6 sm:h-6" />
              <AnimatePresence>
                {cartCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="absolute -top-0.5 -right-0.5 sm:-top-1 sm:-right-1 bg-theme-primary text-white text-[10px] sm:text-xs w-4 h-4 sm:w-5 sm:h-5 rounded-full flex items-center justify-center font-medium"
                  >
                    {cartCount}
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-1.5 sm:p-2 text-ink-800"
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5 sm:w-6 sm:h-6" />
              ) : (
                <Menu className="w-5 h-5 sm:w-6 sm:h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-rice-50 border-t border-rice-300 overflow-hidden max-h-[calc(100vh-60px)] overflow-y-auto"
          >
            <nav className="container mx-auto px-4 py-2 sm:py-4 flex flex-col gap-1 sm:gap-2">
              {navLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `py-2 sm:py-3 px-3 sm:px-4 text-sm sm:text-base font-medium transition-colors border-l-2 ${
                      isActive
                        ? "border-theme-primary bg-rice-100 text-theme-primary"
                        : "border-transparent text-ink-600 hover:border-theme-secondary hover:bg-rice-100"
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
