import { createContext, useContext, useState, useEffect } from 'react'
import { api } from '../utils/api'

const ThemeContext = createContext()

// Predefined color schemes
export const colorSchemes = {
  default: {
    name: 'Oriental Red',
    primary: '#C41E3A',      // Vermillion
    secondary: '#D4AF37',    // Gold
    accent: '#2D2D2D',       // Ink
    background: '#FFFEF7',   // Rice
  },
  ocean: {
    name: 'Ocean Blue',
    primary: '#0077B6',
    secondary: '#00B4D8',
    accent: '#1B4965',
    background: '#F8FAFC',
  },
  forest: {
    name: 'Forest Green',
    primary: '#2D6A4F',
    secondary: '#95D5B2',
    accent: '#1B4332',
    background: '#F0FDF4',
  },
  sunset: {
    name: 'Sunset Orange',
    primary: '#E85D04',
    secondary: '#FFBA08',
    accent: '#370617',
    background: '#FFFBEB',
  },
  lavender: {
    name: 'Lavender',
    primary: '#7C3AED',
    secondary: '#A78BFA',
    accent: '#4C1D95',
    background: '#FAF5FF',
  },
  rose: {
    name: 'Rose Pink',
    primary: '#DB2777',
    secondary: '#F9A8D4',
    accent: '#831843',
    background: '#FDF2F8',
  },
  slate: {
    name: 'Modern Slate',
    primary: '#475569',
    secondary: '#94A3B8',
    accent: '#1E293B',
    background: '#F8FAFC',
  },
  custom: {
    name: 'Custom',
    primary: '#C41E3A',
    secondary: '#D4AF37',
    accent: '#2D2D2D',
    background: '#FFFEF7',
  },
}

export function ThemeProvider({ children }) {
  const [colorScheme, setColorScheme] = useState('default')
  const [customColors, setCustomColors] = useState(colorSchemes.custom)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchTheme()
  }, [])

  useEffect(() => {
    applyTheme()
  }, [colorScheme, customColors])

  const fetchTheme = async () => {
    try {
      const config = await api.get('/config')
      if (config.COLOR_SCHEME) {
        setColorScheme(config.COLOR_SCHEME)
      }
      if (config.CUSTOM_COLORS) {
        setCustomColors(prev => ({ ...prev, ...config.CUSTOM_COLORS }))
      }
    } catch (error) {
      console.error('Failed to fetch theme:', error)
    } finally {
      setLoading(false)
    }
  }

  const applyTheme = () => {
    const colors = colorScheme === 'custom' ? customColors : colorSchemes[colorScheme] || colorSchemes.default
    
    // Apply CSS variables to root
    const root = document.documentElement
    root.style.setProperty('--color-primary', colors.primary)
    root.style.setProperty('--color-secondary', colors.secondary)
    root.style.setProperty('--color-accent', colors.accent)
    root.style.setProperty('--color-background', colors.background)
    
    // Generate lighter/darker variants
    root.style.setProperty('--color-primary-light', adjustColor(colors.primary, 40))
    root.style.setProperty('--color-primary-dark', adjustColor(colors.primary, -20))
    root.style.setProperty('--color-secondary-light', adjustColor(colors.secondary, 40))
    root.style.setProperty('--color-secondary-dark', adjustColor(colors.secondary, -20))
  }

  const updateTheme = async (scheme, custom = null) => {
    setColorScheme(scheme)
    if (custom) {
      setCustomColors(prev => ({ ...prev, ...custom }))
    }
  }

  return (
    <ThemeContext.Provider value={{ 
      colorScheme, 
      customColors, 
      updateTheme, 
      colorSchemes,
      loading 
    }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}

// Helper function to lighten/darken colors
function adjustColor(color, percent) {
  const num = parseInt(color.replace('#', ''), 16)
  const amt = Math.round(2.55 * percent)
  const R = (num >> 16) + amt
  const G = (num >> 8 & 0x00FF) + amt
  const B = (num & 0x0000FF) + amt
  return '#' + (
    0x1000000 +
    (R < 255 ? (R < 1 ? 0 : R) : 255) * 0x10000 +
    (G < 255 ? (G < 1 ? 0 : G) : 255) * 0x100 +
    (B < 255 ? (B < 1 ? 0 : B) : 255)
  ).toString(16).slice(1)
}

