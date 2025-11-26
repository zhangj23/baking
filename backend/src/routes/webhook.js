const express = require('express');
const Stripe = require('stripe');
const db = require('../db');
const { sendOrderConfirmation } = require('../services/email');

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Stripe webhook endpoint - receives raw body
router.post('/', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object;
      console.log('💰 Payment succeeded:', paymentIntent.id);
      
      try {
        // Update order status
        const result = await db.query(
          `UPDATE orders 
           SET status = 'paid', 
               stripe_payment_id = $1,
               updated_at = CURRENT_TIMESTAMP 
           WHERE stripe_payment_intent_id = $2
           RETURNING *`,
          [paymentIntent.id, paymentIntent.id]
        );

        if (result.rows.length > 0) {
          const order = result.rows[0];
          
          // Send confirmation email
          await sendOrderConfirmation(order);
          console.log('📧 Confirmation email sent to:', order.customer_email);
        }
      } catch (err) {
        console.error('Error processing payment success:', err);
      }
      break;

    case 'payment_intent.payment_failed':
      const failedPayment = event.data.object;
      console.log('❌ Payment failed:', failedPayment.id);
      
      try {
        await db.query(
          `UPDATE orders 
           SET status = 'failed',
               updated_at = CURRENT_TIMESTAMP 
           WHERE stripe_payment_intent_id = $1`,
          [failedPayment.id]
        );
      } catch (err) {
        console.error('Error processing payment failure:', err);
      }
      break;

    default:
      console.log(`Unhandled event type: ${event.type}`);
  }

  res.json({ received: true });
});

module.exports = router;


