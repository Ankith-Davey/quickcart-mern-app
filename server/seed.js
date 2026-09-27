require("dotenv").config();
const mongoose = require("mongoose");
const Product = require("./models/Product");

const PRODUCTS = [
  { id: 1, name: "Wireless Mouse", brand: "TechNova", category: "Electronics", price: 799, mrp: 999, quantity: 25, rating: 4.3, description: "Ergonomic wireless mouse with silent clicks." },
  { id: 2, name: "Bluetooth Headphones", brand: "Zolt", category: "Electronics", price: 1999, mrp: 1999, quantity: 0, rating: 4.6, description: "Over-ear headphones with 30-hour battery life." },
  { id: 3, name: "Smartphone Stand", brand: "TechNova", category: "Electronics", price: 349, mrp: 399, quantity: 40, rating: 4.1, description: "Adjustable aluminium stand for phones and tablets." },
  { id: 4, name: "Portable Charger 10000mAh", brand: "Zolt", category: "Electronics", price: 1299, mrp: 1499, quantity: 8, rating: 4.5, description: "Compact power bank with fast charging support." },
  { id: 5, name: "Men's Cotton T-Shirt", brand: "Urban Thread", category: "Clothing", price: 499, mrp: 699, quantity: 60, rating: 4.2, description: "Breathable 100% cotton tee for everyday wear." },
  { id: 6, name: "Women's Denim Jacket", brand: "Urban Thread", category: "Clothing", price: 2199, mrp: 2199, quantity: 0, rating: 4.4, description: "Classic washed-denim jacket with a relaxed fit." },
  { id: 7, name: "Kids Hoodie", brand: "StrideWear", category: "Clothing", price: 899, mrp: 999, quantity: 15, rating: 4.3, description: "Soft fleece hoodie with a front kangaroo pocket." },
  { id: 8, name: "Running Shoes", brand: "StrideWear", category: "Clothing", price: 2499, mrp: 2999, quantity: 5, rating: 4.6, description: "Lightweight running shoes with cushioned soles." },
  { id: 9, name: "Basmati Rice 5kg", brand: "Harvestly", category: "Grocery", price: 650, mrp: 650, quantity: 100, rating: 4.5, description: "Aged long-grain basmati rice, aromatic and fluffy." },
  { id: 10, name: "Organic Honey 500g", brand: "PureLeaf", category: "Grocery", price: 349, mrp: 399, quantity: 0, rating: 4.7, description: "Raw, unfiltered honey sourced from wildflower farms." },
  { id: 11, name: "Green Tea Pack", brand: "PureLeaf", category: "Grocery", price: 199, mrp: 249, quantity: 50, rating: 4.2, description: "Antioxidant-rich green tea, 100 tea bags." },
  { id: 12, name: "Almonds 1kg", brand: "Harvestly", category: "Grocery", price: 899, mrp: 999, quantity: 12, rating: 4.4, description: "Premium California almonds, roasted and unsalted." },
  { id: 13, name: "Aloe Vera Face Gel", brand: "GlowRoot", category: "Beauty", price: 249, mrp: 299, quantity: 30, rating: 4.3, description: "Lightweight, non-greasy gel for daily hydration." },
  { id: 14, name: "Matte Lipstick", brand: "Velvet & Co", category: "Beauty", price: 399, mrp: 399, quantity: 0, rating: 4.1, description: "Long-lasting matte finish in classic red." },
  { id: 15, name: "Herbal Shampoo 300ml", brand: "GlowRoot", category: "Beauty", price: 299, mrp: 349, quantity: 45, rating: 4.0, description: "Sulfate-free shampoo with rosemary extract." },
  { id: 16, name: "Sunscreen SPF 50", brand: "Velvet & Co", category: "Beauty", price: 549, mrp: 649, quantity: 20, rating: 4.5, description: "Broad-spectrum sunscreen, lightweight and non-sticky." },
  { id: 17, name: "Non-Stick Frying Pan", brand: "Home Haus", category: "Home & Kitchen", price: 899, mrp: 1099, quantity: 18, rating: 4.4, description: "Scratch-resistant non-stick pan, induction friendly." },
  { id: 18, name: "Cotton Bedsheet Set", brand: "Northline", category: "Home & Kitchen", price: 1299, mrp: 1299, quantity: 0, rating: 4.3, description: "Queen-size 300 thread count cotton bedsheet set." },
  { id: 19, name: "LED Table Lamp", brand: "Northline", category: "Home & Kitchen", price: 749, mrp: 899, quantity: 22, rating: 4.2, description: "Adjustable brightness lamp with USB charging port." },
  { id: 20, name: "Glass Storage Jars (Set of 4)", brand: "Home Haus", category: "Home & Kitchen", price: 599, mrp: 699, quantity: 35, rating: 4.6, description: "Airtight glass jars for pantry storage." },
  { id: 21, name: "Gel Pens (Pack of 10)", brand: "InkWell", category: "Stationery", price: 149, mrp: 199, quantity: 80, rating: 4.1, description: "Smooth-writing gel pens in assorted colors." },
  { id: 22, name: "Spiral Notebook A5", brand: "PaperTrail", category: "Stationery", price: 99, mrp: 99, quantity: 0, rating: 4.0, description: "200-page ruled notebook with durable spiral binding." },
  { id: 23, name: "Sticky Notes Set", brand: "InkWell", category: "Stationery", price: 129, mrp: 149, quantity: 55, rating: 4.3, description: "Assorted sticky notes for reminders and planning." },
  { id: 24, name: "Desk Organizer", brand: "PaperTrail", category: "Stationery", price: 449, mrp: 549, quantity: 10, rating: 4.4, description: "Multi-compartment organizer for desk essentials." }
];

mongoose
  .connect(process.env.MONGO_URI)
  .then(async function () {
    console.log("Connected. Clearing old products...");
    await Product.deleteMany({});
    console.log("Inserting seed products...");
    await Product.insertMany(PRODUCTS);
    console.log("Seeded " + PRODUCTS.length + " products successfully.");
    process.exit(0);
  })
  .catch(function (err) {
    console.error("Seed failed:", err.message);
    process.exit(1);
  });
