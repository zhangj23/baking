import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Edit2, Trash2, X, Eye, EyeOff } from 'lucide-react'
import { api, formatPrice } from '../../utils/api'
import ImageUpload from '../../components/admin/ImageUpload'

export default function AdminProducts() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    image_url: '',
    is_active: true
  })
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      const data = await api.get('/products/admin')
      setProducts(data)
    } catch (error) {
      console.error('Failed to fetch products:', error)
    } finally {
      setLoading(false)
    }
  }

  const openModal = (product = null) => {
    if (product) {
      setEditingProduct(product)
      setFormData({
        name: product.name,
        description: product.description || '',
        price: (product.price / 100).toString(),
        category: product.category || '',
        image_url: product.image_url || '',
        is_active: product.is_active
      })
    } else {
      setEditingProduct(null)
      setFormData({
        name: '',
        description: '',
        price: '',
        category: '',
        image_url: '',
        is_active: true
      })
    }
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setEditingProduct(null)
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

    const productData = {
      ...formData,
      price: Math.round(parseFloat(formData.price) * 100) // Convert to cents
    }

    try {
      if (editingProduct) {
        await api.put(`/products/${editingProduct.id}`, productData)
      } else {
        await api.post('/products', productData)
      }
      await fetchProducts()
      closeModal()
    } catch (error) {
      console.error('Failed to save product:', error)
      alert('Failed to save product. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this product?')) return

    try {
      await api.delete(`/products/${id}`)
      setProducts(products.filter(p => p.id !== id))
    } catch (error) {
      console.error('Failed to delete product:', error)
      alert('Failed to delete product. Please try again.')
    }
  }

  const toggleActive = async (product) => {
    try {
      await api.put(`/products/${product.id}`, { is_active: !product.is_active })
      setProducts(products.map(p => 
        p.id === product.id ? { ...p, is_active: !p.is_active } : p
      ))
    } catch (error) {
      console.error('Failed to update product:', error)
    }
  }

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
          <h1 className="text-3xl font-serif text-ink-800">Products</h1>
          <p className="text-ink-600">Manage your bakery products</p>
        </div>
        <motion.button
          onClick={() => openModal()}
          className="btn-primary flex items-center gap-2"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Plus className="w-5 h-5" />
          Add Product
        </motion.button>
      </div>

      {/* Products Grid */}
      {products.length === 0 ? (
        <div className="bg-white rounded-lg p-12 text-center border border-rice-200">
          <div className="w-20 h-20 bg-vermillion-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-4xl">🥐</span>
          </div>
          <h3 className="text-xl font-serif text-ink-800 mb-2">No products yet</h3>
          <p className="text-ink-600 mb-6">Start by adding your first product.</p>
          <button onClick={() => openModal()} className="btn-secondary">
            Add Your First Product
          </button>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <motion.div
              key={product.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className={`bg-white rounded-lg overflow-hidden shadow-sm border border-rice-200 ${
                !product.is_active ? 'opacity-60' : ''
              }`}
            >
              <div className="relative h-48">
                <img
                  src={product.image_url || 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400'}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 right-4 flex gap-2">
                  <button
                    onClick={() => toggleActive(product)}
                    className={`p-2 rounded-full ${
                      product.is_active ? 'bg-jade-500' : 'bg-ink-400'
                    } text-white`}
                    title={product.is_active ? 'Active' : 'Inactive'}
                  >
                    {product.is_active ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  </button>
                </div>
                {product.category && (
                  <span className="absolute top-4 left-4 px-3 py-1 bg-vermillion-600 text-rice-50 text-xs font-medium">
                    {product.category}
                  </span>
                )}
              </div>
              <div className="p-6">
                <h3 className="font-serif text-xl text-ink-800 mb-1">{product.name}</h3>
                <p className="text-ink-600 text-sm mb-3 line-clamp-2">{product.description}</p>
                <div className="flex items-center justify-between">
                  <span className="font-serif text-2xl text-vermillion-600">
                    {formatPrice(product.price)}
                  </span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => openModal(product)}
                      className="p-2 bg-blue-100 hover:bg-blue-200 text-blue-600 rounded-lg transition-colors"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(product.id)}
                      className="p-2 bg-red-100 hover:bg-red-200 text-red-600 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
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
                className="bg-white rounded-lg w-full max-w-lg max-h-[85vh] overflow-y-auto pointer-events-auto border border-rice-200"
              >
              <div className="sticky top-0 bg-white p-6 border-b border-rice-200 flex items-center justify-between">
                <h2 className="text-xl font-serif text-ink-800">
                  {editingProduct ? 'Edit Product' : 'Add New Product'}
                </h2>
                <button onClick={closeModal} className="p-2 hover:bg-rice-100 rounded-lg">
                  <X className="w-5 h-5 text-ink-600" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                <div>
                  <label className="label">Product Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="input-field"
                    placeholder="Matcha Square Toast"
                  />
                </div>

                <div>
                  <label className="label">Description</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={3}
                    className="input-field resize-none"
                    placeholder="Describe your product..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="label">Price ($)</label>
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleChange}
                      required
                      step="0.01"
                      min="0"
                      className="input-field"
                      placeholder="12.00"
                    />
                  </div>
                  <div>
                    <label className="label">Category</label>
                    <input
                      type="text"
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      className="input-field"
                      placeholder="Square Toast"
                    />
                  </div>
                </div>

                <div>
                  <label className="label">Product Image</label>
                  <ImageUpload
                    value={formData.image_url}
                    onChange={(url) => setFormData(prev => ({ ...prev, image_url: url }))}
                  />
                </div>

                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="is_active"
                    name="is_active"
                    checked={formData.is_active}
                    onChange={handleChange}
                    className="w-5 h-5 rounded border-rice-300 text-vermillion-600 focus:ring-vermillion-500"
                  />
                  <label htmlFor="is_active" className="text-ink-800">
                    Product is available (visible on store)
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
                    {saving ? 'Saving...' : (editingProduct ? 'Save Changes' : 'Add Product')}
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


