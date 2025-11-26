import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Edit2, Trash2, X, Eye, EyeOff, Video, Image } from 'lucide-react'
import { api } from '../../utils/api'
import ImageUpload from '../../components/admin/ImageUpload'

export default function AdminBlog() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingPost, setEditingPost] = useState(null)
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    video_url: '',
    image_url: '',
    is_published: true
  })
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetchPosts()
  }, [])

  const fetchPosts = async () => {
    try {
      const data = await api.get('/blog/admin')
      setPosts(data)
    } catch (error) {
      console.error('Failed to fetch posts:', error)
    } finally {
      setLoading(false)
    }
  }

  const openModal = (post = null) => {
    if (post) {
      setEditingPost(post)
      setFormData({
        title: post.title,
        content: post.content || '',
        video_url: post.video_url || '',
        image_url: post.image_url || '',
        is_published: post.is_published
      })
    } else {
      setEditingPost(null)
      setFormData({
        title: '',
        content: '',
        video_url: '',
        image_url: '',
        is_published: true
      })
    }
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setEditingPost(null)
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)

    try {
      if (editingPost) {
        await api.put(`/blog/${editingPost.id}`, formData)
      } else {
        await api.post('/blog', formData)
      }
      await fetchPosts()
      closeModal()
    } catch (error) {
      console.error('Failed to save post:', error)
      alert('Failed to save post. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this post?')) return

    try {
      await api.delete(`/blog/${id}`)
      setPosts(posts.filter(p => p.id !== id))
    } catch (error) {
      console.error('Failed to delete post:', error)
      alert('Failed to delete post. Please try again.')
    }
  }

  const togglePublished = async (post) => {
    try {
      await api.put(`/blog/${post.id}`, { is_published: !post.is_published })
      setPosts(posts.map(p => 
        p.id === post.id ? { ...p, is_published: !p.is_published } : p
      ))
    } catch (error) {
      console.error('Failed to update post:', error)
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-screen">
        <div className="w-12 h-12 border-4 border-dusty-rose-400 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-serif text-walnut-800">Blog Posts</h1>
          <p className="text-walnut-600">Share recipes and stories with your customers</p>
        </div>
        <motion.button
          onClick={() => openModal()}
          className="btn-primary flex items-center gap-2"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Plus className="w-5 h-5" />
          New Post
        </motion.button>
      </div>

      {/* Posts List */}
      {posts.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center">
          <div className="w-20 h-20 bg-dusty-rose-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-4xl">✍️</span>
          </div>
          <h3 className="text-xl font-serif text-walnut-800 mb-2">No blog posts yet</h3>
          <p className="text-walnut-600 mb-6">Start sharing your baking journey!</p>
          <button onClick={() => openModal()} className="btn-secondary">
            Write Your First Post
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {posts.map((post) => (
            <motion.div
              key={post.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`bg-white rounded-2xl p-6 shadow-sm ${
                !post.is_published ? 'opacity-60' : ''
              }`}
            >
              <div className="flex items-start gap-4">
                {/* Thumbnail */}
                <div className="w-24 h-24 rounded-xl overflow-hidden bg-dusty-rose-100 flex-shrink-0 flex items-center justify-center">
                  {post.image_url ? (
                    <img src={post.image_url} alt={post.title} className="w-full h-full object-cover" />
                  ) : post.video_url ? (
                    <Video className="w-8 h-8 text-dusty-rose-400" />
                  ) : (
                    <Image className="w-8 h-8 text-dusty-rose-400" />
                  )}
                </div>

                {/* Content */}
                <div className="flex-grow">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-serif text-xl text-walnut-800">{post.title}</h3>
                      <p className="text-sm text-walnut-500">{formatDate(post.created_at)}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => togglePublished(post)}
                        className={`p-2 rounded-lg ${
                          post.is_published 
                            ? 'bg-green-100 text-green-600' 
                            : 'bg-gray-100 text-gray-600'
                        }`}
                        title={post.is_published ? 'Published' : 'Draft'}
                      >
                        {post.is_published ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                      </button>
                      <button
                        onClick={() => openModal(post)}
                        className="p-2 bg-blue-100 hover:bg-blue-200 text-blue-600 rounded-lg transition-colors"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(post.id)}
                        className="p-2 bg-red-100 hover:bg-red-200 text-red-600 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  {post.content && (
                    <p 
                      className="text-walnut-600 mt-2 line-clamp-2"
                      dangerouslySetInnerHTML={{ 
                        __html: post.content.replace(/<[^>]+>/g, '').slice(0, 200) + '...'
                      }}
                    />
                  )}
                  <div className="flex gap-2 mt-3">
                    {post.video_url && (
                      <span className="text-xs px-2 py-1 bg-purple-100 text-purple-600 rounded-full">
                        Has Video
                      </span>
                    )}
                    {!post.is_published && (
                      <span className="text-xs px-2 py-1 bg-yellow-100 text-yellow-600 rounded-full">
                        Draft
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeModal}
              className="fixed inset-0 bg-black/50 z-50"
            />
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="bg-white rounded-2xl w-full max-w-2xl max-h-[85vh] overflow-y-auto pointer-events-auto"
              >
              <div className="sticky top-0 bg-white p-6 border-b border-gray-100 flex items-center justify-between">
                <h2 className="text-xl font-serif text-walnut-800">
                  {editingPost ? 'Edit Post' : 'New Blog Post'}
                </h2>
                <button onClick={closeModal} className="p-2 hover:bg-gray-100 rounded-lg">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                <div>
                  <label className="label">Title</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                    className="input-field"
                    placeholder="The Secret to Perfect Sourdough"
                  />
                </div>

                <div>
                  <label className="label">Content (HTML supported)</label>
                  <textarea
                    name="content"
                    value={formData.content}
                    onChange={handleChange}
                    rows={10}
                    className="input-field resize-none font-mono text-sm"
                    placeholder="<p>Write your post content here...</p>"
                  />
                  <p className="text-xs text-walnut-500 mt-1">
                    You can use HTML tags for formatting (p, h2, h3, strong, em, ul, li, etc.)
                  </p>
                </div>

                <div>
                  <label className="label">YouTube Video URL (optional)</label>
                  <input
                    type="url"
                    name="video_url"
                    value={formData.video_url}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="https://youtube.com/watch?v=..."
                  />
                </div>

                <div>
                  <label className="label">Featured Image (optional)</label>
                  <ImageUpload
                    value={formData.image_url}
                    onChange={(url) => setFormData(prev => ({ ...prev, image_url: url }))}
                  />
                </div>

                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="is_published"
                    name="is_published"
                    checked={formData.is_published}
                    onChange={handleChange}
                    className="w-5 h-5 rounded border-rice-300 text-vermillion-600 focus:ring-vermillion-500"
                  />
                  <label htmlFor="is_published" className="text-ink-800">
                    Publish immediately
                  </label>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="btn-outline flex-1"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="btn-primary flex-1"
                  >
                    {saving ? 'Saving...' : (editingPost ? 'Save Changes' : 'Create Post')}
                  </button>
                </div>
              </form>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}


