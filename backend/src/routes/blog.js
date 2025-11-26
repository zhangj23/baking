const express = require('express');
const db = require('../db');
const { authenticateAdmin } = require('../middleware/auth');

const router = express.Router();

// Get all published posts (public)
router.get('/', async (req, res) => {
  try {
    // Check if blog is visible
    const configResult = await db.query(
      "SELECT value FROM site_config WHERE key = 'BLOG_VISIBLE'"
    );
    
    if (configResult.rows.length === 0 || configResult.rows[0].value === 'false') {
      return res.status(404).json({ error: 'Blog is not available' });
    }

    const result = await db.query(
      'SELECT * FROM blog_posts WHERE is_published = true ORDER BY created_at DESC'
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Get blog posts error:', err);
    res.status(500).json({ error: 'Failed to fetch blog posts' });
  }
});

// Get all posts including drafts (admin)
router.get('/admin', authenticateAdmin, async (req, res) => {
  try {
    const result = await db.query(
      'SELECT * FROM blog_posts ORDER BY created_at DESC'
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Get all blog posts error:', err);
    res.status(500).json({ error: 'Failed to fetch blog posts' });
  }
});

// Get single post
router.get('/:id', async (req, res) => {
  try {
    const result = await db.query(
      'SELECT * FROM blog_posts WHERE id = $1',
      [req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Post not found' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error('Get blog post error:', err);
    res.status(500).json({ error: 'Failed to fetch blog post' });
  }
});

// Create post (admin)
router.post('/', authenticateAdmin, async (req, res) => {
  try {
    const { title, content, video_url, image_url, is_published = true } = req.body;

    if (!title) {
      return res.status(400).json({ error: 'Title is required' });
    }

    const result = await db.query(
      `INSERT INTO blog_posts (title, content, video_url, image_url, is_published)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [title, content, video_url, image_url, is_published]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Create blog post error:', err);
    res.status(500).json({ error: 'Failed to create blog post' });
  }
});

// Update post (admin)
router.put('/:id', authenticateAdmin, async (req, res) => {
  try {
    const { title, content, video_url, image_url, is_published } = req.body;

    const result = await db.query(
      `UPDATE blog_posts 
       SET title = COALESCE($1, title),
           content = COALESCE($2, content),
           video_url = $3,
           image_url = COALESCE($4, image_url),
           is_published = COALESCE($5, is_published),
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $6
       RETURNING *`,
      [title, content, video_url, image_url, is_published, req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Post not found' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error('Update blog post error:', err);
    res.status(500).json({ error: 'Failed to update blog post' });
  }
});

// Delete post (admin)
router.delete('/:id', authenticateAdmin, async (req, res) => {
  try {
    const result = await db.query(
      'DELETE FROM blog_posts WHERE id = $1 RETURNING *',
      [req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Post not found' });
    }

    res.json({ message: 'Blog post deleted successfully' });
  } catch (err) {
    console.error('Delete blog post error:', err);
    res.status(500).json({ error: 'Failed to delete blog post' });
  }
});

module.exports = router;


