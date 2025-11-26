import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Save, Eye, EyeOff, Lock, Globe } from 'lucide-react'
import { api } from '../../utils/api'
import { useConfig } from '../../context/ConfigContext'

export default function AdminSettings() {
  const { config, refreshConfig } = useConfig()
  const [settings, setSettings] = useState({
    blogVisible: true
  })
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
  const [saving, setSaving] = useState(false)
  const [changingPassword, setChangingPassword] = useState(false)
  const [message, setMessage] = useState({ type: '', text: '' })

  useEffect(() => {
    if (config.BLOG_VISIBLE !== undefined) {
      setSettings({
        blogVisible: config.BLOG_VISIBLE === true || config.BLOG_VISIBLE === 'true'
      })
    }
  }, [config])

  const handleBlogToggle = async () => {
    setSaving(true)
    try {
      await api.put('/config/BLOG_VISIBLE', { value: !settings.blogVisible })
      setSettings(prev => ({ ...prev, blogVisible: !prev.blogVisible }))
      await refreshConfig()
      setMessage({ type: 'success', text: 'Blog visibility updated!' })
    } catch (error) {
      console.error('Failed to update setting:', error)
      setMessage({ type: 'error', text: 'Failed to update setting.' })
    } finally {
      setSaving(false)
      setTimeout(() => setMessage({ type: '', text: '' }), 3000)
    }
  }

  const handlePasswordChange = async (e) => {
    e.preventDefault()
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage({ type: 'error', text: 'New passwords do not match.' })
      return
    }

    if (passwordData.newPassword.length < 6) {
      setMessage({ type: 'error', text: 'Password must be at least 6 characters.' })
      return
    }

    setChangingPassword(true)
    try {
      await api.post('/auth/change-password', {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      })
      setMessage({ type: 'success', text: 'Password changed successfully!' })
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' })
    } catch (error) {
      setMessage({ type: 'error', text: error.message || 'Failed to change password.' })
    } finally {
      setChangingPassword(false)
      setTimeout(() => setMessage({ type: '', text: '' }), 3000)
    }
  }

  return (
    <div className="p-8 max-w-2xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-serif text-ink-800">Settings</h1>
        <p className="text-ink-600">Configure your store settings</p>
      </div>

      {/* Message */}
      {message.text && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`mb-6 p-4 ${
            message.type === 'success' 
              ? 'bg-jade-50 border border-jade-200 text-jade-700' 
              : 'bg-vermillion-50 border border-vermillion-200 text-vermillion-700'
          }`}
        >
          {message.text}
        </motion.div>
      )}

      {/* Site Settings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg p-6 shadow-sm mb-6 border border-rice-200"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-jade-100 rounded-lg flex items-center justify-center">
            <Globe className="w-5 h-5 text-jade-600" />
          </div>
          <h2 className="text-xl font-serif text-ink-800">Site Settings</h2>
        </div>

        <div className="space-y-6">
          {/* Blog Visibility Toggle */}
          <div className="flex items-center justify-between p-4 bg-rice-50 rounded-lg border border-rice-200">
            <div className="flex items-center gap-4">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                settings.blogVisible ? 'bg-jade-100' : 'bg-rice-200'
              }`}>
                {settings.blogVisible ? (
                  <Eye className="w-5 h-5 text-jade-600" />
                ) : (
                  <EyeOff className="w-5 h-5 text-ink-500" />
                )}
              </div>
              <div>
                <p className="font-medium text-ink-800">Blog Section</p>
                <p className="text-sm text-ink-500">
                  {settings.blogVisible 
                    ? 'Blog is visible on your website' 
                    : 'Blog is hidden from your website'}
                </p>
              </div>
            </div>
            <button
              onClick={handleBlogToggle}
              disabled={saving}
              className={`relative w-14 h-8 rounded-full transition-colors ${
                settings.blogVisible ? 'bg-jade-500' : 'bg-rice-300'
              }`}
            >
              <motion.div
                className="absolute top-1 w-6 h-6 bg-white rounded-full shadow"
                animate={{ left: settings.blogVisible ? 28 : 4 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              />
            </button>
          </div>
        </div>
      </motion.div>

      {/* Security Settings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-lg p-6 shadow-sm border border-rice-200"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-vermillion-100 rounded-lg flex items-center justify-center">
            <Lock className="w-5 h-5 text-vermillion-600" />
          </div>
          <h2 className="text-xl font-serif text-ink-800">Security</h2>
        </div>

        <form onSubmit={handlePasswordChange} className="space-y-4">
          <div>
            <label className="label">Current Password</label>
            <input
              type="password"
              value={passwordData.currentPassword}
              onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
              required
              className="input-field"
              placeholder="••••••••"
            />
          </div>

          <div>
            <label className="label">New Password</label>
            <input
              type="password"
              value={passwordData.newPassword}
              onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
              required
              className="input-field"
              placeholder="••••••••"
            />
          </div>

          <div>
            <label className="label">Confirm New Password</label>
            <input
              type="password"
              value={passwordData.confirmPassword}
              onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
              required
              className="input-field"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={changingPassword}
            className="btn-primary w-full flex items-center justify-center gap-2"
          >
            {changingPassword ? (
              <div className="w-5 h-5 border-2 border-rice-50 border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <Save className="w-5 h-5" />
                Change Password
              </>
            )}
          </button>
        </form>
      </motion.div>

      {/* Info Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mt-6 p-4 bg-gold-50 border border-gold-200 rounded-lg"
      >
        <p className="text-sm text-ink-600">
          <strong className="text-ink-800">Tip:</strong> For advanced settings like 
          AWS S3 configuration, Stripe keys, and email settings, update your environment 
          variables on your hosting platform.
        </p>
      </motion.div>
    </div>
  )
}
