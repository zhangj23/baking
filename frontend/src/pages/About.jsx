import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Heart, Leaf, Clock, Award } from "lucide-react";
import { api } from "../utils/api";

export default function About() {
  const [content, setContent] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const pageContent = await api.get("/content/page/about");
        setContent(pageContent);
      } catch (error) {
        console.error("Failed to fetch content:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchContent();
  }, []);

  const getContent = (key, fallback = "") => content[key]?.value || fallback;

  const values = [
    {
      icon: <Heart className="w-8 h-8" />,
      title: "Made with Heart",
      chinese: "用心",
      description:
        "Every item is crafted by hand with attention to detail and passion for baking.",
    },
    {
      icon: <Leaf className="w-8 h-8" />,
      title: "Quality Ingredients",
      chinese: "精选",
      description:
        "We source premium ingredients including imported Japanese matcha and organic flour.",
    },
    {
      icon: <Clock className="w-8 h-8" />,
      title: "Slow Fermentation",
      chinese: "慢发",
      description:
        "Our sourdoughs ferment for 24-48 hours for complex flavors and better digestibility.",
    },
    {
      icon: <Award className="w-8 h-8" />,
      title: "Traditional Methods",
      chinese: "传统",
      description:
        "Classic techniques passed down through generations, adapted for modern tastes.",
    },
  ];

  return (
    <div className="min-h-screen bg-rice-50">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-oriental overflow-hidden">
        <div className="absolute inset-0 bg-oriental-pattern opacity-30" />

        {/* Decorative elements */}
        <div className="absolute top-10 right-10 text-8xl text-gold-400/10 font-serif hidden lg:block">
          梦
        </div>
        <div className="absolute bottom-10 left-10 text-6xl text-vermillion-500/10 font-serif hidden lg:block">
          味
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <span className="text-gold-500 font-serif tracking-wider">
                我们的故事
              </span>
              <h1 className="section-title mt-2">
                {getContent("about_title", "About MLJJ Cooking")}
              </h1>
              <p className="text-xl text-ink-600 leading-relaxed">
                {getContent(
                  "about_subtitle",
                  "Where Eastern tradition meets Western craftsmanship. A kitchen born from passion, heritage, and the timeless art of cooking."
                )}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="relative"
            >
              {/* Decorative frame */}
              <div className="absolute -inset-4 border border-gold-400/50 hidden md:block" />

              <div className="overflow-hidden shadow-oriental-lg">
                <img
                  src={getContent(
                    "about_hero_image",
                    "https://images.unsplash.com/photo-1556217477-d325251ece38?w=600&h=500&fit=crop"
                  )}
                  alt="Our kitchen"
                  className="w-full h-[400px] object-cover"
                />
              </div>
            </motion.div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold-400 to-transparent" />
      </section>

      {/* Story Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <div className="text-center mb-12">
                <span className="text-gold-500 font-serif tracking-wider">
                  源起
                </span>
                <h2 className="font-serif text-3xl text-ink-800 mt-2">
                  Our Story
                </h2>
              </div>

              <div className="space-y-6 text-ink-600 leading-relaxed text-lg">
                <p>
                  {getContent(
                    "about_story_p1",
                    "MLJJ Cooking began in 2020, born from countless hours spent in my grandmother's kitchen in Taiwan, watching her transform simple ingredients into extraordinary dishes. Those memories – the warmth of the kitchen, the aromas of home cooking, the joy of sharing food with family – inspired me to start this journey."
                  )}
                </p>

                <p>
                  {getContent(
                    "about_story_p2",
                    "We started with traditional family recipes, carefully preserved and now shared with our community. Each dish carries a piece of that original heritage, connecting every customer to the tradition that started it all."
                  )}
                </p>

                <p>
                  {getContent(
                    "about_story_p3",
                    "Today, MLJJ Cooking specializes in Asian-inspired artisan dishes and unique creations that blend traditional techniques with modern flavors. From premium Japanese Matcha to Filipino Ube to classic favorites, each dish is a celebration of both Eastern tradition and innovation."
                  )}
                </p>

                <p className="border-l-4 border-vermillion-600 pl-6 italic text-ink-700">
                  {getContent(
                    "about_story_quote",
                    "Thank you for being part of our story. Every order you place supports a small business built on passion, patience, and the simple belief that good food brings people together."
                  )}
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-rice-50 relative">
        <div className="absolute inset-0 bg-oriental-pattern opacity-20" />

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="text-gold-500 font-serif tracking-wider">
              我们的理念
            </span>
            <h2 className="section-title mt-2">Our Values</h2>
            <p className="section-subtitle mx-auto">
              The principles that guide every loaf we bake
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center p-6 bg-white border border-rice-200 hover:border-gold-400 hover:shadow-oriental transition-all duration-300"
              >
                <div className="relative inline-block mb-4">
                  <div className="w-16 h-16 bg-vermillion-600 flex items-center justify-center text-rice-50">
                    {value.icon}
                  </div>
                  <span className="absolute -top-2 -right-2 text-xl text-gold-500 font-serif">
                    {value.chinese}
                  </span>
                </div>
                <h3 className="font-serif text-xl text-ink-800 mb-2">
                  {value.title}
                </h3>
                <p className="text-ink-600">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-ink-800 text-rice-50 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `repeating-linear-gradient(
              45deg,
              #D4AF37 0px,
              #D4AF37 1px,
              transparent 1px,
              transparent 20px
            )`,
            }}
          />
        </div>

        <div className="absolute top-10 left-10 text-8xl text-gold-400/10 font-serif hidden lg:block">
          品
        </div>
        <div className="absolute bottom-10 right-10 text-8xl text-vermillion-500/10 font-serif hidden lg:block">
          味
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
          <motion.div
            className="max-w-2xl mx-auto text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="text-gold-400 font-serif tracking-widest">
              欢迎品尝
            </span>
            <h2 className="font-serif text-3xl md:text-4xl mb-6 mt-2">
              Ready to taste the story?
            </h2>
            <p className="text-rice-300 mb-8 text-lg">
              Browse our selection and place your order for Saturday pickup.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/shop" className="btn-secondary">
                Shop Now
              </Link>
              <Link
                to="/contact"
                className="btn-outline border-rice-50 text-rice-50 hover:bg-rice-50 hover:text-ink-800"
              >
                Get in Touch
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
