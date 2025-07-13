
const express = require("express");
const jwt = require("jsonwebtoken");
const router = express.Router();

const ADMIN_EMAIL = "mahalakshmipilli@gmail.com";
const ADMIN_PASSWORD = "12345678";



router.post("/login", (req, res) => {
  const { email, password } = req.body;

  if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
    const token = jwt.sign(
      { email, isAdmin: true }, // ✅ Ensure isAdmin is true
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );
    return res.json({ token });
  } else {
    return res.status(401).json({ message: "Invalid credentials" });
  }
});

module.exports = router;
