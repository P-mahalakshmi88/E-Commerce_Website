

const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const Product = require("../models/Product");
const { verifyToken, isAdmin } = require("../middleware/authMiddleware");

// Ensure 'uploads' directory exists
const uploadDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Multer config
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + path.extname(file.originalname);
    cb(null, uniqueName);
  },
});

const upload = multer({ storage });


router.post(
  "/",
  verifyToken,
  isAdmin,
  upload.single("image"),
  async (req, res) => {
    const { name, price, description } = req.body;

    if (!name || !price || !description || !req.file) {
      return res.status(400).json({ message: "Invalid product data. Check inputs." });
    }

    try {
      const image = `/uploads/${req.file.filename}`;
      const newProduct = new Product({
        name,
        price,
        description,
        image,
      });

      await newProduct.save();
      res.status(201).json(newProduct);
    } catch (err) {
      console.error("Error creating product:", err);
      res.status(500).json({ message: "Error creating product" });
    }
  }
);


router.get("/", async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    console.error("Error fetching products:", err);
    res.status(500).json({ message: "Error fetching products" });
  }
});


router.put(
  "/:id",
  verifyToken,
  isAdmin,
  upload.single("image"),
  async (req, res) => {
    try {
      const product = await Product.findById(req.params.id);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }

      // Update fields if provided
      product.name = req.body.name ?? product.name;
      product.price = req.body.price ?? product.price;
      product.description = req.body.description ?? product.description;

      // If a new image is uploaded
      if (req.file) {
        // Delete old image file
        if (product.image) {
          const oldImagePath = path.join(__dirname, "..", product.image);
          if (fs.existsSync(oldImagePath)) {
            fs.unlinkSync(oldImagePath);
          }
        }
        // Save new image path
        product.image = `/uploads/${req.file.filename}`;
      }

      const updatedProduct = await product.save();
      res.json(updatedProduct);
    } catch (err) {
      console.error("Error updating product:", err);
      res.status(500).json({ message: "Failed to update product" });
    }
  }
);

/**
 * @route   DELETE /api/products/:id
 * @desc    Admin - Delete product
 */
router.delete("/:id", verifyToken, isAdmin, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    // Delete image file if exists
    if (product.image) {
      const imagePath = path.join(__dirname, "..", product.image);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    await product.deleteOne();
    res.json({ message: "Product deleted" });
  } catch (err) {
    console.error("Error deleting product:", err);
    res.status(500).json({ message: "Error deleting product" });
  }
});

module.exports = router;
