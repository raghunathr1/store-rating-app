const {
  getStoresForUser,
} = require("../models/userStoreModel");

// =========================
// GET STORES
// =========================
const getStores = (req, res) => {
  const userId = req.user.id;

  const filters = {
    name: req.query.name || "",
    address: req.query.address || "",
    sortBy: req.query.sortBy || "id",
    order: req.query.order || "DESC",
  };

  getStoresForUser(userId, filters, (err, results) => {
    if (err) {
      console.error("Get stores error:", err);

      return res.status(500).json({
        message: "Failed to get stores",
      });
    }

    return res.status(200).json({
      count: results.length,
      stores: results,
    });
  });
};

module.exports = {
  getStores,
};