import { useState, useRef, useEffect } from 'react'

export default function OptimizedImage({
  src,
  alt,
  className = '',
  containerClassName = '',
  fallback = 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400',
  eager = false,
}) {
  const [isLoaded, setIsLoaded] = useState(false)
  const [hasError, setHasError] = useState(false)
  const imgRef = useRef(null)

  useEffect(() => {
    // Check if image is already in cache
    if (imgRef.current?.complete) {
      setIsLoaded(true)
    }
  }, [])

  const handleLoad = () => {
    setIsLoaded(true)
  }

  const handleError = () => {
    setHasError(true)
    setIsLoaded(true)
  }

  const imageSrc = hasError ? fallback : (src || fallback)

  return (
    <div className={`relative overflow-hidden ${containerClassName}`}>
      {/* Placeholder/skeleton */}
      {!isLoaded && (
        <div className="absolute inset-0 bg-rice-200 animate-pulse" />
      )}
      <img
        ref={imgRef}
        src={imageSrc}
        alt={alt}
        loading={eager ? 'eager' : 'lazy'}
        decoding="async"
        onLoad={handleLoad}
        onError={handleError}
        className={`transition-opacity duration-300 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        } ${className}`}
      />
    </div>
  )
}

