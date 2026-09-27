require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const productRoutes = require("./routes/products");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use("/api/products", productRoutes);

app.get("/", function (req, res) {
  res.send("QuickCart API is running");
});

mongoose
  .connect(process.env.MONGO_URI)
  .then(function () {
    console.log("Connected to MongoDB Atlas");
    app.listen(PORT, function () {
      console.log("Server running on http://localhost:" + PORT);
    });
  })
  .catch(function (err) {
    console.error("MongoDB connection error:", err.message);
  });
