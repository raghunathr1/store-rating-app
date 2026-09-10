const jwt = require("jsonwebtoken");

// =========================
// AUTHENTICATION
// =========================
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  // Check token
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      message: "Access denied. No token provided",
    });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    // Store logged-in user information
    req.user = decoded;

    next();
  } catch (error) {
    return res.status(403).json({
      message: "Invalid or expired token",
    });
  }
};

// =========================
// ROLE AUTHORIZATION
// =========================
const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        message: "Authentication required",
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        message: "Access denied. You do not have permission",
      });
    }

    next();
  };
};

module.exports = {
  authenticateToken,
  authorizeRoles,
};