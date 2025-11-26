# 🍜 MLJJ Cooking E-Commerce Platform

A beautiful, full-stack e-commerce platform for artisan Asian-inspired cuisine. Pre-order system with Saturday pickup, built with React, Node.js, PostgreSQL, Stripe, and AWS services.

![ML Baking](https://images.unsplash.com/photo-1509440159596-0249088772ff?w=1200&h=400&fit=crop)

## ✨ Features

### Customer-Facing

- **Beautiful Storefront** - Warm, organic design with dusty rose and walnut colors
- **Product Catalog** - Browse baked goods with filtering and search
- **Shopping Cart** - Persistent cart with slide-out drawer
- **Secure Checkout** - Stripe integration for payments
- **Order Confirmation** - Email notifications with pickup details
- **Blog Section** - Recipes and baking stories (togglable)
- **Responsive Design** - Works beautifully on all devices

### Admin Portal

- **Dashboard** - Overview of orders and revenue
- **Product Management** - Create, edit, delete products with images
- **Order Management** - View orders and update fulfillment status
- **Blog Management** - Write posts with rich text and video embeds
- **Settings** - Toggle blog visibility, change password

## 🛠 Tech Stack

| Layer          | Technology                                  |
| -------------- | ------------------------------------------- |
| Frontend       | React 18, Vite, Tailwind CSS, Framer Motion |
| Backend        | Node.js, Express.js                         |
| Database       | PostgreSQL                                  |
| Payments       | Stripe                                      |
| File Storage   | AWS S3                                      |
| Email          | AWS SES                                     |
| Authentication | JWT                                         |

## 📁 Project Structure

```
baking/
├── backend/
│   ├── src/
│   │   ├── db/           # Database connection & migrations
│   │   ├── middleware/   # Auth middleware
│   │   ├── routes/       # API endpoints
│   │   └── services/     # Email service
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/   # Reusable UI components
│   │   ├── context/      # React context (Cart, Config)
│   │   ├── pages/        # Page components
│   │   │   └── admin/    # Admin portal pages
│   │   └── utils/        # API utilities
│   └── package.json
└── README.md
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- PostgreSQL 14+
- Stripe account
- AWS account (for S3 and SES)

### 1. Clone & Install

```bash
# Clone the repository
git clone <your-repo-url>
cd baking

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 2. Environment Setup

Create `backend/.env`:

```env
# Server
PORT=3001
NODE_ENV=development

# Database
DATABASE_URL=postgresql://username:password@localhost:5432/mlbaking

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Stripe
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# AWS
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
AWS_S3_BUCKET=ml-baking-images

# Email
SES_FROM_EMAIL=orders@yourdomain.com

# Frontend URL
FRONTEND_URL=http://localhost:5173

# Pickup Details
PICKUP_ADDRESS=123 Bakery Lane, New York, NY
PICKUP_TIME=Saturday, 10:00 AM - 2:00 PM
```

Create `frontend/.env`:

```env
VITE_API_URL=http://localhost:3001/api
VITE_STRIPE_PUBLIC_KEY=pk_test_...
```

### 3. Database Setup

```bash
# Create the database
createdb mlbaking

# Run migrations
cd backend
npm run migrate

# Seed sample data (optional)
npm run seed
```

### 4. Run Development Servers

```bash
# Terminal 1: Backend
cd backend
npm run dev

# Terminal 2: Frontend
cd frontend
npm run dev
```

Visit:

- Store: http://localhost:5173
- Admin: http://localhost:5173/admin

Default admin login (from seed):

- Email: `admin@mljjcooking.com`
- Password: `admin123`

## 🔧 Configuration

### AWS S3 Setup

1. Create an S3 bucket
2. Enable public access for the bucket
3. Add bucket policy for public read:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::your-bucket-name/*"
    }
  ]
}
```

4. Configure CORS:

```json
[
  {
    "AllowedHeaders": ["*"],
    "AllowedMethods": ["GET", "PUT", "POST"],
    "AllowedOrigins": ["http://localhost:5173", "https://yourdomain.com"],
    "ExposeHeaders": []
  }
]
```

### AWS SES Setup

1. Verify your domain in SES
2. Move out of sandbox mode for production
3. Create SMTP credentials or use SDK

### Stripe Setup

1. Get API keys from Stripe Dashboard
2. Set up webhook endpoint: `https://yourdomain.com/api/webhook`
3. Subscribe to `payment_intent.succeeded` and `payment_intent.payment_failed` events

## 🚢 Deployment

### Frontend (AWS Amplify)

1. Connect your Git repository to Amplify
2. Set build settings:
   - Build command: `npm run build`
   - Output directory: `dist`
   - Base directory: `frontend`
3. Add environment variables in Amplify Console

### Backend (AWS Elastic Beanstalk)

1. Create Node.js environment
2. Set environment variables
3. Configure RDS for PostgreSQL
4. Deploy via EB CLI or GitHub Actions

### Alternative: AWS Lambda + API Gateway

Use Serverless Framework or SAM for serverless deployment.

## 📱 API Endpoints

### Public

| Method | Endpoint                          | Description              |
| ------ | --------------------------------- | ------------------------ |
| GET    | /api/products                     | Get all active products  |
| GET    | /api/products/:id                 | Get single product       |
| GET    | /api/blog                         | Get published blog posts |
| GET    | /api/config                       | Get site configuration   |
| POST   | /api/orders/create-payment-intent | Create Stripe payment    |

### Admin (Protected)

| Method | Endpoint               | Description         |
| ------ | ---------------------- | ------------------- |
| POST   | /api/auth/login        | Admin login         |
| GET    | /api/products/admin    | Get all products    |
| POST   | /api/products          | Create product      |
| PUT    | /api/products/:id      | Update product      |
| DELETE | /api/products/:id      | Delete product      |
| GET    | /api/orders            | Get all orders      |
| PATCH  | /api/orders/:id/status | Update order status |
| POST   | /api/blog              | Create blog post    |
| PUT    | /api/blog/:id          | Update blog post    |
| PUT    | /api/config/:key       | Update config       |

## 🎨 Customization

### Colors

Edit `frontend/tailwind.config.js` to change the color palette:

```js
colors: {
  'dusty-rose': { ... },
  'walnut': { ... },
  'cream': { ... },
}
```

### Fonts

Update Google Fonts in `frontend/index.html` and Tailwind config.

### Pickup Details

Update environment variables for different pickup locations/times.

## 🧪 Testing

```bash
# Backend tests (when implemented)
cd backend
npm test

# Frontend tests (when implemented)
cd frontend
npm test
```

## 📄 License

MIT License - feel free to use for your own bakery!

## 🙏 Acknowledgments

- Images from [Unsplash](https://unsplash.com)
- Icons from [Lucide](https://lucide.dev)
- Fonts from [Google Fonts](https://fonts.google.com)

---

Made with 🍜 and ❤️ for MLJJ Cooking
