const express = require('express');
const db = require('../db');
const { authenticateAdmin } = require('../middleware/auth');

const router = express.Router();

// Get all content for a page (public)
router.get('/page/:page', async (req, res) => {
  try {
    const result = await db.query(
      'SELECT id, section, content_type, content FROM site_content WHERE page = $1',
      [req.params.page]
    );
    
    // Convert to object for easy access
    const content = {};
    result.rows.forEach(row => {
      content[row.id] = {
        section: row.section,
        type: row.content_type,
        value: row.content
      };
    });
    
    res.json(content);
  } catch (err) {
    console.error('Get page content error:', err);
    res.status(500).json({ error: 'Failed to fetch content' });
  }
});

// Get single content item
router.get('/:id', async (req, res) => {
  try {
    const result = await db.query(
      'SELECT * FROM site_content WHERE id = $1',
      [req.params.id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Content not found' });
    }
    
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Get content error:', err);
    res.status(500).json({ error: 'Failed to fetch content' });
  }
});

// Get all content (admin)
router.get('/', authenticateAdmin, async (req, res) => {
  try {
    const result = await db.query(
      'SELECT * FROM site_content ORDER BY page, section, id'
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Get all content error:', err);
    res.status(500).json({ error: 'Failed to fetch content' });
  }
});

// Update content item (admin)
router.put('/:id', authenticateAdmin, async (req, res) => {
  try {
    const { content } = req.body;
    
    const result = await db.query(
      `UPDATE site_content 
       SET content = $1, updated_at = CURRENT_TIMESTAMP 
       WHERE id = $2 
       RETURNING *`,
      [content, req.params.id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Content not found' });
    }
    
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Update content error:', err);
    res.status(500).json({ error: 'Failed to update content' });
  }
});

// Bulk update content (admin)
router.post('/bulk-update', authenticateAdmin, async (req, res) => {
  try {
    const { updates } = req.body; // Array of { id, content }
    
    for (const update of updates) {
      await db.query(
        `UPDATE site_content 
         SET content = $1, updated_at = CURRENT_TIMESTAMP 
         WHERE id = $2`,
        [update.content, update.id]
      );
    }
    
    res.json({ message: 'Content updated successfully', count: updates.length });
  } catch (err) {
    console.error('Bulk update content error:', err);
    res.status(500).json({ error: 'Failed to update content' });
  }
});

// Create new content item (admin)
router.post('/', authenticateAdmin, async (req, res) => {
  try {
    const { id, page, section, content_type, content } = req.body;
    
    const result = await db.query(
      `INSERT INTO site_content (id, page, section, content_type, content)
       VALUES ($1, $2, $3, $4, $5)
       ON CONFLICT (id) DO UPDATE SET content = $5, updated_at = CURRENT_TIMESTAMP
       RETURNING *`,
      [id, page, section, content_type, content]
    );
    
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Create content error:', err);
    res.status(500).json({ error: 'Failed to create content' });
  }
});

module.exports = router;

