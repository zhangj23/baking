import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Package, ShoppingCart, DollarSign, TrendingUp, Eye, Clock } from 'lucide-react'
import { api, formatPrice } from '../../utils/api'

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    recentOrders: []
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [products, orders] = await Promise.all([
          api.get('/products/admin'),
          api.get('/orders')
        ])

        const totalRevenue = orders
          .filter(o => o.status === 'paid')
          .reduce((sum, o) => sum + o.total_amount, 0)

        setStats({
          totalProducts: products.length,
          totalOrders: orders.length,
          totalRevenue,
          recentOrders: orders.slice(0, 5)
        })
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const statCards = [
    {
      label: 'Total Products',
      value: stats.totalProducts,
      icon: <Package className="w-6 h-6" />,
      color: 'bg-blue-500',
      link: '/admin/products'
    },
    {
      label: 'Total Orders',
      value: stats.totalOrders,
      icon: <ShoppingCart className="w-6 h-6" />,
      color: 'bg-green-500',
      link: '/admin/orders'
    },
    {
      label: 'Total Revenue',
      value: formatPrice(stats.totalRevenue),
      icon: <DollarSign className="w-6 h-6" />,
      color: 'bg-purple-500',
      link: '/admin/orders'
    },
    {
      label: 'Conversion',
      value: 'Coming Soon',
      icon: <TrendingUp className="w-6 h-6" />,
      color: 'bg-orange-500'
    }
  ]

  const getStatusColor = (status) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-700'
      case 'pending': return 'bg-yellow-100 text-yellow-700'
      case 'failed': return 'bg-red-100 text-red-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
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
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-serif text-walnut-800">Dashboard</h1>
        <p className="text-walnut-600">Welcome back! Here's what's happening with your bakery.</p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            {stat.link ? (
              <Link to={stat.link} className="block">
                <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
                  <div className={`w-12 h-12 ${stat.color} rounded-xl flex items-center justify-center text-white mb-4`}>
                    {stat.icon}
                  </div>
                  <p className="text-walnut-600 text-sm">{stat.label}</p>
                  <p className="text-2xl font-serif text-walnut-800">{stat.value}</p>
                </div>
              </Link>
            ) : (
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <div className={`w-12 h-12 ${stat.color} rounded-xl flex items-center justify-center text-white mb-4`}>
                  {stat.icon}
                </div>
                <p className="text-walnut-600 text-sm">{stat.label}</p>
                <p className="text-2xl font-serif text-walnut-800">{stat.value}</p>
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Recent Orders */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-2xl shadow-sm overflow-hidden"
      >
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-xl font-serif text-walnut-800">Recent Orders</h2>
          <Link to="/admin/orders" className="text-dusty-rose-600 hover:underline text-sm flex items-center gap-1">
            View All <Eye className="w-4 h-4" />
          </Link>
        </div>

        {stats.recentOrders.length === 0 ? (
          <div className="p-12 text-center">
            <Clock className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-walnut-600">No orders yet</p>
            <p className="text-sm text-walnut-400">Orders will appear here once customers start ordering.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {stats.recentOrders.map((order) => (
              <Link
                key={order.id}
                to={`/admin/orders`}
                className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-dusty-rose-100 rounded-full flex items-center justify-center">
                    <ShoppingCart className="w-5 h-5 text-dusty-rose-600" />
                  </div>
                  <div>
                    <p className="font-medium text-walnut-800">
                      #{order.id.slice(0, 8).toUpperCase()}
                    </p>
                    <p className="text-sm text-walnut-500">{order.customer_email}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium text-walnut-800">{formatPrice(order.total_amount)}</p>
                  <span className={`inline-block px-2 py-1 rounded-full text-xs ${getStatusColor(order.status)}`}>
                    {order.status}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mt-8 grid sm:grid-cols-3 gap-4"
      >
        <Link
          to="/admin/products"
          className="bg-dusty-rose-100 hover:bg-dusty-rose-200 rounded-2xl p-6 text-center transition-colors"
        >
          <Package className="w-8 h-8 text-dusty-rose-600 mx-auto mb-2" />
          <p className="font-medium text-walnut-800">Add New Product</p>
        </Link>
        <Link
          to="/admin/blog"
          className="bg-walnut-100 hover:bg-walnut-200 rounded-2xl p-6 text-center transition-colors"
        >
          <span className="text-3xl block mb-2">✍️</span>
          <p className="font-medium text-walnut-800">Write Blog Post</p>
        </Link>
        <Link
          to="/admin/settings"
          className="bg-blue-100 hover:bg-blue-200 rounded-2xl p-6 text-center transition-colors"
        >
          <span className="text-3xl block mb-2">⚙️</span>
          <p className="font-medium text-walnut-800">Site Settings</p>
        </Link>
      </motion.div>
    </div>
  )
}


