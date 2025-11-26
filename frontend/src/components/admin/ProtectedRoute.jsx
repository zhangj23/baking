import { useState, useEffect } from 'react'
import { Navigate } from 'react-router-dom'
import { api } from '../../utils/api'

export default function ProtectedRoute({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const verifyAuth = async () => {
      const token = localStorage.getItem('ml-baking-admin-token')
      
      if (!token) {
        setIsAuthenticated(false)
        setLoading(false)
        return
      }

      try {
        await api.get('/auth/verify')
        setIsAuthenticated(true)
      } catch (error) {
        localStorage.removeItem('ml-baking-admin-token')
        setIsAuthenticated(false)
      } finally {
        setLoading(false)
      }
    }

    verifyAuth()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-dusty-rose-400 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />
  }

  return children
}


