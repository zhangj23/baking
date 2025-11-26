require("dotenv").config();
const express = require("express");
const cors = require("cors");

// Import routes
const productRoutes = require("./routes/products");
const orderRoutes = require("./routes/orders");
const blogRoutes = require("./routes/blog");
const configRoutes = require("./routes/config");
const authRoutes = require("./routes/auth");
const uploadRoutes = require("./routes/upload");
const webhookRoutes = require("./routes/webhook");

const app = express();

// Stripe webhook needs raw body, so we handle it before json middleware
app.use("/api/webhook", webhookRoutes);

// Middleware
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());

// Routes
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/blog", blogRoutes);
app.use("/api/config", configRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/upload", uploadRoutes);

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: "Something went wrong!",
    message: process.env.NODE_ENV === "development" ? err.message : undefined,
  });
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`🥐 ML Baking API running on port ${PORT}`);
});
