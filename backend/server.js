const express = require("express");
const cors = require("cors");
require("dotenv").config();

const storeRoutes = require("./routes/storeRoutes");
const db = require("./config/db");
const userStoreRoutes = require("./routes/userStoreRoutes");
const authRoutes = require("./routes/authRoute");
const adminRoutes = require("./routes/adminRoutes");
const ratingRoutes = require("./routes/ratingRoutes");
const ownerRoutes = require("./routes/ownerRoutes");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Test API
app.get("/", (req, res) => {
  res.json({
    message: "Store Rating API is running",
  });
});

// Auth routes
app.use("/api/auth", authRoutes);

// Admin routes
app.use("/api/admin", adminRoutes);

// Admin Store routes
app.use("/api/admin/stores", storeRoutes);

// User routes
app.use("/api/user/stores", userStoreRoutes);
app.use("/api/user/ratings", ratingRoutes);

// Owner routes
app.use("/api/owner", ownerRoutes);

// Server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});