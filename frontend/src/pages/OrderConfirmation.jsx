import { useLocation, Link, Navigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Check, MapPin, Clock, Mail, ArrowRight } from 'lucide-react'

export default function OrderConfirmation() {
  const location = useLocation()
  const { orderId, email, name } = location.state || {}

  // Redirect if accessed directly without order info
  if (!orderId) {
    return <Navigate to="/" replace />
  }

  return (
    <div className="min-h-screen bg-gradient-warm flex items-center justify-center py-12 px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-3xl shadow-warm-lg max-w-lg w-full overflow-hidden"
      >
        {/* Success Header */}
        <div className="bg-walnut-800 text-cream-50 p-8 text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4"
          >
            <Check className="w-10 h-10 text-white" />
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="font-serif text-3xl mb-2"
          >
            Order Confirmed!
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-dusty-rose-200"
          >
            Thank you for your order{name ? `, ${name.split(' ')[0]}` : ''}!
          </motion.p>
        </div>

        {/* Order Details */}
        <div className="p-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            {/* Order ID */}
            <div className="bg-cream-50 rounded-2xl p-4 mb-6 text-center">
              <p className="text-sm text-walnut-600 mb-1">Order ID</p>
              <p className="font-mono text-lg text-walnut-800">{orderId.slice(0, 8).toUpperCase()}</p>
            </div>

            {/* Confirmation Email */}
            <div className="flex items-start gap-3 mb-6 p-4 bg-dusty-rose-50 rounded-2xl">
              <Mail className="w-5 h-5 text-dusty-rose-600 mt-0.5" />
              <div>
                <p className="font-medium text-walnut-800">Confirmation email sent</p>
                <p className="text-sm text-walnut-600">{email}</p>
              </div>
            </div>

            {/* Pickup Details */}
            <h3 className="font-serif text-lg text-walnut-800 mb-4">
              Pickup Details
            </h3>

            <div className="space-y-4 mb-8">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-dusty-rose-600 mt-0.5" />
                <div>
                  <p className="font-medium text-walnut-800">Location</p>
                  <p className="text-walnut-600">123 Bakery Lane, New York, NY 10001</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-dusty-rose-600 mt-0.5" />
                <div>
                  <p className="font-medium text-walnut-800">Pickup Time</p>
                  <p className="text-walnut-600">Saturday, 10:00 AM - 2:00 PM</p>
                </div>
              </div>
            </div>

            {/* What's Next */}
            <div className="border-t border-dusty-rose-200 pt-6 mb-6">
              <h3 className="font-serif text-lg text-walnut-800 mb-3">What's Next?</h3>
              <ul className="space-y-2 text-walnut-600 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-dusty-rose-500">•</span>
                  Check your email for order confirmation and receipt
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-dusty-rose-500">•</span>
                  We'll have your order ready on Saturday
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-dusty-rose-500">•</span>
                  Just come by during pickup hours - no appointment needed!
                </li>
              </ul>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Link to="/shop" className="btn-primary flex-1 text-center">
                Continue Shopping
              </Link>
              <Link to="/" className="btn-outline flex-1 text-center">
                Back to Home
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Footer */}
        <div className="bg-cream-50 px-8 py-4 text-center">
          <p className="text-sm text-walnut-600">
            Questions? Contact us at{' '}
            <a href="mailto:hello@mlbaking.com" className="text-dusty-rose-600 hover:underline">
              hello@mlbaking.com
            </a>
          </p>
        </div>
      </motion.div>
    </div>
  )
}


