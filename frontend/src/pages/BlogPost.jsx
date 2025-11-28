import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, Calendar } from 'lucide-react'
import { api } from '../utils/api'
import SEO, { generateArticleSchema } from '../components/SEO'

export default function BlogPost() {
  const { id } = useParams()
  const [post, setPost] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const data = await api.get(`/blog/${id}`)
        setPost(data)
      } catch (error) {
        console.error('Failed to fetch blog post:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchPost()
  }, [id])

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  // Convert YouTube URL to embed URL
  const getEmbedUrl = (url) => {
    if (!url) return null
    
    // Already an embed URL
    if (url.includes('/embed/')) return url
    
    // Regular YouTube URL
    const match = url.match(/(?:youtu\.be\/|youtube\.com(?:\/embed\/|\/v\/|\/watch\?v=|\/watch\?.+&v=))([^"&?\/\s]{11})/)
    if (match) {
      return `https://www.youtube.com/embed/${match[1]}`
    }
    
    return url
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-cream-50 flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-dusty-rose-400 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-cream-50 flex flex-col items-center justify-center">
        <h2 className="font-serif text-2xl text-walnut-800 mb-4">Post not found</h2>
        <Link to="/blog" className="btn-primary">
          Back to Blog
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-cream-50 py-8">
      <SEO 
        title={post.title}
        description={post.excerpt || `Read "${post.title}" on the MLJJ Cooking journal.`}
        image={post.image_url}
        url={`/blog/${id}`}
        type="article"
        structuredData={generateArticleSchema(post)}
      />
      <article className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-8"
        >
          <Link 
            to="/blog" 
            className="inline-flex items-center gap-2 text-walnut-600 hover:text-walnut-800 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Blog
          </Link>
        </motion.div>

        {/* Post Header */}
        <motion.header
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-2 text-walnut-500 mb-4">
            <Calendar className="w-5 h-5" />
            {formatDate(post.created_at)}
          </div>
          
          <h1 className="font-serif text-4xl md:text-5xl text-walnut-800 leading-tight">
            {post.title}
          </h1>
        </motion.header>

        {/* Featured Image */}
        {post.image_url && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="rounded-3xl overflow-hidden mb-8 shadow-warm-lg"
          >
            <img
              src={post.image_url}
              alt={post.title}
              className="w-full h-[400px] object-cover"
            />
          </motion.div>
        )}

        {/* Video Embed */}
        {post.video_url && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-8"
          >
            <div className="relative pt-[56.25%] rounded-3xl overflow-hidden shadow-warm-lg bg-walnut-800">
              <iframe
                src={getEmbedUrl(post.video_url)}
                title={post.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="absolute inset-0 w-full h-full"
              />
            </div>
          </motion.div>
        )}

        {/* Post Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="prose prose-lg prose-walnut max-w-none"
        >
          <div 
            className="text-walnut-700 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </motion.div>

        {/* Footer CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-12 p-8 bg-dusty-rose-100 rounded-3xl text-center"
        >
          <h3 className="font-serif text-2xl text-walnut-800 mb-4">
            Ready to taste our creations?
          </h3>
          <p className="text-walnut-600 mb-6">
            Browse our selection of artisan breads and pastries.
          </p>
          <Link to="/shop" className="btn-primary">
            Shop Now
          </Link>
        </motion.div>
      </article>
    </div>
  )
}


