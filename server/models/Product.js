const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  name: { type: String, required: true },
  brand: { type: String, required: true },
  category: { type: String, required: true },
  price: { type: Number, required: true },
  mrp: { type: Number, required: true },
  quantity: { type: Number, required: true, default: 0 },
  rating: { type: Number, required: true, default: 0 },
  description: { type: String, default: "" }
});

module.exports = mongoose.model("Product", productSchema);
