const express = require('express');
const Stripe = require('stripe');
const db = require('../db');
const { authenticateAdmin } = require('../middleware/auth');

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Create payment intent (initiate checkout)
router.post('/create-payment-intent', async (req, res) => {
  try {
    const { items, customer_email, customer_name } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ error: 'No items in cart' });
    }

    if (!customer_email) {
      return res.status(400).json({ error: 'Customer email is required' });
    }

    // Fetch actual prices from database (never trust client-side prices)
    const productIds = items.map(item => item.id);
    const placeholders = productIds.map((_, i) => `$${i + 1}`).join(',');
    
    const result = await db.query(
      `SELECT id, name, price, image_url FROM products WHERE id IN (${placeholders}) AND is_active = true`,
      productIds
    );

    if (result.rows.length !== items.length) {
      return res.status(400).json({ error: 'Some products are unavailable' });
    }

    // Calculate total on server side
    const productMap = {};
    result.rows.forEach(p => { productMap[p.id] = p; });

    let totalAmount = 0;
    const orderItems = items.map(item => {
      const product = productMap[item.id];
      const itemTotal = product.price * item.quantity;
      totalAmount += itemTotal;
      return {
        id: product.id,
        name: product.name,
        price: product.price,
        quantity: item.quantity,
        image_url: product.image_url
      };
    });

    // Create Stripe Payment Intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: totalAmount,
      currency: 'usd',
      metadata: {
        customer_email,
        customer_name: customer_name || '',
        items: JSON.stringify(orderItems.map(i => ({ id: i.id, qty: i.quantity })))
      },
      receipt_email: customer_email
    });

    // Create pending order in database
    const orderResult = await db.query(
      `INSERT INTO orders (customer_email, customer_name, stripe_payment_intent_id, total_amount, items, status)
       VALUES ($1, $2, $3, $4, $5, 'pending')
       RETURNING *`,
      [customer_email, customer_name, paymentIntent.id, totalAmount, JSON.stringify(orderItems)]
    );

    res.json({
      clientSecret: paymentIntent.client_secret,
      orderId: orderResult.rows[0].id,
      totalAmount
    });
  } catch (err) {
    console.error('Create payment intent error:', err);
    res.status(500).json({ error: 'Failed to create payment intent' });
  }
});

// Get all orders (admin)
router.get('/', authenticateAdmin, async (req, res) => {
  try {
    const result = await db.query(
      'SELECT * FROM orders ORDER BY created_at DESC'
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Get orders error:', err);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

// Get single order (admin)
router.get('/:id', authenticateAdmin, async (req, res) => {
  try {
    const result = await db.query(
      'SELECT * FROM orders WHERE id = $1',
      [req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error('Get order error:', err);
    res.status(500).json({ error: 'Failed to fetch order' });
  }
});

// Update order status (admin)
router.patch('/:id/status', authenticateAdmin, async (req, res) => {
  try {
    const { status } = req.body;
    
    const result = await db.query(
      `UPDATE orders SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *`,
      [status, req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error('Update order status error:', err);
    res.status(500).json({ error: 'Failed to update order status' });
  }
});

module.exports = router;


