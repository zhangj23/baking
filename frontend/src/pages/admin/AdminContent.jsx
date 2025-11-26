import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Save, Image, Type, RefreshCw } from 'lucide-react'
import { api } from '../../utils/api'
import ImageUpload from '../../components/admin/ImageUpload'

export default function AdminContent() {
  const [content, setContent] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState({ type: '', text: '' })
  const [activeTab, setActiveTab] = useState('home')
  const [changes, setChanges] = useState({})

  useEffect(() => {
    fetchContent()
  }, [])

  const fetchContent = async () => {
    try {
      const data = await api.get('/content')
      setContent(data)
      setChanges({})
    } catch (error) {
      console.error('Failed to fetch content:', error)
      setMessage({ type: 'error', text: 'Failed to load content' })
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (id, value) => {
    setChanges(prev => ({ ...prev, [id]: value }))
  }

  const getValue = (id) => {
    if (changes[id] !== undefined) return changes[id]
    const item = content.find(c => c.id === id)
    return item?.content || ''
  }

  const handleSave = async () => {
    if (Object.keys(changes).length === 0) {
      setMessage({ type: 'info', text: 'No changes to save' })
      return
    }

    setSaving(true)
    try {
      const updates = Object.entries(changes).map(([id, content]) => ({ id, content }))
      await api.post('/content/bulk-update', { updates })
      setMessage({ type: 'success', text: 'Content saved successfully!' })
      setChanges({})
      await fetchContent()
    } catch (error) {
      console.error('Failed to save content:', error)
      setMessage({ type: 'error', text: 'Failed to save content' })
    } finally {
      setSaving(false)
      setTimeout(() => setMessage({ type: '', text: '' }), 3000)
    }
  }

  const homeContent = content.filter(c => c.page === 'home')
  const aboutContent = content.filter(c => c.page === 'about')

  const hasChanges = Object.keys(changes).length > 0

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-screen">
        <div className="w-12 h-12 border-4 border-vermillion-600 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-serif text-ink-800">Page Content</h1>
          <p className="text-ink-600">Edit text and images on your website pages</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={fetchContent}
            className="btn-outline flex items-center gap-2"
            disabled={loading}
          >
            <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          <motion.button
            onClick={handleSave}
            disabled={saving || !hasChanges}
            className={`btn-primary flex items-center gap-2 ${!hasChanges ? 'opacity-50' : ''}`}
            whileHover={{ scale: hasChanges ? 1.02 : 1 }}
            whileTap={{ scale: hasChanges ? 0.98 : 1 }}
          >
            {saving ? (
              <div className="w-5 h-5 border-2 border-rice-50 border-t-transparent rounded-full animate-spin" />
            ) : (
              <Save className="w-5 h-5" />
            )}
            Save Changes
          </motion.button>
        </div>
      </div>

      {/* Message */}
      {message.text && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`mb-6 p-4 rounded-lg ${
            message.type === 'success' ? 'bg-jade-50 border border-jade-200 text-jade-700' :
            message.type === 'error' ? 'bg-vermillion-50 border border-vermillion-200 text-vermillion-700' :
            'bg-gold-50 border border-gold-200 text-gold-700'
          }`}
        >
          {message.text}
        </motion.div>
      )}

      {/* Unsaved Changes Warning */}
      {hasChanges && (
        <div className="mb-6 p-4 bg-gold-50 border border-gold-200 rounded-lg">
          <p className="text-gold-700 text-sm">
            You have unsaved changes. Don't forget to save!
          </p>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b border-rice-200">
        {[
          { id: 'home', label: 'Home Page' },
          { id: 'about', label: 'About Page' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-6 py-3 font-medium transition-colors border-b-2 -mb-px ${
              activeTab === tab.id
                ? 'border-vermillion-600 text-vermillion-600'
                : 'border-transparent text-ink-500 hover:text-ink-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content Editor */}
      <div className="space-y-8">
        {activeTab === 'home' && (
          <div className="space-y-6">
            {/* Hero Section */}
            <div className="bg-white rounded-lg p-6 border border-rice-200">
              <h2 className="text-xl font-serif text-ink-800 mb-6 flex items-center gap-2">
                <span className="w-8 h-8 bg-vermillion-100 rounded-lg flex items-center justify-center">
                  <Image className="w-4 h-4 text-vermillion-600" />
                </span>
                Hero Section
              </h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="label">Hero Image</label>
                  <ImageUpload
                    value={getValue('home_hero_image')}
                    onChange={(url) => handleChange('home_hero_image', url)}
                  />
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="label">Badge Text</label>
                    <input
                      type="text"
                      value={getValue('home_hero_badge')}
                      onChange={(e) => handleChange('home_hero_badge', e.target.value)}
                      className="input-field"
                    />
                  </div>
                  
                  <div>
                    <label className="label">Title Line 1</label>
                    <input
                      type="text"
                      value={getValue('home_hero_title')}
                      onChange={(e) => handleChange('home_hero_title', e.target.value)}
                      className="input-field"
                    />
                  </div>
                  
                  <div>
                    <label className="label">Title Line 2 (Highlighted)</label>
                    <input
                      type="text"
                      value={getValue('home_hero_title_highlight')}
                      onChange={(e) => handleChange('home_hero_title_highlight', e.target.value)}
                      className="input-field"
                    />
                  </div>
                </div>
              </div>

              <div className="mt-4">
                <label className="label">Hero Description</label>
                <textarea
                  value={getValue('home_hero_description')}
                  onChange={(e) => handleChange('home_hero_description', e.target.value)}
                  rows={3}
                  className="input-field resize-none"
                />
              </div>
            </div>

            {/* CTA Section */}
            <div className="bg-white rounded-lg p-6 border border-rice-200">
              <h2 className="text-xl font-serif text-ink-800 mb-6 flex items-center gap-2">
                <span className="w-8 h-8 bg-gold-100 rounded-lg flex items-center justify-center">
                  <Type className="w-4 h-4 text-gold-600" />
                </span>
                Call to Action Section
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="label">CTA Title</label>
                  <input
                    type="text"
                    value={getValue('home_cta_title')}
                    onChange={(e) => handleChange('home_cta_title', e.target.value)}
                    className="input-field"
                  />
                </div>
                
                <div>
                  <label className="label">CTA Description</label>
                  <textarea
                    value={getValue('home_cta_description')}
                    onChange={(e) => handleChange('home_cta_description', e.target.value)}
                    rows={3}
                    className="input-field resize-none"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'about' && (
          <div className="space-y-6">
            {/* Hero Section */}
            <div className="bg-white rounded-lg p-6 border border-rice-200">
              <h2 className="text-xl font-serif text-ink-800 mb-6 flex items-center gap-2">
                <span className="w-8 h-8 bg-vermillion-100 rounded-lg flex items-center justify-center">
                  <Image className="w-4 h-4 text-vermillion-600" />
                </span>
                Hero Section
              </h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="label">About Image</label>
                  <ImageUpload
                    value={getValue('about_hero_image')}
                    onChange={(url) => handleChange('about_hero_image', url)}
                  />
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="label">Page Title</label>
                    <input
                      type="text"
                      value={getValue('about_title')}
                      onChange={(e) => handleChange('about_title', e.target.value)}
                      className="input-field"
                    />
                  </div>
                  
                  <div>
                    <label className="label">Subtitle</label>
                    <textarea
                      value={getValue('about_subtitle')}
                      onChange={(e) => handleChange('about_subtitle', e.target.value)}
                      rows={3}
                      className="input-field resize-none"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Story Section */}
            <div className="bg-white rounded-lg p-6 border border-rice-200">
              <h2 className="text-xl font-serif text-ink-800 mb-6 flex items-center gap-2">
                <span className="w-8 h-8 bg-jade-100 rounded-lg flex items-center justify-center">
                  <Type className="w-4 h-4 text-jade-600" />
                </span>
                Our Story
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="label">Paragraph 1</label>
                  <textarea
                    value={getValue('about_story_p1')}
                    onChange={(e) => handleChange('about_story_p1', e.target.value)}
                    rows={4}
                    className="input-field resize-none"
                  />
                </div>
                
                <div>
                  <label className="label">Paragraph 2</label>
                  <textarea
                    value={getValue('about_story_p2')}
                    onChange={(e) => handleChange('about_story_p2', e.target.value)}
                    rows={4}
                    className="input-field resize-none"
                  />
                </div>
                
                <div>
                  <label className="label">Paragraph 3</label>
                  <textarea
                    value={getValue('about_story_p3')}
                    onChange={(e) => handleChange('about_story_p3', e.target.value)}
                    rows={4}
                    className="input-field resize-none"
                  />
                </div>
                
                <div>
                  <label className="label">Quote / Closing Statement</label>
                  <textarea
                    value={getValue('about_story_quote')}
                    onChange={(e) => handleChange('about_story_quote', e.target.value)}
                    rows={3}
                    className="input-field resize-none"
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

