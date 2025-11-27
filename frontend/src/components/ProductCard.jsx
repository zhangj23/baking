import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Plus, Eye } from 'lucide-react'
import { useCart } from '../context/CartContext'
import { formatPrice } from '../utils/api'

export default function ProductCard({ product, index = 0 }) {
  const { addItem } = useCart()

  const handleAddToCart = (e) => {
    e.preventDefault()
    e.stopPropagation()
    addItem(product)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <Link to={`/shop/${product.id}`} className="block group">
        <div className="bg-white border border-rice-200 overflow-hidden hover:border-theme-secondary hover:shadow-lg transition-all duration-300">
          {/* Image Container */}
          <div className="relative h-64 overflow-hidden">
            <img
              src={product.image_url || 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400'}
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
            
            {/* Overlay on Hover */}
            <div className="absolute inset-0 bg-ink-800/0 group-hover:bg-ink-800/40 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
              <motion.span
                initial={{ scale: 0 }}
                whileHover={{ scale: 1.1 }}
                className="inline-flex items-center gap-2 px-4 py-2 bg-rice-50 text-ink-800 font-medium border border-theme-secondary"
              >
                <Eye className="w-4 h-4" />
                View Details
              </motion.span>
            </div>

            {/* Category Badge */}
            {product.category && (
              <span className="absolute top-4 left-4 px-3 py-1 bg-theme-primary text-white text-sm font-medium">
                {product.category}
              </span>
            )}
            
            {/* Decorative corner */}
            <div className="absolute bottom-0 right-0 w-12 h-12 bg-theme-secondary\/20 transform rotate-45 translate-x-6 translate-y-6" />
          </div>

          {/* Content */}
          <div className="p-6 border-t border-rice-200">
            <h3 className="font-serif text-xl text-ink-800 mb-2 group-hover:text-theme-primary transition-colors">
              {product.name}
            </h3>
            
            {product.description && (
              <p className="text-ink-600 text-sm mb-4 line-clamp-2">
                {product.description}
              </p>
            )}

            <div className="flex items-center justify-between">
              <span className="font-serif text-2xl text-theme-primary">
                {formatPrice(product.price)}
              </span>
              
              <motion.button
                onClick={handleAddToCart}
                className="p-3 bg-ink-800 hover:bg-theme-primary text-white transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Plus className="w-5 h-5" />
              </motion.button>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
