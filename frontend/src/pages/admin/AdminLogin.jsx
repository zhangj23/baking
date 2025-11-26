import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Lock, Mail, Eye, EyeOff } from 'lucide-react'
import { api } from '../../utils/api'

export default function AdminLogin() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [showPassword, setShowPassword] = useState(false)
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
    setLoading(true)
    setError(null)

    try {
      const response = await api.post('/auth/login', formData)
      localStorage.setItem('ml-baking-admin-token', response.token)
      navigate('/admin')
    } catch (err) {
      setError(err.message || 'Invalid credentials')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-oriental flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-oriental-pattern opacity-30" />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white shadow-oriental-lg w-full max-w-md overflow-hidden relative border border-rice-200"
      >
        {/* Header */}
        <div className="bg-ink-800 text-rice-50 p-8 text-center relative">
          <div className="h-1 absolute top-0 left-0 right-0 bg-gradient-to-r from-vermillion-600 via-gold-400 to-vermillion-600" />
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring' }}
            className="w-16 h-16 bg-vermillion-600 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-gold-400"
          >
            <span className="text-2xl text-rice-50 font-serif font-bold">美</span>
          </motion.div>
          <h1 className="font-serif text-2xl font-semibold text-rice-50">MLJJ Cooking</h1>
          <p className="text-gold-400 text-sm tracking-wider">Admin Portal • 管理入口</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-8">
          <h2 className="font-serif text-2xl text-ink-800 mb-6 text-center">
            Sign In
          </h2>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 bg-vermillion-50 border border-vermillion-200 text-vermillion-700 text-sm"
            >
              {error}
            </motion.div>
          )}

          <div className="space-y-6">
            {/* Email */}
            <div>
              <label htmlFor="email" className="label">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-ink-400" />
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="input-field pl-12"
                  placeholder="admin@mlbaking.com"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="label">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-ink-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="input-field pl-12 pr-12"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-ink-400 hover:text-ink-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-4 flex items-center justify-center"
              whileHover={{ scale: loading ? 1 : 1.02 }}
              whileTap={{ scale: loading ? 1 : 0.98 }}
            >
              {loading ? (
                <div className="w-6 h-6 border-2 border-rice-50 border-t-transparent rounded-full animate-spin" />
              ) : (
                'Sign In'
              )}
            </motion.button>
          </div>
        </form>

        {/* Footer */}
        <div className="px-8 pb-8 text-center">
          <a href="/" className="text-sm text-vermillion-600 hover:underline">
            ← Back to Store
          </a>
        </div>
      </motion.div>
    </div>
  )
}
