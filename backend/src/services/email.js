const { SESClient, SendEmailCommand } = require('@aws-sdk/client-ses');

const sesClient = new SESClient({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  }
});

const formatPrice = (cents) => {
  return `$${(cents / 100).toFixed(2)}`;
};

const sendOrderConfirmation = async (order) => {
  const items = typeof order.items === 'string' ? JSON.parse(order.items) : order.items;
  
  const itemsList = items.map(item => 
    `• ${item.name} x${item.quantity} - ${formatPrice(item.price * item.quantity)}`
  ).join('\n');

  const pickupAddress = process.env.PICKUP_ADDRESS || '123 Bakery Lane, New York, NY';
  const pickupTime = process.env.PICKUP_TIME || 'Saturday, 10:00 AM - 2:00 PM';

  const emailHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: 'Georgia', serif; background-color: #FFFEF7; margin: 0; padding: 20px; }
        .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
        .header { background: linear-gradient(135deg, #C41E3A 0%, #e85a45 100%); padding: 30px; text-align: center; }
        .header h1 { color: #FFFEF7; margin: 0; font-size: 28px; }
        .content { padding: 30px; color: #2D2D2D; }
        .order-details { background: #FFF8F0; border-radius: 8px; padding: 20px; margin: 20px 0; }
        .order-id { font-size: 12px; color: #888; margin-bottom: 10px; }
        .item { padding: 8px 0; border-bottom: 1px solid #D4AF37; }
        .total { font-weight: bold; font-size: 18px; margin-top: 15px; padding-top: 15px; border-top: 2px solid #2D2D2D; }
        .pickup-info { background: #2D2D2D; color: white; padding: 20px; border-radius: 8px; margin-top: 20px; }
        .pickup-info h3 { margin-top: 0; color: #D4AF37; }
        .footer { text-align: center; padding: 20px; color: #888; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🍜 Thank You for Your Order!</h1>
        </div>
        <div class="content">
          <p>Dear ${order.customer_name || 'Valued Customer'},</p>
          <p>We're thrilled to confirm your order at ML Baking! Your freshly baked goods will be ready for pickup.</p>
          
          <div class="order-details">
            <div class="order-id">Order ID: ${order.id}</div>
            ${items.map(item => `
              <div class="item">
                ${item.name} × ${item.quantity} — ${formatPrice(item.price * item.quantity)}
              </div>
            `).join('')}
            <div class="total">Total: ${formatPrice(order.total_amount)}</div>
          </div>

          <div class="pickup-info">
            <h3>📍 Pickup Details</h3>
            <p><strong>Address:</strong> ${pickupAddress}</p>
            <p><strong>Time:</strong> ${pickupTime}</p>
          </div>

          <p style="margin-top: 30px;">We can't wait to see you! If you have any questions, feel free to reply to this email.</p>
          
          <p>With warmth,<br><strong>The MLJJ Cooking Team</strong></p>
        </div>
        <div class="footer">
          <p>© ${new Date().getFullYear()} MLJJ Cooking. Made with love and tradition.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  const textContent = `
Thank You for Your Order at MLJJ Cooking!

Order ID: ${order.id}

Items:
${itemsList}

Total: ${formatPrice(order.total_amount)}

PICKUP DETAILS:
Address: ${pickupAddress}
Time: ${pickupTime}

We can't wait to see you!

With warmth,
The MLJJ Cooking Team
  `;

  const params = {
    Source: process.env.SES_FROM_EMAIL || 'orders@mlbaking.com',
    Destination: {
      ToAddresses: [order.customer_email]
    },
    Message: {
      Subject: {
        Data: `Order Confirmed! 🍜 MLJJ Cooking #${order.id.slice(0, 8)}`,
        Charset: 'UTF-8'
      },
      Body: {
        Text: {
          Data: textContent,
          Charset: 'UTF-8'
        },
        Html: {
          Data: emailHtml,
          Charset: 'UTF-8'
        }
      }
    }
  };

  try {
    const command = new SendEmailCommand(params);
    const response = await sesClient.send(command);
    console.log('Email sent successfully:', response.MessageId);
    return response;
  } catch (err) {
    console.error('Failed to send email:', err);
    // Don't throw - email failure shouldn't break the order flow
    // In production, you might want to queue this for retry
  }
};

module.exports = { sendOrderConfirmation };


