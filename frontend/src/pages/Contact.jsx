import { useState } from 'react'
import { motion } from 'framer-motion'
import { Send, MapPin, Mail, Instagram, Clock, Check } from 'lucide-react'
import SEO from '../components/SEO'

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  })
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    setSubmitted(true)
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-cream-50">
      <SEO 
        title="Contact Us"
        description="Get in touch with MLJJ Cooking. Questions about orders, pickup times, or custom requests? We'd love to hear from you."
        url="/contact"
      />
      {/* Header */}
      <section className="relative py-16 bg-gradient-to-b from-dusty-rose-100 to-cream-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="max-w-2xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="section-title">Get in Touch</h1>
            <p className="section-subtitle">
              Have a question, special request, or just want to say hello? We'd love to hear from you!
            </p>
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <section className="py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              {submitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-white rounded-3xl p-12 shadow-warm text-center"
                >
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Check className="w-10 h-10 text-green-600" />
                  </div>
                  <h3 className="font-serif text-2xl text-walnut-800 mb-4">
                    Message Sent!
                  </h3>
                  <p className="text-walnut-600 mb-6">
                    Thanks for reaching out! We'll get back to you as soon as possible.
                  </p>
                  <button
                    onClick={() => {
                      setSubmitted(false)
                      setFormData({ name: '', email: '', message: '' })
                    }}
                    className="btn-secondary"
                  >
                    Send Another Message
                  </button>
                </motion.div>
              ) : (
                <form 
                  onSubmit={handleSubmit}
                  className="bg-white rounded-3xl p-8 shadow-warm"
                >
                  <h2 className="font-serif text-2xl text-walnut-800 mb-6">
                    Send us a message
                  </h2>

                  <div className="space-y-6">
                    <div>
                      <label htmlFor="name" className="label">
                        Your Name
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
                    </div>

                    <div>
                      <label htmlFor="message" className="label">
                        Message
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        required
                        rows={5}
                        className="input-field resize-none"
                        placeholder="Tell us what's on your mind..."
                      />
                    </div>

                    <motion.button
                      type="submit"
                      className="btn-primary w-full flex items-center justify-center gap-2"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      disabled={loading}
                    >
                      {loading ? (
                        <div className="w-5 h-5 border-2 border-cream-50 border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <>
                          <Send className="w-5 h-5" />
                          Send Message
                        </>
                      )}
                    </motion.button>
                  </div>
                </form>
              )}
            </motion.div>

            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-8"
            >
              {/* Location */}
              <div className="bg-white rounded-3xl p-8 shadow-warm">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-dusty-rose-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-6 h-6 text-dusty-rose-600" />
                  </div>
                  <div>
                    <h3 className="font-serif text-xl text-walnut-800 mb-2">
                      Pickup Location
                    </h3>
                    <p className="text-walnut-600">
                      123 Bakery Lane<br />
                      New York, NY 10001
                    </p>
                  </div>
                </div>
              </div>

              {/* Hours */}
              <div className="bg-white rounded-3xl p-8 shadow-warm">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-dusty-rose-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Clock className="w-6 h-6 text-dusty-rose-600" />
                  </div>
                  <div>
                    <h3 className="font-serif text-xl text-walnut-800 mb-2">
                      Pickup Hours
                    </h3>
                    <p className="text-walnut-600">
                      Saturdays: 10:00 AM - 2:00 PM<br />
                      <span className="text-sm text-walnut-500">
                        Pre-orders close Wednesday at midnight
                      </span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Email */}
              <div className="bg-white rounded-3xl p-8 shadow-warm">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-dusty-rose-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Mail className="w-6 h-6 text-dusty-rose-600" />
                  </div>
                  <div>
                    <h3 className="font-serif text-xl text-walnut-800 mb-2">
                      Email Us
                    </h3>
                    <a 
                      href="mailto:hello@mlbaking.com" 
                      className="text-dusty-rose-600 hover:text-dusty-rose-700 transition-colors"
                    >
                      hello@mlbaking.com
                    </a>
                  </div>
                </div>
              </div>

              {/* Social */}
              <div className="bg-white rounded-3xl p-8 shadow-warm">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-dusty-rose-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Instagram className="w-6 h-6 text-dusty-rose-600" />
                  </div>
                  <div>
                    <h3 className="font-serif text-xl text-walnut-800 mb-2">
                      Follow Us
                    </h3>
                    <a 
                      href="https://instagram.com/mlbaking" 
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-dusty-rose-600 hover:text-dusty-rose-700 transition-colors"
                    >
                      @mlbaking
                    </a>
                    <p className="text-sm text-walnut-500 mt-1">
                      Behind-the-scenes, new products & more!
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  )
}


