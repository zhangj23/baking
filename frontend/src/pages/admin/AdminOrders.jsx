import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Filter, X, Mail, Package } from 'lucide-react'
import { api, formatPrice } from '../../utils/api'

export default function AdminOrders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [selectedOrder, setSelectedOrder] = useState(null)

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      const data = await api.get('/orders')
      setOrders(data)
    } catch (error) {
      console.error('Failed to fetch orders:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateOrderStatus = async (orderId, status) => {
    try {
      await api.patch(`/orders/${orderId}/status`, { status })
      setOrders(orders.map(o => 
        o.id === orderId ? { ...o, status } : o
      ))
      if (selectedOrder?.id === orderId) {
        setSelectedOrder({ ...selectedOrder, status })
      }
    } catch (error) {
      console.error('Failed to update order status:', error)
      alert('Failed to update order status')
    }
  }

  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.customer_email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer_name?.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const getStatusColor = (status) => {
    switch (status) {
      case 'paid': return 'bg-jade-100 text-jade-700'
      case 'pending': return 'bg-gold-100 text-gold-700'
      case 'failed': return 'bg-vermillion-100 text-vermillion-700'
      case 'fulfilled': return 'bg-jade-100 text-jade-700'
      default: return 'bg-rice-200 text-ink-700'
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
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
      <div className="mb-8">
        <h1 className="text-3xl font-serif text-ink-800">Orders</h1>
        <p className="text-ink-600">Manage customer orders and fulfillment</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-grow max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-ink-400" />
          <input
            type="text"
            placeholder="Search by email, name, or order ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input-field pl-12"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-ink-600" />
          {['all', 'pending', 'paid', 'fulfilled', 'failed'].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-4 py-2 text-sm font-medium transition-colors border ${
                statusFilter === status
                  ? 'bg-vermillion-600 text-rice-50 border-vermillion-600'
                  : 'bg-white text-ink-600 border-rice-300 hover:border-gold-400'
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Orders List */}
      {filteredOrders.length === 0 ? (
        <div className="bg-white rounded-lg p-12 text-center border border-rice-200">
          <Package className="w-16 h-16 text-rice-300 mx-auto mb-4" />
          <h3 className="text-xl font-serif text-ink-800 mb-2">No orders found</h3>
          <p className="text-ink-600">
            {searchQuery || statusFilter !== 'all' 
              ? 'Try adjusting your filters.'
              : 'Orders will appear here once customers start ordering.'}
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-rice-200">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-rice-50 border-b border-rice-200">
                <tr>
                  <th className="text-left p-4 font-medium text-ink-600">Order</th>
                  <th className="text-left p-4 font-medium text-ink-600">Customer</th>
                  <th className="text-left p-4 font-medium text-ink-600">Date</th>
                  <th className="text-left p-4 font-medium text-ink-600">Total</th>
                  <th className="text-left p-4 font-medium text-ink-600">Status</th>
                  <th className="text-right p-4 font-medium text-ink-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-rice-200">
                {filteredOrders.map((order) => (
                  <motion.tr 
                    key={order.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="hover:bg-rice-50 cursor-pointer"
                    onClick={() => setSelectedOrder(order)}
                  >
                    <td className="p-4">
                      <span className="font-mono text-sm text-ink-800">
                        #{order.id.slice(0, 8).toUpperCase()}
                      </span>
                    </td>
                    <td className="p-4">
                      <div>
                        <p className="font-medium text-ink-800">{order.customer_name || 'N/A'}</p>
                        <p className="text-sm text-ink-500">{order.customer_email}</p>
                      </div>
                    </td>
                    <td className="p-4 text-ink-600 text-sm">
                      {formatDate(order.created_at)}
                    </td>
                    <td className="p-4 font-medium text-ink-800">
                      {formatPrice(order.total_amount)}
                    </td>
                    <td className="p-4">
                      <span className={`px-3 py-1 text-xs font-medium ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          setSelectedOrder(order)
                        }}
                        className="text-vermillion-600 hover:underline text-sm"
                      >
                        View
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Order Detail Modal */}
      <AnimatePresence>
        {selectedOrder && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedOrder(null)}
              className="fixed inset-0 bg-black/50 z-50"
            />
            <motion.div
              initial={{ opacity: 0, x: 300 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 300 }}
              className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-white z-50 shadow-lg overflow-y-auto"
            >
              <div className="sticky top-0 bg-white p-6 border-b border-gray-100 flex items-center justify-between">
                <h2 className="text-xl font-serif text-walnut-800">
                  Order #{selectedOrder.id.slice(0, 8).toUpperCase()}
                </h2>
                <button onClick={() => setSelectedOrder(null)} className="p-2 hover:bg-gray-100 rounded-lg">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 space-y-6">
                {/* Status */}
                <div>
                  <label className="label">Status</label>
                  <select
                    value={selectedOrder.status}
                    onChange={(e) => updateOrderStatus(selectedOrder.id, e.target.value)}
                    className="input-field"
                  >
                    <option value="pending">Pending</option>
                    <option value="paid">Paid</option>
                    <option value="fulfilled">Fulfilled</option>
                    <option value="failed">Failed</option>
                  </select>
                </div>

                {/* Customer Info */}
                <div className="bg-gray-50 rounded-xl p-4">
                  <h3 className="font-medium text-walnut-800 mb-3">Customer</h3>
                  <div className="space-y-2 text-sm">
                    <p><span className="text-walnut-500">Name:</span> {selectedOrder.customer_name || 'N/A'}</p>
                    <p className="flex items-center gap-2">
                      <span className="text-walnut-500">Email:</span> 
                      <a href={`mailto:${selectedOrder.customer_email}`} className="text-dusty-rose-600 hover:underline flex items-center gap-1">
                        {selectedOrder.customer_email}
                        <Mail className="w-3 h-3" />
                      </a>
                    </p>
                  </div>
                </div>

                {/* Order Items */}
                <div>
                  <h3 className="font-medium text-walnut-800 mb-3">Items</h3>
                  <div className="space-y-3">
                    {(typeof selectedOrder.items === 'string' 
                      ? JSON.parse(selectedOrder.items) 
                      : selectedOrder.items
                    ).map((item, index) => (
                      <div key={index} className="flex items-center gap-3 bg-gray-50 rounded-xl p-3">
                        <div className="w-12 h-12 rounded-lg overflow-hidden bg-dusty-rose-100 flex-shrink-0">
                          {item.image_url && (
                            <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
                          )}
                        </div>
                        <div className="flex-grow">
                          <p className="font-medium text-walnut-800">{item.name}</p>
                          <p className="text-sm text-walnut-500">Qty: {item.quantity}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-walnut-800">
                            {formatPrice(item.price * item.quantity)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Total */}
                <div className="border-t border-gray-200 pt-4">
                  <div className="flex justify-between text-lg">
                    <span className="text-walnut-600">Total</span>
                    <span className="font-serif text-walnut-800">
                      {formatPrice(selectedOrder.total_amount)}
                    </span>
                  </div>
                </div>

                {/* Order Meta */}
                <div className="bg-gray-50 rounded-xl p-4 text-sm space-y-2">
                  <p><span className="text-walnut-500">Order ID:</span> {selectedOrder.id}</p>
                  <p><span className="text-walnut-500">Created:</span> {formatDate(selectedOrder.created_at)}</p>
                  {selectedOrder.stripe_payment_id && (
                    <p><span className="text-walnut-500">Stripe ID:</span> {selectedOrder.stripe_payment_id}</p>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}


