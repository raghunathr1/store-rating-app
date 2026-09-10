const express = require("express");

const {
  signup,
  login,
  changePassword,
} = require("../controllers/authController");

const {
  authenticateToken,
  authorizeRoles,
} = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/signup", signup);

router.post("/login", login);

router.put(
  "/change-password",
  authenticateToken,
  authorizeRoles("user", "owner"),
  changePassword
);
router.post(
  "/logout",
  authenticateToken,
  authorizeRoles("admin", "user", "owner"),
  (req, res) => {
    return res.status(200).json({
      message: "Logout successful",
    });
  }
);
module.exports = router;