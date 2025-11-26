require('dotenv').config();
const bcrypt = require('bcryptjs');
const { pool } = require('./index');

const seed = async () => {
  const client = await pool.connect();
  
  try {
    console.log('🌱 Seeding database...');

    // Create default admin user (password: admin123)
    const hashedPassword = await bcrypt.hash('admin123', 10);
    await client.query(`
      INSERT INTO admin_users (email, password_hash, name)
      VALUES ('admin@mlbaking.com', $1, 'ML Baking Admin')
      ON CONFLICT (email) DO NOTHING;
    `, [hashedPassword]);
    console.log('✅ Admin user created (admin@mlbaking.com / admin123)');

    // Seed products
    const products = [
      {
        name: 'Matcha Square Toast',
        description: 'Our signature square toast infused with premium Japanese matcha. A delicate balance of earthy green tea flavor with a soft, pillowy texture. Perfect for breakfast or an afternoon treat.',
        price: 1200, // $12.00
        category: 'Square Toast',
        image_url: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800'
      },
      {
        name: 'Sesame Square Toast',
        description: 'Aromatic black sesame toast with a rich, nutty flavor. Made with freshly ground sesame seeds for maximum flavor. A unique twist on our classic square toast.',
        price: 1100, // $11.00
        category: 'Square Toast',
        image_url: 'https://images.unsplash.com/photo-1549931319-a545dcf3bc73?w=800'
      },
      {
        name: 'Ube Square Toast',
        description: 'Beautiful purple yam toast with a naturally sweet, vanilla-like flavor. Made with real ube from the Philippines. Instagram-worthy and delicious!',
        price: 1300, // $13.00
        category: 'Square Toast',
        image_url: 'https://images.unsplash.com/photo-1586985289688-ca3cf47d3e6e?w=800'
      },
      {
        name: 'Classic Sourdough',
        description: 'Traditional sourdough bread made with our 5-year-old starter. Features a perfectly crispy crust with a chewy, tangy interior. Fermented for 24 hours for maximum flavor.',
        price: 900, // $9.00
        category: 'Sourdough',
        image_url: 'https://images.unsplash.com/photo-1585478259715-876acc5be8eb?w=800'
      },
      {
        name: 'Pistachio Paste',
        description: 'House-made pistachio paste using premium Sicilian pistachios. Perfect for spreading on toast, adding to pastries, or eating straight from the jar. No added sugars or preservatives.',
        price: 1800, // $18.00
        category: 'Spreads',
        image_url: 'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?w=800'
      },
      {
        name: 'Rosemary Focaccia',
        description: 'Light and airy focaccia topped with fresh rosemary and sea salt. Made with extra virgin olive oil and our signature slow-rise technique.',
        price: 800, // $8.00
        category: 'Bread',
        image_url: 'https://images.unsplash.com/photo-1573140401552-3fab0b24306f?w=800'
      }
    ];

    for (const product of products) {
      await client.query(`
        INSERT INTO products (name, description, price, category, image_url, is_active)
        VALUES ($1, $2, $3, $4, $5, true)
        ON CONFLICT DO NOTHING;
      `, [product.name, product.description, product.price, product.category, product.image_url]);
    }
    console.log('✅ Sample products created');

    // Seed blog posts
    const posts = [
      {
        title: 'The Secret to Perfect Sourdough',
        content: `<p>After years of perfecting my sourdough recipe, I'm excited to share some tips that will transform your bread-making journey.</p>
        
<h2>Starting Your Starter</h2>
<p>The foundation of great sourdough is a healthy, active starter. Feed it consistently at the same time each day, and keep it at room temperature for the most active fermentation.</p>

<h2>The Importance of Time</h2>
<p>Don't rush the process. A long, cold fermentation in the refrigerator develops complex flavors that you simply can't achieve with a quick rise.</p>

<h2>Trust Your Senses</h2>
<p>Learn to read your dough. The right texture, the right smell, the right appearance - these are your guides more than any timer or recipe.</p>`,
        video_url: 'https://www.youtube.com/embed/2FVfJTGpXnU'
      },
      {
        title: 'Why I Started ML Baking',
        content: `<p>Every loaf tells a story. Mine began in my grandmother's kitchen, where the smell of fresh bread was a constant companion.</p>

<p>ML Baking was born from a simple desire: to share that warmth and comfort with others. Each pastry I create carries a piece of that memory, blended with techniques I've learned from bakers around the world.</p>

<p>Thank you for being part of this journey. Every order you place supports a dream that started with flour, water, and love.</p>`,
        video_url: null
      }
    ];

    for (const post of posts) {
      await client.query(`
        INSERT INTO blog_posts (title, content, video_url, is_published)
        VALUES ($1, $2, $3, true)
        ON CONFLICT DO NOTHING;
      `, [post.title, post.content, post.video_url]);
    }
    console.log('✅ Sample blog posts created');

    console.log('🎉 Database seeding completed!');
  } catch (err) {
    console.error('❌ Seeding error:', err);
    throw err;
  } finally {
    client.release();
    await pool.end();
  }
};

seed().catch(console.error);


