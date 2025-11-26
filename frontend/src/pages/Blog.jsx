import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Calendar, ArrowRight } from 'lucide-react'
import { api } from '../utils/api'

export default function Blog() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const data = await api.get('/blog')
        setPosts(data)
      } catch (error) {
        console.error('Failed to fetch blog posts:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchPosts()
  }, [])

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <div className="min-h-screen bg-cream-50">
      {/* Header */}
      <section className="relative py-16 bg-gradient-to-b from-dusty-rose-100 to-cream-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="max-w-2xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="section-title">From Our Kitchen</h1>
            <p className="section-subtitle">
              Stories, recipes, and baking tips from the heart of ML Baking.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Blog Posts */}
      <section className="py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="grid md:grid-cols-2 gap-8">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-white rounded-2xl h-80 animate-pulse" />
              ))}
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-24 h-24 bg-dusty-rose-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-4xl">📝</span>
              </div>
              <h3 className="font-serif text-2xl text-walnut-800 mb-2">No posts yet</h3>
              <p className="text-walnut-600">
                Check back soon for recipes and baking stories!
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-8">
              {posts.map((post, index) => (
                <motion.article
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="card group"
                >
                  <Link to={`/blog/${post.id}`}>
                    {/* Image or Video Thumbnail */}
                    <div className="relative h-48 bg-dusty-rose-100 overflow-hidden">
                      {post.image_url ? (
                        <img
                          src={post.image_url}
                          alt={post.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                      ) : post.video_url ? (
                        <div className="w-full h-full flex items-center justify-center bg-walnut-800">
                          <span className="text-6xl">🎬</span>
                        </div>
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <span className="text-6xl">🥐</span>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-walnut-800/0 group-hover:bg-walnut-800/20 transition-colors" />
                    </div>

                    {/* Content */}
                    <div className="p-6">
                      <div className="flex items-center gap-2 text-walnut-500 text-sm mb-3">
                        <Calendar className="w-4 h-4" />
                        {formatDate(post.created_at)}
                      </div>
                      
                      <h2 className="font-serif text-2xl text-walnut-800 mb-3 group-hover:text-dusty-rose-600 transition-colors">
                        {post.title}
                      </h2>
                      
                      {post.content && (
                        <p 
                          className="text-walnut-600 line-clamp-3 mb-4"
                          dangerouslySetInnerHTML={{ 
                            __html: post.content.replace(/<[^>]+>/g, '').slice(0, 150) + '...'
                          }}
                        />
                      )}

                      <span className="inline-flex items-center gap-2 text-dusty-rose-600 font-medium group-hover:gap-3 transition-all">
                        Read More
                        <ArrowRight className="w-4 h-4" />
                      </span>
                    </div>
                  </Link>
                </motion.article>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}


