const express = require("express");
const router = express.Router();
const Product = require("../models/Product");

// GET /api/products  -> fetch all products
router.get("/", async function (req, res) {
  try {
    const products = await Product.find().sort({ id: 1 });
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch products", details: err.message });
  }
});

// GET /api/products/:id -> fetch single product
router.get("/:id", async function (req, res) {
  try {
    const product = await Product.findOne({ id: req.params.id });
    if (!product) return res.status(404).json({ error: "Product not found" });
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch product", details: err.message });
  }
});

// POST /api/products -> add a new product
router.post("/", async function (req, res) {
  try {
    const { name, brand, category, price, mrp, quantity, rating, description } = req.body;
    if (!name || !brand || !category || price === undefined) {
      return res.status(400).json({ error: "name, brand, category and price are required" });
    }

    // auto-increment id: one more than current max
    const last = await Product.findOne().sort({ id: -1 });
    const nextId = last ? last.id + 1 : 1;

    const product = new Product({
      id: nextId,
      name,
      brand,
      category,
      price,
      mrp: mrp !== undefined ? mrp : price,
      quantity: quantity !== undefined ? quantity : 0,
      rating: rating !== undefined ? rating : 0,
      description: description || ""
    });

    const saved = await product.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ error: "Failed to add product", details: err.message });
  }
});

// PUT /api/products/:id -> update a product
router.put("/:id", async function (req, res) {
  try {
    const updated = await Product.findOneAndUpdate(
      { id: req.params.id },
      { $set: req.body },
      { new: true, runValidators: true }
    );
    if (!updated) return res.status(404).json({ error: "Product not found" });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: "Failed to update product", details: err.message });
  }
});

// DELETE /api/products/:id -> remove a product
router.delete("/:id", async function (req, res) {
  try {
    const deleted = await Product.findOneAndDelete({ id: req.params.id });
    if (!deleted) return res.status(404).json({ error: "Product not found" });
    res.json({ message: "Product deleted", product: deleted });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete product", details: err.message });
  }
});

module.exports = router;
