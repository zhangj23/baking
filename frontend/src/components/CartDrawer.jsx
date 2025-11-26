import { motion, AnimatePresence } from 'framer-motion'
import { X, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { formatPrice } from '../utils/api'

export default function CartDrawer({ isOpen, onClose }) {
  const { items, updateQuantity, removeItem, cartTotal } = useCart()
  const navigate = useNavigate()

  const handleCheckout = () => {
    onClose()
    navigate('/checkout')
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-ink-900/60 backdrop-blur-sm z-50"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-rice-50 shadow-oriental-lg z-50 flex flex-col"
          >
            {/* Decorative top bar */}
            <div className="h-1 bg-gradient-to-r from-vermillion-600 via-gold-400 to-vermillion-600" />
            
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-rice-300">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-vermillion-600 flex items-center justify-center">
                  <ShoppingBag className="w-5 h-5 text-rice-50" />
                </div>
                <div>
                  <h2 className="font-serif text-2xl text-ink-800">Your Cart</h2>
                  <span className="text-sm text-gold-600">购物车</span>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-rice-200 transition-colors"
              >
                <X className="w-6 h-6 text-ink-600" />
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-grow overflow-y-auto p-6">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center">
                  <div className="w-20 h-20 bg-rice-200 flex items-center justify-center mb-4">
                    <ShoppingBag className="w-10 h-10 text-rice-400" />
                  </div>
                  <h3 className="font-serif text-xl text-ink-800 mb-2">
                    Your cart is empty
                  </h3>
                  <p className="text-ink-600 mb-6">
                    Discover our delicious baked goods!
                  </p>
                  <button
                    onClick={() => {
                      onClose()
                      navigate('/shop')
                    }}
                    className="btn-secondary"
                  >
                    Browse Shop
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <AnimatePresence>
                    {items.map((item) => (
                      <motion.div
                        key={item.id}
                        layout
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: 100 }}
                        className="bg-white p-4 shadow-ink border border-rice-200"
                      >
                        <div className="flex gap-4">
                          {/* Image */}
                          <div className="w-20 h-20 overflow-hidden bg-rice-100 flex-shrink-0">
                            <img
                              src={item.image_url || '/placeholder-bread.jpg'}
                              alt={item.name}
                              className="w-full h-full object-cover"
                            />
                          </div>

                          {/* Details */}
                          <div className="flex-grow">
                            <h3 className="font-serif text-lg text-ink-800 mb-1">
                              {item.name}
                            </h3>
                            <p className="text-vermillion-600 font-medium">
                              {formatPrice(item.price)}
                            </p>
                          </div>
                        </div>

                        {/* Quantity & Remove */}
                        <div className="flex items-center justify-between mt-4 pt-4 border-t border-rice-200">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="p-1.5 bg-rice-100 hover:bg-rice-200 transition-colors"
                            >
                              <Minus className="w-4 h-4 text-ink-800" />
                            </button>
                            <span className="w-8 text-center font-medium text-ink-800">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="p-1.5 bg-rice-100 hover:bg-rice-200 transition-colors"
                            >
                              <Plus className="w-4 h-4 text-ink-800" />
                            </button>
                          </div>

                          <div className="flex items-center gap-4">
                            <span className="font-semibold text-ink-800">
                              {formatPrice(item.price * item.quantity)}
                            </span>
                            <button
                              onClick={() => removeItem(item.id)}
                              className="text-ink-400 hover:text-vermillion-600 transition-colors"
                            >
                              <X className="w-5 h-5" />
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="border-t border-rice-300 p-6 bg-white">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-ink-600">Subtotal</span>
                  <span className="font-serif text-2xl text-ink-800">
                    {formatPrice(cartTotal)}
                  </span>
                </div>
                <p className="text-sm text-ink-500 mb-4">
                  Pickup only • 仅限自取
                </p>
                <motion.button
                  onClick={handleCheckout}
                  className="btn-primary w-full flex items-center justify-center gap-2"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Proceed to Checkout
                  <ArrowRight className="w-5 h-5" />
                </motion.button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
