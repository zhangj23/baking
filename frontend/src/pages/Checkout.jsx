import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { loadStripe } from '@stripe/stripe-js'
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js'
import { ArrowLeft, Lock, MapPin, Clock } from 'lucide-react'
import { useCart } from '../context/CartContext'
import { api, formatPrice } from '../utils/api'

// Initialize Stripe
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY || 'pk_test_placeholder')

// Card Element Styling
const cardElementOptions = {
  style: {
    base: {
      fontSize: '16px',
      color: '#5D4037',
      fontFamily: 'Lato, system-ui, sans-serif',
      '::placeholder': {
        color: '#9d7e6c'
      }
    },
    invalid: {
      color: '#ef4444'
    }
  }
}

function CheckoutForm() {
  const stripe = useStripe()
  const elements = useElements()
  const navigate = useNavigate()
  const { items, cartTotal, clearCart } = useCart()
  
  const [formData, setFormData] = useState({
    name: '',
    email: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!stripe || !elements) return
    
    setLoading(true)
    setError(null)

    try {
      // Create payment intent on server
      const { clientSecret, orderId } = await api.post('/orders/create-payment-intent', {
        items: items.map(item => ({ id: item.id, quantity: item.quantity })),
        customer_email: formData.email,
        customer_name: formData.name
      })

      // Confirm payment with Stripe
      const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(
        clientSecret,
        {
          payment_method: {
            card: elements.getElement(CardElement),
            billing_details: {
              name: formData.name,
              email: formData.email
            }
          }
        }
      )

      if (stripeError) {
        setError(stripeError.message)
        setLoading(false)
        return
      }

      if (paymentIntent.status === 'succeeded') {
        clearCart()
        navigate('/order-confirmation', { 
          state: { 
            orderId, 
            email: formData.email,
            name: formData.name 
          }
        })
      }
    } catch (err) {
      setError(err.message || 'Payment failed. Please try again.')
      setLoading(false)
    }
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-cream-50 flex flex-col items-center justify-center p-8">
        <h2 className="font-serif text-2xl text-walnut-800 mb-4">Your cart is empty</h2>
        <p className="text-walnut-600 mb-6">Add some delicious items before checking out!</p>
        <Link to="/shop" className="btn-primary">
          Browse Shop
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-cream-50 py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
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
            Continue Shopping
          </Link>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Order Summary */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="order-2 lg:order-1"
          >
            <div className="bg-white rounded-3xl p-8 shadow-warm">
              <h2 className="font-serif text-2xl text-walnut-800 mb-6">
                Order Summary
              </h2>

              <div className="space-y-4 mb-6">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-4">
                    <div className="w-16 h-16 rounded-xl overflow-hidden bg-dusty-rose-100 flex-shrink-0">
                      <img
                        src={item.image_url || '/placeholder-bread.jpg'}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-grow">
                      <h3 className="font-medium text-walnut-800">{item.name}</h3>
                      <p className="text-sm text-walnut-600">Qty: {item.quantity}</p>
                    </div>
                    <div className="text-right">
                      <span className="font-medium text-walnut-800">
                        {formatPrice(item.price * item.quantity)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-dusty-rose-200 pt-4">
                <div className="flex justify-between text-lg">
                  <span className="text-walnut-600">Subtotal</span>
                  <span className="font-serif text-walnut-800">{formatPrice(cartTotal)}</span>
                </div>
                <div className="flex justify-between text-lg mt-2">
                  <span className="text-walnut-600">Tax</span>
                  <span className="text-walnut-600">Calculated at payment</span>
                </div>
                <div className="flex justify-between text-2xl font-serif mt-4 pt-4 border-t border-dusty-rose-200">
                  <span className="text-walnut-800">Total</span>
                  <span className="text-walnut-800">{formatPrice(cartTotal)}</span>
                </div>
              </div>
            </div>

            {/* Pickup Info */}
            <div className="bg-walnut-800 text-cream-50 rounded-3xl p-8 mt-6">
              <h3 className="font-serif text-xl mb-4 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-dusty-rose-400" />
                Pickup Information
              </h3>
              <div className="space-y-3 text-dusty-rose-100">
                <p className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 mt-1 flex-shrink-0" />
                  123 Bakery Lane, New York, NY 10001
                </p>
                <p className="flex items-start gap-2">
                  <Clock className="w-4 h-4 mt-1 flex-shrink-0" />
                  Saturday, 10:00 AM - 2:00 PM
                </p>
              </div>
              <p className="text-sm text-dusty-rose-300 mt-4">
                You'll receive a confirmation email with pickup details after payment.
              </p>
            </div>
          </motion.div>

          {/* Payment Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="order-1 lg:order-2"
          >
            <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-8 shadow-warm">
              <h2 className="font-serif text-2xl text-walnut-800 mb-6">
                Payment Details
              </h2>

              <div className="space-y-6">
                {/* Name */}
                <div>
                  <label htmlFor="name" className="label">
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="input-field"
                    placeholder="Jane Doe"
                  />
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="email" className="label">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="input-field"
                    placeholder="jane@example.com"
                  />
                  <p className="text-sm text-walnut-500 mt-1">
                    Your confirmation will be sent here
                  </p>
                </div>

                {/* Card Element */}
                <div>
                  <label className="label">Card Details</label>
                  <div className="p-4 border-2 border-dusty-rose-200 rounded-xl bg-white focus-within:border-walnut-800 transition-colors">
                    <CardElement options={cardElementOptions} />
                  </div>
                </div>

                {/* Error Message */}
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-600"
                  >
                    {error}
                  </motion.div>
                )}

                {/* Submit Button */}
                <motion.button
                  type="submit"
                  disabled={!stripe || loading}
                  className="btn-primary w-full py-4 text-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  whileHover={{ scale: loading ? 1 : 1.02 }}
                  whileTap={{ scale: loading ? 1 : 0.98 }}
                >
                  {loading ? (
                    <div className="w-6 h-6 border-2 border-cream-50 border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <Lock className="w-5 h-5" />
                      Pay {formatPrice(cartTotal)}
                    </>
                  )}
                </motion.button>

                {/* Security Note */}
                <p className="text-sm text-center text-walnut-500 flex items-center justify-center gap-2">
                  <Lock className="w-4 h-4" />
                  Secure payment powered by Stripe
                </p>
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default function Checkout() {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm />
    </Elements>
  )
}


