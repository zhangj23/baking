import { Link } from "react-router-dom";
import { Instagram, Mail, Heart } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-ink-800 text-rice-100">
      {/* Decorative top border */}
      <div className="h-1 gradient-theme-bar" />

      {/* Main Footer Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link to="/" className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-theme-primary rounded-full flex items-center justify-center border border-theme-secondary">
                <span className="text-white font-serif font-bold">M</span>
              </div>
              <span className="font-serif text-2xl font-semibold text-rice-50">
                MLJJ Cooking
              </span>
            </Link>
            <p className="text-rice-300 max-w-md mb-6 leading-relaxed">
              Where Eastern tradition meets artisan craftsmanship. Every dish is
              a journey through time-honored techniques and carefully selected
              ingredients.
            </p>
            <div className="flex gap-4">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-ink-700 hover:bg-theme-primary border border-ink-600 hover:border-theme-primary transition-colors duration-200"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="mailto:hello@mlbaking.com"
                className="p-2 bg-ink-700 hover:bg-theme-primary border border-ink-600 hover:border-theme-primary transition-colors duration-200"
              >
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-serif text-lg font-semibold mb-4 text-theme-secondary tracking-wide">
              Explore
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/shop"
                  className="text-rice-300 hover:text-theme-primary-light transition-colors"
                >
                  Baked Goods
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  className="text-rice-300 hover:text-theme-primary-light transition-colors"
                >
                  Our Story
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="text-rice-300 hover:text-theme-primary-light transition-colors"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-serif text-lg font-semibold mb-4 text-theme-secondary tracking-wide">
              Visit Us
            </h3>
            <address className="text-rice-300 not-italic space-y-1">
              <p>123 Bakery Lane</p>
              <p>New York, NY 10001</p>
              <p className="pt-2">
                <span className="text-theme-secondary">Saturdays:</span> 10AM - 2PM
              </p>
            </address>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-ink-700">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-rice-400">
            <p>© {currentYear} MLJJ Cooking. All rights reserved.</p>
            <p className="flex items-center gap-1">
              Made with{" "}
              <Heart className="w-4 h-4 text-theme-primary fill-theme-primary" />{" "}
              and tradition
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
