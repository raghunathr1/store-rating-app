const express = require("express");

const {
  getDashboardStats,
  addUser,
  getUsers,
  getUserDetailsByAdmin,
} = require("../controllers/adminController");

const {
  authenticateToken,
  authorizeRoles,
} = require("../middleware/authMiddleware");

const router = express.Router();

// =========================
// ADMIN DASHBOARD
// =========================

router.get(
  "/dashboard",
  authenticateToken,
  authorizeRoles("admin"),
  getDashboardStats
);

// =========================
// ADD USER
// =========================

router.post(
  "/users",
  authenticateToken,
  authorizeRoles("admin"),
  addUser
);
// GET USERS
// =========================

router.get(
  "/users",
  authenticateToken,
  authorizeRoles("admin"),
  getUsers
);
// =========================
// USER DETAILS
// =========================

router.get(
  "/users/:id",
  authenticateToken,
  authorizeRoles("admin"),
  getUserDetailsByAdmin
);
module.exports = router;