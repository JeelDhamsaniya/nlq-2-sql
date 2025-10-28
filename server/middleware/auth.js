const jwt = require("jsonwebtoken");
const User = require("../models/User");

// CRITICAL: JWT_SECRET must be set in environment variables
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  console.error("❌ FATAL ERROR: JWT_SECRET environment variable is not set!");
  console.error(
    "⚠️  Set JWT_SECRET in your .env file before starting the server"
  );
  process.exit(1); // Stop server if JWT_SECRET is missing
}

// Middleware to verify JWT token and attach user to request
const authenticate = async (req, res, next) => {
  try {
    // Get token from SIGNED cookie (more secure)
    let token = req.signedCookies?.token;

    // Fallback to unsigned cookie for backward compatibility
    if (!token) {
      token = req.cookies?.token;
    }

    // Last resort: Authorization header (for backward compatibility during migration)
    if (!token) {
      token = req.header("Authorization")?.replace("Bearer ", "");
    }

    if (!token) {
      return res.status(401).json({
        error: "Access denied. No token provided.",
      });
    }

    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET);

    // Find user
    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      return res.status(401).json({
        error: "Invalid token. User not found.",
      });
    }

    // Attach user to request
    req.user = user;
    req.userId = user._id;
    req.userRole = user.role;

    next();
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ error: "Invalid token." });
    }
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ error: "Token expired." });
    }
    res.status(500).json({ error: "Authentication failed." });
  }
};

// Middleware to check if user has required role
const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        error: "Authentication required.",
      });
    }

    if (!allowedRoles.includes(req.userRole)) {
      return res.status(403).json({
        error: `Access denied. Required role: ${allowedRoles.join(" or ")}`,
        yourRole: req.userRole,
      });
    }

    next();
  };
};

// Generate JWT token
const generateToken = (userId, role) => {
  return jwt.sign({ userId, role }, JWT_SECRET, { expiresIn: "7d" });
};

module.exports = {
  authenticate,
  authorize,
  generateToken,
  JWT_SECRET,
};
