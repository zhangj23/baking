import { createContext, useContext, useState, useEffect } from 'react'
import { api } from '../utils/api'

const ConfigContext = createContext()

export function ConfigProvider({ children }) {
  const [config, setConfig] = useState({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const data = await api.get('/config')
        setConfig(data)
      } catch (error) {
        console.error('Failed to fetch config:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchConfig()
  }, [])

  const refreshConfig = async () => {
    try {
      const data = await api.get('/config')
      setConfig(data)
    } catch (error) {
      console.error('Failed to refresh config:', error)
    }
  }

  return (
    <ConfigContext.Provider value={{ config, loading, refreshConfig }}>
      {children}
    </ConfigContext.Provider>
  )
}

export function useConfig() {
  const context = useContext(ConfigContext)
  if (!context) {
    throw new Error('useConfig must be used within a ConfigProvider')
  }
  return context
}


