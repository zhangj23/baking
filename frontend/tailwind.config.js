/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  // Safelist dynamic theme classes that might be purged
  safelist: [
    'bg-theme-primary',
    'bg-theme-secondary',
    'text-theme-primary',
    'text-theme-secondary',
    'border-theme-primary',
    'border-theme-secondary',
  ],
  theme: {
    extend: {
      colors: {
        // Oriental-Inspired Color Palette
        'vermillion': {
          50: '#fef7f5',
          100: '#fdeae5',
          200: '#fcd4cc',
          300: '#f9b3a5',
          400: '#f28571',
          500: '#e85a45',
          600: '#C41E3A', // Primary Chinese Red
          700: '#a31830',
          800: '#87162a',
          900: '#731728',
        },
        'gold': {
          50: '#fffbeb',
          100: '#fff3c4',
          200: '#ffe485',
          300: '#ffd54f',
          400: '#D4AF37', // Primary Gold
          500: '#c9a227',
          600: '#a67c00',
          700: '#8a6914',
          800: '#735818',
          900: '#61491a',
        },
        'jade': {
          50: '#f0fdf9',
          100: '#ccfbec',
          200: '#9af5da',
          300: '#5fe8c4',
          400: '#2dd4aa',
          500: '#00A86B', // Jade Green
          600: '#089a6a',
          700: '#0c7b56',
          800: '#0e6246',
          900: '#0f503b',
        },
        'ink': {
          50: '#f6f6f6',
          100: '#e7e7e7',
          200: '#d1d1d1',
          300: '#b0b0b0',
          400: '#888888',
          500: '#6d6d6d',
          600: '#5d5d5d',
          700: '#4f4f4f',
          800: '#2D2D2D', // Deep Ink
          900: '#1a1a1a',
        },
        'rice': {
          50: '#FFFEF7', // Rice Paper White
          100: '#FDFBF3',
          200: '#FAF6E9',
          300: '#F5EEDD',
          400: '#EDE3CC',
          500: '#DDD3B8',
          600: '#C4B896',
          700: '#A69A77',
          800: '#8A7F5F',
          900: '#716751',
        },
        'rosewood': {
          50: '#f9f5f3',
          100: '#f1e8e3',
          200: '#e5d4cb',
          300: '#d3b7a8',
          400: '#bc9280',
          500: '#a87562',
          600: '#8B4513', // Rosewood
          700: '#7a3d16',
          800: '#653518',
          900: '#552f18',
        },
      },
      fontFamily: {
        // System fonts load instantly - no network requests
        'serif': ['Playfair Display', 'Georgia', 'Cambria', 'Times New Roman', 'serif'],
        'sans': ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
        'display': ['Playfair Display', 'Georgia', 'serif'],
      },
      backgroundImage: {
        'oriental-pattern': `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23D4AF37' fill-opacity='0.08'%3E%3Cpath d='M30 30c0-5.5-4.5-10-10-10s-10 4.5-10 10 4.5 10 10 10 10-4.5 10-10zm10 0c0 5.5 4.5 10 10 10s10-4.5 10-10-4.5-10-10-10-10 4.5-10 10z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        'cloud-pattern': `url("data:image/svg+xml,%3Csvg width='100' height='50' viewBox='0 0 100 50' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M25 25c0-8 6-14 14-14s14 6 14 14c0 1-.1 2-.3 3 5.5 1 9.8 5.7 9.8 11.5 0 6.4-5.1 11.5-11.5 11.5h-35c-6.4 0-11.5-5.1-11.5-11.5 0-5.8 4.3-10.5 9.8-11.5-.2-1-.3-2-.3-3z' fill='%23C41E3A' fill-opacity='0.03'/%3E%3C/svg%3E")`,
        'gradient-oriental': 'linear-gradient(135deg, #FFFEF7 0%, #FAF6E9 50%, #FFF3C4 100%)',
        'gradient-vermillion': 'linear-gradient(135deg, #C41E3A 0%, #e85a45 100%)',
        'gradient-gold': 'linear-gradient(135deg, #D4AF37 0%, #ffe485 100%)',
      },
      boxShadow: {
        'oriental': '0 4px 20px rgba(196, 30, 58, 0.1)',
        'oriental-lg': '0 10px 40px rgba(196, 30, 58, 0.15)',
        'gold': '0 4px 20px rgba(212, 175, 55, 0.2)',
        'ink': '0 4px 20px rgba(45, 45, 45, 0.15)',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'fade-in': 'fadeIn 0.5s ease-out forwards',
        'shimmer': 'shimmer 2s infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        fadeIn: {
          from: { opacity: '0', transform: 'translateY(20px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      borderRadius: {
        'oriental': '0.25rem',
      },
    },
  },
  plugins: [],
}
