
const jwt = require("jsonwebtoken");

// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  console.log("🧾 Incoming Auth Header:", req.headers.authorization);
  // Check if Authorization header is present
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    console.log("❌ No token or malformed header");
    return res.status(401).json({ error: "Unauthorized: No token provided" });
  }

  const token = authHeader.split(" ")[1]; // Get the actual token part
  console.log("🔑 Extracted Token:", token);
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("JWT_SECRET:", process.env.JWT_SECRET ? "Set" : "NOT SET");

    console.log("✅ Decoded token:", decoded);
    req.user = decoded;             // Save full decoded user (for isAdmin)
    req.userId = decoded.id || decoded._id; // Save userId separately (for cart operations)
    next();
  } catch (err) {
    console.error("❌ Token verification failed:", err.message);
    return res.status(401).json({ error: "Unauthorized: Invalid token" });
  }
};

// Middleware to check admin role
const isAdmin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    return res.status(403).json({ error: "Forbidden: Admins only" });
  }
};

module.exports = {
  verifyToken,
  isAdmin,
};
