import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Save, Eye, EyeOff, Lock, Globe, Palette, Check } from 'lucide-react'
import { api } from '../../utils/api'
import { useConfig } from '../../context/ConfigContext'
import { useTheme, colorSchemes } from '../../context/ThemeContext'

export default function AdminSettings() {
  const { config, refreshConfig } = useConfig()
  const { colorScheme, customColors, updateTheme } = useTheme()
  const [settings, setSettings] = useState({
    blogVisible: true
  })
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
  const [selectedScheme, setSelectedScheme] = useState(colorScheme)
  const [localCustomColors, setLocalCustomColors] = useState(customColors)
  const [saving, setSaving] = useState(false)
  const [savingTheme, setSavingTheme] = useState(false)
  const [changingPassword, setChangingPassword] = useState(false)
  const [message, setMessage] = useState({ type: '', text: '' })

  useEffect(() => {
    setSelectedScheme(colorScheme)
    setLocalCustomColors(customColors)
  }, [colorScheme, customColors])

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

      {/* Color Scheme Settings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="bg-white rounded-lg p-6 shadow-sm mb-6 border border-rice-200"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
            <Palette className="w-5 h-5 text-purple-600" />
          </div>
          <h2 className="text-xl font-serif text-ink-800">Color Scheme</h2>
        </div>

        {/* Predefined Schemes */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mb-6">
          {Object.entries(colorSchemes).filter(([key]) => key !== 'custom').map(([key, scheme]) => (
            <button
              key={key}
              onClick={() => setSelectedScheme(key)}
              className={`relative p-3 rounded-lg border-2 transition-all ${
                selectedScheme === key 
                  ? 'border-vermillion-500 bg-rice-50' 
                  : 'border-rice-200 hover:border-rice-300'
              }`}
            >
              <div className="flex gap-1 mb-2">
                <div className="w-6 h-6 rounded-full" style={{ backgroundColor: scheme.primary }} />
                <div className="w-6 h-6 rounded-full" style={{ backgroundColor: scheme.secondary }} />
                <div className="w-6 h-6 rounded-full" style={{ backgroundColor: scheme.accent }} />
              </div>
              <p className="text-sm font-medium text-ink-700">{scheme.name}</p>
              {selectedScheme === key && (
                <div className="absolute top-2 right-2">
                  <Check className="w-4 h-4 text-vermillion-500" />
                </div>
              )}
            </button>
          ))}
          
          {/* Custom Option */}
          <button
            onClick={() => setSelectedScheme('custom')}
            className={`relative p-3 rounded-lg border-2 transition-all ${
              selectedScheme === 'custom' 
                ? 'border-vermillion-500 bg-rice-50' 
                : 'border-rice-200 hover:border-rice-300'
            }`}
          >
            <div className="flex gap-1 mb-2">
              <div className="w-6 h-6 rounded-full border-2 border-dashed border-ink-300" style={{ backgroundColor: localCustomColors.primary }} />
              <div className="w-6 h-6 rounded-full border-2 border-dashed border-ink-300" style={{ backgroundColor: localCustomColors.secondary }} />
              <div className="w-6 h-6 rounded-full border-2 border-dashed border-ink-300" style={{ backgroundColor: localCustomColors.accent }} />
            </div>
            <p className="text-sm font-medium text-ink-700">Custom</p>
            {selectedScheme === 'custom' && (
              <div className="absolute top-2 right-2">
                <Check className="w-4 h-4 text-vermillion-500" />
              </div>
            )}
          </button>
        </div>

        {/* Custom Color Pickers */}
        {selectedScheme === 'custom' && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="p-4 bg-rice-50 rounded-lg border border-rice-200 mb-6"
          >
            <p className="text-sm font-medium text-ink-700 mb-4">Custom Colors</p>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="text-xs text-ink-500 mb-1 block">Primary</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={localCustomColors.primary}
                    onChange={(e) => setLocalCustomColors(prev => ({ ...prev, primary: e.target.value }))}
                    className="w-10 h-10 rounded cursor-pointer"
                  />
                  <input
                    type="text"
                    value={localCustomColors.primary}
                    onChange={(e) => setLocalCustomColors(prev => ({ ...prev, primary: e.target.value }))}
                    className="input-field text-xs flex-1"
                  />
                </div>
              </div>
              <div>
                <label className="text-xs text-ink-500 mb-1 block">Secondary</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={localCustomColors.secondary}
                    onChange={(e) => setLocalCustomColors(prev => ({ ...prev, secondary: e.target.value }))}
                    className="w-10 h-10 rounded cursor-pointer"
                  />
                  <input
                    type="text"
                    value={localCustomColors.secondary}
                    onChange={(e) => setLocalCustomColors(prev => ({ ...prev, secondary: e.target.value }))}
                    className="input-field text-xs flex-1"
                  />
                </div>
              </div>
              <div>
                <label className="text-xs text-ink-500 mb-1 block">Accent</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={localCustomColors.accent}
                    onChange={(e) => setLocalCustomColors(prev => ({ ...prev, accent: e.target.value }))}
                    className="w-10 h-10 rounded cursor-pointer"
                  />
                  <input
                    type="text"
                    value={localCustomColors.accent}
                    onChange={(e) => setLocalCustomColors(prev => ({ ...prev, accent: e.target.value }))}
                    className="input-field text-xs flex-1"
                  />
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Preview */}
        <div className="p-4 rounded-lg border border-rice-200 mb-6" style={{ 
          backgroundColor: selectedScheme === 'custom' ? localCustomColors.background || '#FFFEF7' : colorSchemes[selectedScheme]?.background 
        }}>
          <p className="text-sm text-ink-500 mb-3">Preview</p>
          <div className="flex items-center gap-3">
            <button 
              className="px-4 py-2 rounded text-white text-sm font-medium"
              style={{ backgroundColor: selectedScheme === 'custom' ? localCustomColors.primary : colorSchemes[selectedScheme]?.primary }}
            >
              Primary Button
            </button>
            <button 
              className="px-4 py-2 rounded text-white text-sm font-medium"
              style={{ backgroundColor: selectedScheme === 'custom' ? localCustomColors.secondary : colorSchemes[selectedScheme]?.secondary }}
            >
              Secondary
            </button>
            <span 
              className="text-sm font-medium"
              style={{ color: selectedScheme === 'custom' ? localCustomColors.accent : colorSchemes[selectedScheme]?.accent }}
            >
              Accent Text
            </span>
          </div>
        </div>

        {/* Save Button */}
        <button
          onClick={async () => {
            setSavingTheme(true)
            try {
              await api.put('/config/COLOR_SCHEME', { value: selectedScheme })
              if (selectedScheme === 'custom') {
                await api.put('/config/CUSTOM_COLORS', { value: localCustomColors })
              }
              updateTheme(selectedScheme, selectedScheme === 'custom' ? localCustomColors : null)
              setMessage({ type: 'success', text: 'Color scheme updated!' })
            } catch (error) {
              setMessage({ type: 'error', text: 'Failed to save color scheme.' })
            } finally {
              setSavingTheme(false)
              setTimeout(() => setMessage({ type: '', text: '' }), 3000)
            }
          }}
          disabled={savingTheme}
          className="btn-primary w-full flex items-center justify-center gap-2"
        >
          {savingTheme ? (
            <div className="w-5 h-5 border-2 border-rice-50 border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              <Palette className="w-5 h-5" />
              Save Color Scheme
            </>
          )}
        </button>
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
