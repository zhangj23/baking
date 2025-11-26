import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowRight, Clock, MapPin, Star } from 'lucide-react'
import { useState, useEffect } from 'react'
import { api } from '../utils/api'
import ProductCard from '../components/ProductCard'

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const products = await api.get('/products')
        setFeaturedProducts(products.slice(0, 3))
      } catch (error) {
        console.error('Failed to fetch products:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchProducts()
  }, [])

  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center bg-gradient-oriental">
        {/* Oriental Pattern Overlay */}
        <div className="absolute inset-0 bg-oriental-pattern opacity-50" />
        
        {/* Decorative Elements */}
        <div className="absolute top-10 left-10 w-32 h-32 border border-gold-400/30 rotate-45 hidden lg:block" />
        <div className="absolute bottom-10 right-10 w-24 h-24 border border-vermillion-600/30 rotate-12 hidden lg:block" />
        
        {/* Cloud decoration */}
        <motion.div
          className="absolute top-20 right-20 text-6xl opacity-10 hidden lg:block"
          animate={{ 
            y: [0, -10, 0],
          }}
          transition={{ duration: 6, repeat: Infinity }}
        >
          ☁️
        </motion.div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Text Content */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <motion.div 
                className="inline-flex items-center gap-2 px-4 py-2 bg-vermillion-600/10 border border-vermillion-600/30 mb-6"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
              >
                <span className="text-vermillion-600 font-medium tracking-wide">新鲜出炉</span>
                <span className="text-ink-600">• Now accepting pre-orders</span>
              </motion.div>
              
              <h1 className="font-serif text-5xl md:text-7xl text-ink-800 leading-tight mb-6">
                Baked with
                <span className="block text-gradient">Tradition & Love</span>
              </h1>
              
              <p className="text-xl text-ink-600 mb-8 max-w-lg leading-relaxed">
                Discover our artisan Asian-inspired breads and pastries, crafted with time-honored 
                techniques and the finest ingredients. Pre-order for Saturday pickup.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/shop" className="btn-primary inline-flex items-center gap-2">
                  Order Now
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link to="/about" className="btn-outline">
                  Our Story
                </Link>
              </div>
            </motion.div>

            {/* Hero Image */}
            <motion.div
              className="relative"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              {/* Decorative frame */}
              <div className="absolute -inset-4 border border-gold-400/50 hidden md:block" />
              <div className="absolute -inset-8 border border-vermillion-600/30 hidden md:block" />
              
              <div className="relative z-10 overflow-hidden shadow-oriental-lg">
                <img
                  src="https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&h=600&fit=crop"
                  alt="Freshly baked bread"
                  className="w-full h-[500px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink-800/50 to-transparent" />
                
                {/* Chinese calligraphy overlay */}
                <div className="absolute bottom-6 right-6 text-6xl text-rice-50/20 font-serif">
                  梦
                </div>
              </div>
              
              {/* Floating Card */}
              <motion.div
                className="absolute -bottom-6 -left-6 bg-white p-4 shadow-oriental-lg z-20 hidden sm:block border-l-4 border-vermillion-600"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gold-100 flex items-center justify-center">
                    <Star className="w-6 h-6 text-gold-500 fill-gold-500" />
                  </div>
                  <div>
                    <p className="text-sm text-ink-500 tracking-wide">Signature Item</p>
                    <p className="font-serif text-lg text-ink-800">Matcha Square Toast</p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white relative">
        {/* Decorative top border */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold-400 to-transparent" />
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="grid md:grid-cols-3 gap-8"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            {[
              {
                icon: <Clock className="w-8 h-8" />,
                title: 'Fresh Every Week',
                chinese: '新鲜',
                description: 'Baked fresh for Saturday pickup. Pre-order by Wednesday midnight.'
              },
              {
                icon: <Star className="w-8 h-8" />,
                title: 'Premium Ingredients',
                chinese: '精选',
                description: 'Imported Japanese matcha, organic butter, and the finest seasonal produce.'
              },
              {
                icon: <MapPin className="w-8 h-8" />,
                title: 'Easy Pickup',
                chinese: '方便',
                description: 'Convenient Saturday pickup at our bakery. No shipping, just freshness.'
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                className="text-center p-8 bg-rice-50 border border-rice-200 hover:border-gold-400 hover:shadow-oriental transition-all duration-300"
                whileHover={{ y: -5 }}
              >
                <div className="relative inline-block mb-4">
                  <div className="w-16 h-16 bg-vermillion-600 flex items-center justify-center text-rice-50">
                    {feature.icon}
                  </div>
                  <span className="absolute -top-2 -right-2 text-xl text-gold-500">{feature.chinese}</span>
                </div>
                <h3 className="font-serif text-xl text-ink-800 mb-2">{feature.title}</h3>
                <p className="text-ink-600">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 bg-rice-50 relative">
        <div className="absolute inset-0 bg-oriental-pattern opacity-30" />
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="text-gold-500 font-serif text-lg tracking-wider">精选烘焙</span>
            <h2 className="section-title mt-2">Our Specialties</h2>
            <p className="section-subtitle mx-auto">
              Handcrafted with care, each item tells a story of tradition and flavor.
            </p>
          </motion.div>

          {loading ? (
            <div className="grid md:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white h-96 animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid md:grid-cols-3 gap-8 animate-stagger">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}

          <motion.div 
            className="text-center mt-12"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <Link to="/shop" className="btn-secondary inline-flex items-center gap-2">
              View All Products
              <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-ink-800 text-rice-50 relative overflow-hidden">
        {/* Chinese pattern background */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `repeating-linear-gradient(
              45deg,
              #D4AF37 0px,
              #D4AF37 1px,
              transparent 1px,
              transparent 20px
            )`
          }} />
        </div>
        
        {/* Decorative Chinese characters */}
        <div className="absolute top-10 left-10 text-8xl text-gold-400/10 font-serif hidden lg:block">福</div>
        <div className="absolute bottom-10 right-10 text-8xl text-vermillion-500/10 font-serif hidden lg:block">禄</div>
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            className="max-w-3xl mx-auto text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="text-gold-400 font-serif tracking-widest">品味传统</span>
            <h2 className="font-serif text-4xl md:text-5xl mb-6 mt-2">
              Ready to taste the tradition?
            </h2>
            <p className="text-xl text-rice-300 mb-8 leading-relaxed">
              Join our community of food lovers. Place your pre-order today 
              and pick up fresh-baked goodness this Saturday.
            </p>
            <Link to="/shop" className="btn-secondary">
              Start Your Order
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
