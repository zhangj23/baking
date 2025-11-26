import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, Minus, Plus, ShoppingBag, Check } from 'lucide-react'
import { api, formatPrice } from '../utils/api'
import { useCart } from '../context/CartContext'

export default function ProductDetail() {
  const { id } = useParams()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [quantity, setQuantity] = useState(1)
  const [added, setAdded] = useState(false)
  const { addItem } = useCart()

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data = await api.get(`/products/${id}`)
        setProduct(data)
      } catch (error) {
        console.error('Failed to fetch product:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchProduct()
  }, [id])

  const handleAddToCart = () => {
    if (product) {
      addItem(product, quantity)
      setAdded(true)
      setTimeout(() => setAdded(false), 2000)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-cream-50 flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-dusty-rose-400 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-cream-50 flex flex-col items-center justify-center">
        <h2 className="font-serif text-2xl text-walnut-800 mb-4">Product not found</h2>
        <Link to="/shop" className="btn-primary">
          Back to Shop
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-cream-50 py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-8"
        >
          <Link 
            to="/shop" 
            className="inline-flex items-center gap-2 text-walnut-600 hover:text-walnut-800 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Shop
          </Link>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Product Image */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative"
          >
            <div className="aspect-square rounded-3xl overflow-hidden bg-white shadow-warm-lg">
              <img
                src={product.image_url || 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800'}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            
            {product.category && (
              <span className="absolute top-6 left-6 px-4 py-2 bg-dusty-rose-400 text-walnut-800 font-medium rounded-full">
                {product.category}
              </span>
            )}
          </motion.div>

          {/* Product Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex flex-col"
          >
            <h1 className="font-serif text-4xl md:text-5xl text-walnut-800 mb-4">
              {product.name}
            </h1>

            <p className="font-serif text-3xl text-dusty-rose-600 mb-6">
              {formatPrice(product.price)}
            </p>

            {product.description && (
              <div className="prose prose-walnut mb-8">
                <p className="text-lg text-walnut-600 leading-relaxed">
                  {product.description}
                </p>
              </div>
            )}

            {/* Quantity Selector */}
            <div className="mb-8">
              <label className="label">Quantity</label>
              <div className="inline-flex items-center gap-4 bg-white rounded-xl p-2 shadow-warm">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-2 hover:bg-dusty-rose-100 rounded-lg transition-colors"
                  disabled={quantity <= 1}
                >
                  <Minus className="w-5 h-5 text-walnut-800" />
                </button>
                <span className="w-12 text-center font-medium text-xl text-walnut-800">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-2 hover:bg-dusty-rose-100 rounded-lg transition-colors"
                >
                  <Plus className="w-5 h-5 text-walnut-800" />
                </button>
              </div>
            </div>

            {/* Total */}
            <div className="bg-dusty-rose-50 rounded-2xl p-6 mb-8">
              <div className="flex items-center justify-between">
                <span className="text-walnut-600">Total</span>
                <span className="font-serif text-3xl text-walnut-800">
                  {formatPrice(product.price * quantity)}
                </span>
              </div>
            </div>

            {/* Add to Cart Button */}
            <motion.button
              onClick={handleAddToCart}
              className={`btn-primary py-4 text-lg transition-all ${
                added ? 'bg-green-600 hover:bg-green-600' : ''
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {added ? (
                <span className="flex items-center justify-center gap-2">
                  <Check className="w-6 h-6" />
                  Added to Cart!
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <ShoppingBag className="w-6 h-6" />
                  Add to Cart
                </span>
              )}
            </motion.button>

            {/* Pickup Info */}
            <div className="mt-8 p-6 bg-walnut-50 rounded-2xl">
              <h3 className="font-serif text-lg text-walnut-800 mb-2">
                📍 Pickup Only
              </h3>
              <p className="text-walnut-600 text-sm">
                Available for Saturday pickup at 123 Bakery Lane, New York. 
                Pre-orders must be placed by Wednesday midnight.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}


