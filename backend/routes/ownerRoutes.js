const express = require("express");

const {
  getDashboard,
  getRaters,
} = require("../controllers/ownerController");

const {
  authenticateToken,
  authorizeRoles,
} = require("../middleware/authMiddleware");

const router = express.Router();

router.get(
  "/dashboard",
  authenticateToken,
  authorizeRoles("owner"),
  getDashboard
);

router.get(
  "/raters",
  authenticateToken,
  authorizeRoles("owner"),
  getRaters
);

module.exports = router;