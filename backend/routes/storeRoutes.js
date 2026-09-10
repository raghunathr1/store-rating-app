const express = require("express");

const {
  addStore,
  getStores,
} = require("../controllers/storeController");

const {
  authenticateToken,
  authorizeRoles,
} = require("../middleware/authMiddleware");

const router = express.Router();

// =========================
// ADD STORE
// =========================
router.post(
  "/",
  authenticateToken,
  authorizeRoles("admin"),
  addStore
);

// =========================
// GET STORES
// =========================
router.get(
  "/",
  authenticateToken,
  authorizeRoles("admin"),
  getStores
);

module.exports = router;