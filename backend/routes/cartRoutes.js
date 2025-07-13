
const express = require("express");
const router = express.Router();
const Cart = require("../models/Cart");
const { verifyToken } = require("../middleware/authMiddleware");

// Get cart items for logged-in user
router.get("/", verifyToken, async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.userId }).populate("items.productId");
    res.json({ cartItems: cart ? cart.items : [] });
  } catch (err) {
    console.error("Error fetching cart items:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// Add or update product quantity in cart
router.post("/add", verifyToken, async (req, res) => {
  const { productId, quantity } = req.body;
  const userId = req.userId;

  if (!productId || typeof quantity !== "number") {
    return res.status(400).json({ error: "Invalid productId or quantity" });
  }

  try {
    let cart = await Cart.findOne({ userId });

    if (!cart) {
      cart = new Cart({ userId, items: [] });
    }

    const existingItem = cart.items.find(
      (item) => item.productId.toString() === productId
    );

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({ productId, quantity });
    }

    await cart.save();
    res.json({ message: "Cart updated", cart });
  } catch (err) {
    console.error("Error updating cart:", err);
    res.status(500).json({ error: "Failed to update cart" });
  }
});

// Update product quantity in cart
router.put("/update", verifyToken, async (req, res) => {
  const { productId, quantity } = req.body;

  if (!productId || typeof quantity !== "number") {
    return res.status(400).json({ error: "Invalid productId or quantity" });
  }

  try {
    const cart = await Cart.findOne({ userId: req.userId });

    if (!cart) return res.status(404).json({ error: "Cart not found" });

    const item = cart.items.find((i) => i.productId.toString() === productId);
    if (item) {
      item.quantity = quantity;
      await cart.save();
      res.json({ message: "Quantity updated", cart });
    } else {
      res.status(404).json({ error: "Item not found in cart" });
    }
  } catch (err) {
    console.error("Error updating quantity:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// Delete item from cart by productId
router.delete("/:productId", verifyToken, async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.userId });

    if (!cart) return res.status(404).json({ error: "Cart not found" });

    cart.items = cart.items.filter(
      (item) => item.productId.toString() !== req.params.productId
    );
    await cart.save();
    res.json({ message: "Item removed", cart });
  } catch (err) {
    console.error("Error removing item from cart:", err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;

