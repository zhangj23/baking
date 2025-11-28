import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Clock, MapPin, Star } from "lucide-react";
import { useState, useEffect } from "react";
import { api } from "../utils/api";
import ProductCard from "../components/ProductCard";
import SEO from "../components/SEO";

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [content, setContent] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [products, pageContent] = await Promise.all([
          api.get("/products"),
          api.get("/content/page/home"),
        ]);
        setFeaturedProducts(products.slice(0, 3));
        setContent(pageContent);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const getContent = (key, fallback = "") => content[key]?.value || fallback;

  return (
    <div className="overflow-hidden">
      <SEO 
        title="Home"
        description="MLJJ Cooking - Artisan Asian-inspired cuisine made with tradition and love. Pre-order our signature homemade dishes, baked goods, and desserts for pickup."
        url="/"
      />
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center bg-theme-background">
        {/* Pattern Overlay */}
        <div className="absolute inset-0 bg-theme-pattern opacity-50" />

        {/* Decorative Elements */}
        <div className="absolute top-10 left-10 w-32 h-32 border border-theme-secondary\/30 rotate-45 hidden lg:block" />
        <div className="absolute bottom-10 right-10 w-24 h-24 border border-theme-primary\/30 rotate-12 hidden lg:block" />

        {/* Cloud decoration - CSS animation for better performance */}
        <div className="absolute top-20 right-20 text-6xl opacity-10 hidden lg:block animate-float">
          ☁️
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Text Content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-theme-primary\/10 border border-theme-primary\/30 mb-6">
                <span className="text-theme-primary font-medium tracking-wide">
                  Fresh Daily
                </span>
                <span className="text-ink-600">
                  • {getContent("home_hero_badge", "Now accepting pre-orders")}
                </span>
              </div>

              <h1 className="font-serif text-5xl md:text-7xl text-ink-800 leading-tight mb-6">
                {getContent("home_hero_title", "Baked with")}
                <span className="block text-gradient">
                  {getContent("home_hero_title_highlight", "Tradition & Love")}
                </span>
              </h1>

              <p className="text-xl text-ink-600 mb-8 max-w-lg leading-relaxed">
                {getContent(
                  "home_hero_description",
                  "Discover our artisan Asian-inspired dishes, crafted with time-honored techniques and the finest ingredients. Pre-order for Saturday pickup."
                )}
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/shop"
                  className="btn-primary inline-flex items-center gap-2"
                >
                  Order Now
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link to="/about" className="btn-outline">
                  Our Story
                </Link>
              </div>
            </motion.div>

            {/* Hero Image */}
            <motion.div
              className="relative"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
            >
              {/* Decorative frame */}
              <div className="absolute -inset-4 border border-theme-secondary\/50 hidden md:block" />
              <div className="absolute -inset-8 border border-theme-primary\/30 hidden md:block" />

              <div className="relative z-10 overflow-hidden shadow-lg">
                <img
                  src={getContent(
                    "home_hero_image",
                    "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&h=600&fit=crop"
                  )}
                  alt="Featured dish"
                  className="w-full h-[500px] object-cover"
                  fetchpriority="high"
                  loading="eager"
                  decoding="sync"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink-800/50 to-transparent" />

                {/* Decorative overlay */}
                <div className="absolute bottom-6 right-6 text-6xl text-rice-50/20 font-serif">
                  M
                </div>
              </div>

              {/* Floating Card */}
              <motion.div
                className="absolute -bottom-6 -left-6 bg-white p-4 shadow-lg z-20 hidden sm:block border-l-4 border-theme-primary"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-theme-secondary-light flex items-center justify-center">
                    <Star className="w-6 h-6 text-theme-primary fill-theme-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-ink-500 tracking-wide">
                      Signature Item
                    </p>
                    <p className="font-serif text-lg text-ink-800">
                      Matcha Square Toast
                    </p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white relative">
        {/* Decorative top border */}
        <div className="absolute top-0 left-0 right-0 h-px gradient-theme-border" />

        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="grid md:grid-cols-3 gap-8"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            {[
              {
                icon: <Clock className="w-8 h-8" />,
                title: "Fresh Every Week",
                description:
                  "Made fresh for Saturday pickup. Pre-order by Wednesday midnight.",
              },
              {
                icon: <Star className="w-8 h-8" />,
                title: "Premium Ingredients",
                description:
                  "Premium ingredients sourced from around the world for authentic flavors.",
              },
              {
                icon: <MapPin className="w-8 h-8" />,
                title: "Easy Pickup",
                description:
                  "Convenient Saturday pickup at our kitchen. No shipping, just freshness.",
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                className="text-center p-8 bg-rice-50 border border-rice-200 hover:border-theme-secondary hover:shadow-lg transition-all duration-300"
                whileHover={{ y: -5 }}
              >
                <div className="relative inline-block mb-4">
                  <div className="w-16 h-16 bg-theme-primary flex items-center justify-center text-white">
                    {feature.icon}
                  </div>
                </div>
                <h3 className="font-serif text-xl text-ink-800 mb-2">
                  {feature.title}
                </h3>
                <p className="text-ink-600">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 bg-rice-50 relative">
        <div className="absolute inset-0 bg-theme-pattern opacity-30" />

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="text-theme-secondary-dark font-serif text-lg tracking-wider">
              Featured
            </span>
            <h2 className="section-title mt-2">Our Specialties</h2>
            <p className="section-subtitle mx-auto">
              Handcrafted with care, each item tells a story of tradition and
              flavor.
            </p>
          </motion.div>

          {loading ? (
            <div className="grid md:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white h-96 animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid md:grid-cols-3 gap-8 animate-stagger">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}

          <motion.div
            className="text-center mt-12"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <Link
              to="/shop"
              className="btn-secondary inline-flex items-center gap-2"
            >
              View All Products
              <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-ink-800 text-rice-50 relative overflow-hidden">
        {/* Pattern background */}
        <div className="absolute inset-0 bg-theme-pattern opacity-5" />

        {/* Decorative elements */}
        <div className="absolute top-10 left-10 text-8xl text-theme-secondary\/10 font-serif hidden lg:block">
          ✦
        </div>
        <div className="absolute bottom-10 right-10 text-8xl text-theme-primary\/10 font-serif hidden lg:block">
          ✦
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            className="max-w-3xl mx-auto text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="text-theme-secondary font-serif tracking-widest">
              Taste the Tradition
            </span>
            <h2 className="font-serif text-4xl md:text-5xl mb-6 mt-2">
              {getContent("home_cta_title", "Ready to taste the tradition?")}
            </h2>
            <p className="text-xl text-rice-300 mb-8 leading-relaxed">
              {getContent(
                "home_cta_description",
                "Join our community of food lovers. Place your pre-order today and pick up fresh-baked goodness this Saturday."
              )}
            </p>
            <Link to="/shop" className="btn-secondary">
              Start Your Order
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
