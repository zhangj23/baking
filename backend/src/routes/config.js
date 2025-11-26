const express = require('express');
const db = require('../db');
const { authenticateAdmin } = require('../middleware/auth');

const router = express.Router();

// Get public config (blog visibility, etc.)
router.get('/', async (req, res) => {
  try {
    const result = await db.query('SELECT key, value FROM site_config');
    
    const config = {};
    result.rows.forEach(row => {
      config[row.key] = row.value;
    });

    res.json(config);
  } catch (err) {
    console.error('Get config error:', err);
    res.status(500).json({ error: 'Failed to fetch config' });
  }
});

// Get specific config value
router.get('/:key', async (req, res) => {
  try {
    const result = await db.query(
      'SELECT value FROM site_config WHERE key = $1',
      [req.params.key]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Config key not found' });
    }

    res.json({ key: req.params.key, value: result.rows[0].value });
  } catch (err) {
    console.error('Get config key error:', err);
    res.status(500).json({ error: 'Failed to fetch config' });
  }
});

// Update config (admin)
router.put('/:key', authenticateAdmin, async (req, res) => {
  try {
    const { value } = req.body;
    const key = req.params.key;

    const result = await db.query(
      `INSERT INTO site_config (key, value, updated_at)
       VALUES ($1, $2, CURRENT_TIMESTAMP)
       ON CONFLICT (key) DO UPDATE SET value = $2, updated_at = CURRENT_TIMESTAMP
       RETURNING *`,
      [key, JSON.stringify(value)]
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error('Update config error:', err);
    res.status(500).json({ error: 'Failed to update config' });
  }
});

module.exports = router;


