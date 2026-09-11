const {
  getOwnerDashboard,
  getStoreRaters,
} = require("../models/ownerModel");

// =========================
// OWNER DASHBOARD
// =========================
const getDashboard = (req, res) => {
  const ownerId = req.user.id;

  getOwnerDashboard(ownerId, (err, results) => {
    if (err) {
      console.error("Owner dashboard error:", err);

      return res.status(500).json({
        message: "Failed to get owner dashboard",
      });
    }

    return res.status(200).json({
      stores: results,
    });
  });
};

// =========================
// USERS WHO RATED OWNER'S STORE
// =========================
const getRaters = (req, res) => {
  const ownerId = req.user.id;

  getStoreRaters(ownerId, (err, results) => {
    if (err) {
      console.error("Get raters error:", err);

      return res.status(500).json({
        message: "Failed to get store raters",
      });
    }

    return res.status(200).json({
      count: results.length,
      raters: results,
    });
  });
};

module.exports = {
  getDashboard,
  getRaters,
};