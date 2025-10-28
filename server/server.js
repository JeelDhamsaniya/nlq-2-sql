const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const pool = require("./config/db");
const connectMongoDB = require("./config/mongodb");
const queryRoutes = require("./routes/queryRoutes");
const authRoutes = require("./routes/authRoutes");
require("dotenv").config();

const app = express();

// Security headers
app.use(
  helmet({
    contentSecurityPolicy: false, // Disable if using inline scripts
    crossOriginEmbedderPolicy: false,
  })
);

// Rate limiting for authentication endpoints
const authLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 15 minutes
  max: 5, // Max 5 requests per window
  message: "Too many authentication attempts, please try again later.",
  standardHeaders: true,
  legacyHeaders: false,
});

// Cookie parser middleware with signing secret (must be before routes)
const COOKIE_SECRET = process.env.COOKIE_SECRET || process.env.JWT_SECRET;
if (!COOKIE_SECRET) {
  console.error(
    "WARNING: COOKIE_SECRET not set, cookies will not be signed!"
  );
}
app.use(cookieParser(COOKIE_SECRET));

// Middleware - Manual CORS setup for Vercel
app.use((req, res, next) => {
  const origin = req.headers.origin;
  const allowedOrigins = [
    "http://localhost:3000",
    "http://localhost:5000",
    "http://localhost:5173",
    "https://nlq-2-sql-fronted.vercel.app",
    "https://nlq-frontend.vercel.app"
  ];

  // Check if origin is in allowed list
  if (!origin || allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin || "*");
  } else if (process.env.NODE_ENV !== "production") {
    // In development, allow all origins
    res.setHeader("Access-Control-Allow-Origin", origin || "*");
  } else {
    // In production, reject unknown origins
    res.setHeader("Access-Control-Allow-Origin", allowedOrigins[0]);
  }

  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Access-Control-Allow-Credentials", "true");

  // Handle preflight
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  next();
});

app.use(express.json());

// Root route
app.get("/", (req, res) => {
  res.json({
    message: "Library NLQ Backend API with Role-Based Access Control",
    status: "running",
    version: "2.0.0",
    features: [
      "MongoDB Authentication",
      "Role-Based Query Validation (USER, STAFF, ADMIN)",
      "Natural Language to SQL with LLM",
      "Secure Query Execution",
    ],
    endpoints: {
      health: "/api/health",
      auth: {
        register: "POST /api/auth/register",
        login: "POST /api/auth/login",
        me: "GET /api/auth/me",
        permissions: "GET /api/auth/permissions",
      },
      query: {
        execute: "POST /api/query (requires auth)",
        schema: "GET /api/schema (requires auth)",
        permissions: "GET /api/permissions (requires auth)",
      },
    },
  });
});

app.get("/health", (req, res) => {
  res.json({ msg: "server is running!!" });
});

// Routes with rate limiting on auth endpoints
app.use("/api/auth/login", authLimiter);
app.use("/api/auth/register", authLimiter);
app.use("/api/auth", authRoutes);
app.use("/api", queryRoutes);

// Test database connection
app.get("/api/health", async (req, res) => {
  const mongoose = require("mongoose");
  const healthStatus = {
    status: "healthy",
    server: "running",
    timestamp: new Date().toISOString(),
  };

  // Check MongoDB
  try {
    healthStatus.mongodb =
      mongoose.connection.readyState === 1 ? "connected" : "disconnected";
  } catch (error) {
    healthStatus.mongodb = "error: " + error.message;
  }

  // Check MySQL
  try {
    const [rows] = await pool.query("SELECT COUNT(*) as count FROM books");
    healthStatus.mysql = "connected";
    healthStatus.bookCount = rows[0].count;
  } catch (error) {
    healthStatus.mysql = "disconnected";
    healthStatus.mysqlError = error.message;
    // Don't return error status - server is still running
  }

  res.json(healthStatus);
});

const PORT = process.env.PORT || 5000;

// Initialize server with MongoDB connection
const startServer = async () => {
  try {
    // Wait for MongoDB connection before starting server
    await connectMongoDB();
    console.log("✅ MongoDB ready for authentication");

    // Only listen locally, not on Vercel
    if (process.env.NODE_ENV !== "production") {
      app.listen(PORT, () => {
        console.log(`🚀 Server running on http://localhost:${PORT}`);
        console.log(
          `⚕️ Check server health on http://localhost:${PORT}/api/health`
        );
        console.log(`🔐 Authentication enabled with MongoDB`);
        console.log(`📊 Role-based access control active`);
      });
    }
  } catch (error) {
    console.error("❌ Failed to start server:", error.message);
    console.log(
      "⚠️ Server starting without MongoDB (auth features may not work)"
    );

    // Start server anyway for development
    if (process.env.NODE_ENV !== "production") {
      app.listen(PORT, () => {
        console.log(
          `🚀 Server running on http://localhost:${PORT} (MongoDB disconnected)`
        );
      });
    }
  }
};

// Start the server
startServer();

module.exports = app;
