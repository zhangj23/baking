require('dotenv').config();
const { pool } = require('./index');

const migrate = async () => {
  const client = await pool.connect();
  
  try {
    console.log('🔄 Running database migrations...');

    // Enable UUID extension
    await client.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`);

    // Products table
    await client.query(`
      CREATE TABLE IF NOT EXISTS products (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        name VARCHAR(255) NOT NULL,
        description TEXT,
        price INTEGER NOT NULL,
        image_url TEXT,
        category VARCHAR(100),
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✅ Products table created');

    // Orders table
    await client.query(`
      CREATE TABLE IF NOT EXISTS orders (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        customer_email VARCHAR(255) NOT NULL,
        customer_name VARCHAR(255),
        stripe_payment_id VARCHAR(255),
        stripe_payment_intent_id VARCHAR(255),
        total_amount INTEGER NOT NULL,
        items JSONB NOT NULL,
        status VARCHAR(50) DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✅ Orders table created');

    // Blog posts table
    await client.query(`
      CREATE TABLE IF NOT EXISTS blog_posts (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        title VARCHAR(255) NOT NULL,
        content TEXT,
        video_url TEXT,
        image_url TEXT,
        is_published BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✅ Blog posts table created');

    // Site config table
    await client.query(`
      CREATE TABLE IF NOT EXISTS site_config (
        key VARCHAR(100) PRIMARY KEY,
        value JSONB NOT NULL,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✅ Site config table created');

    // Admin users table
    await client.query(`
      CREATE TABLE IF NOT EXISTS admin_users (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        name VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✅ Admin users table created');

    // Site content table for CMS
    await client.query(`
      CREATE TABLE IF NOT EXISTS site_content (
        id VARCHAR(100) PRIMARY KEY,
        page VARCHAR(50) NOT NULL,
        section VARCHAR(100) NOT NULL,
        content_type VARCHAR(50) NOT NULL,
        content TEXT,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✅ Site content table created');

    // Insert default config values
    await client.query(`
      INSERT INTO site_config (key, value) 
      VALUES ('BLOG_VISIBLE', 'true')
      ON CONFLICT (key) DO NOTHING;
    `);
    console.log('✅ Default config values inserted');

    // Insert default site content
    const defaultContent = [
      // Home Page
      { id: 'home_hero_image', page: 'home', section: 'hero', content_type: 'image', content: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&h=600&fit=crop' },
      { id: 'home_hero_badge', page: 'home', section: 'hero', content_type: 'text', content: '🍜 Now accepting pre-orders' },
      { id: 'home_hero_title', page: 'home', section: 'hero', content_type: 'text', content: 'Baked with' },
      { id: 'home_hero_title_highlight', page: 'home', section: 'hero', content_type: 'text', content: 'Tradition & Love' },
      { id: 'home_hero_description', page: 'home', section: 'hero', content_type: 'text', content: 'Discover our artisan Asian-inspired dishes, crafted with time-honored techniques and the finest ingredients. Pre-order for Saturday pickup.' },
      { id: 'home_cta_title', page: 'home', section: 'cta', content_type: 'text', content: 'Ready to taste the tradition?' },
      { id: 'home_cta_description', page: 'home', section: 'cta', content_type: 'text', content: 'Join our community of food lovers. Place your pre-order today and pick up fresh-baked goodness this Saturday.' },
      
      // About Page
      { id: 'about_hero_image', page: 'about', section: 'hero', content_type: 'image', content: 'https://images.unsplash.com/photo-1556217477-d325251ece38?w=600&h=500&fit=crop' },
      { id: 'about_title', page: 'about', section: 'hero', content_type: 'text', content: 'About MLJJ Cooking' },
      { id: 'about_subtitle', page: 'about', section: 'hero', content_type: 'text', content: 'Where Eastern tradition meets Western craftsmanship. A kitchen born from passion, heritage, and the timeless art of cooking.' },
      { id: 'about_story_p1', page: 'about', section: 'story', content_type: 'text', content: "MLJJ Cooking began in 2020, born from countless hours spent in my grandmother's kitchen in Taiwan, watching her transform simple ingredients into extraordinary dishes. Those memories – the warmth of the kitchen, the aromas of home cooking, the joy of sharing food with family – inspired me to start this journey." },
      { id: 'about_story_p2', page: 'about', section: 'story', content_type: 'text', content: 'We started with traditional family recipes, carefully preserved and now shared with our community. Each dish carries a piece of that original heritage, connecting every customer to the tradition that started it all.' },
      { id: 'about_story_p3', page: 'about', section: 'story', content_type: 'text', content: 'Today, MLJJ Cooking specializes in Asian-inspired artisan dishes and unique creations that blend traditional techniques with modern flavors. From premium Japanese Matcha to Filipino Ube to classic favorites, each dish is a celebration of both Eastern tradition and innovation.' },
      { id: 'about_story_quote', page: 'about', section: 'story', content_type: 'text', content: 'Thank you for being part of our story. Every order you place supports a small business built on passion, patience, and the simple belief that good food brings people together.' },
    ];

    for (const item of defaultContent) {
      await client.query(\`
        INSERT INTO site_content (id, page, section, content_type, content)
        VALUES ($1, $2, $3, $4, $5)
        ON CONFLICT (id) DO NOTHING;
      \`, [item.id, item.page, item.section, item.content_type, item.content]);
    }
    console.log('✅ Default site content inserted');

    console.log('🎉 All migrations completed successfully!');
  } catch (err) {
    console.error('❌ Migration error:', err);
    throw err;
  } finally {
    client.release();
    await pool.end();
  }
};

migrate().catch(console.error);


