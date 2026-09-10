const express = require("express");

const { submitRating } = require("../controllers/ratingController");

const {
  authenticateToken,
  authorizeRoles,
} = require("../middleware/authMiddleware");

const router = express.Router();

router.post(
  "/",
  authenticateToken,
  authorizeRoles("user"),
  submitRating
);

module.exports = router;