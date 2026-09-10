const express = require("express");

const {
  getStores,
} = require("../controllers/userStoreController");

const {
  authenticateToken,
  authorizeRoles,
} = require("../middleware/authMiddleware");

const router = express.Router();

// =========================
// GET ALL STORES
// =========================

router.get(
  "/",
  authenticateToken,
  authorizeRoles("user"),
  getStores
);

module.exports = router;