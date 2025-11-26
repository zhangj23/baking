import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Upload, X, Image, Loader2 } from 'lucide-react'
import { api } from '../../utils/api'

export default function ImageUpload({ value, onChange, className = '' }) {
  const [isDragging, setIsDragging] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [error, setError] = useState(null)
  const fileInputRef = useRef(null)

  const handleDragOver = (e) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragging(false)
    
    const files = e.dataTransfer.files
    if (files.length > 0) {
      handleFile(files[0])
    }
  }

  const handleFileSelect = (e) => {
    const files = e.target.files
    if (files.length > 0) {
      handleFile(files[0])
    }
  }

  const handleFile = async (file) => {
    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
    if (!allowedTypes.includes(file.type)) {
      setError('Please upload a valid image (JPEG, PNG, WebP, or GIF)')
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Image must be less than 5MB')
      return
    }

    setError(null)
    setIsUploading(true)
    setUploadProgress(0)

    try {
      // Step 1: Get presigned URL from backend
      const { presignedUrl, publicUrl } = await api.post('/upload/presigned-url', {
        fileType: file.type,
        fileName: file.name
      })

      // Step 2: Upload directly to S3
      setUploadProgress(30)
      
      const uploadResponse = await fetch(presignedUrl, {
        method: 'PUT',
        body: file,
        headers: {
          'Content-Type': file.type
        }
      })

      if (!uploadResponse.ok) {
        throw new Error('Failed to upload to S3')
      }

      setUploadProgress(100)
      
      // Step 3: Return the public URL
      onChange(publicUrl)
      
    } catch (err) {
      console.error('Upload error:', err)
      setError(err.message || 'Failed to upload image. Check your AWS configuration.')
    } finally {
      setIsUploading(false)
      setUploadProgress(0)
    }
  }

  const handleRemove = () => {
    onChange('')
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <div className={className}>
      <AnimatePresence mode="wait">
        {value ? (
          // Image Preview
          <motion.div
            key="preview"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="relative"
          >
            <div className="relative rounded-lg overflow-hidden border border-rice-200 bg-rice-50">
              <img
                src={value}
                alt="Product preview"
                className="w-full h-48 object-cover"
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/400x300?text=Image+Error'
                }}
              />
              <button
                type="button"
                onClick={handleRemove}
                className="absolute top-2 right-2 p-1.5 bg-ink-800/80 hover:bg-vermillion-600 text-white rounded-full transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="mt-2 text-xs text-ink-500 truncate">{value}</p>
          </motion.div>
        ) : (
          // Upload Area
          <motion.div
            key="upload"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
          >
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`
                relative border-2 border-dashed rounded-lg p-8 text-center cursor-pointer
                transition-colors duration-200
                ${isDragging 
                  ? 'border-vermillion-500 bg-vermillion-50' 
                  : 'border-rice-300 hover:border-gold-400 hover:bg-rice-50'
                }
                ${isUploading ? 'pointer-events-none' : ''}
              `}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                onChange={handleFileSelect}
                className="hidden"
              />

              {isUploading ? (
                <div className="space-y-3">
                  <Loader2 className="w-10 h-10 text-vermillion-500 mx-auto animate-spin" />
                  <p className="text-ink-600">Uploading...</p>
                  <div className="w-full bg-rice-200 rounded-full h-2 max-w-xs mx-auto">
                    <div 
                      className="bg-vermillion-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                </div>
              ) : (
                <>
                  <div className="w-14 h-14 bg-rice-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                    {isDragging ? (
                      <Upload className="w-7 h-7 text-vermillion-500" />
                    ) : (
                      <Image className="w-7 h-7 text-ink-400" />
                    )}
                  </div>
                  <p className="text-ink-700 font-medium mb-1">
                    {isDragging ? 'Drop image here' : 'Click to upload or drag and drop'}
                  </p>
                  <p className="text-sm text-ink-500">
                    JPEG, PNG, WebP or GIF (max 5MB)
                  </p>
                </>
              )}
            </div>

            {/* Error Message */}
            {error && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-2 text-sm text-vermillion-600"
              >
                {error}
              </motion.p>
            )}

            {/* Or use URL */}
            <div className="mt-4">
              <div className="relative flex items-center">
                <div className="flex-grow border-t border-rice-200"></div>
                <span className="px-3 text-xs text-ink-400 uppercase">or paste URL</span>
                <div className="flex-grow border-t border-rice-200"></div>
              </div>
              <input
                type="url"
                placeholder="https://example.com/image.jpg"
                onChange={(e) => onChange(e.target.value)}
                className="input-field mt-3 text-sm"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

