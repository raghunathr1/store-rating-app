const {
  createStore,
  findStoreByEmail,
  getAllStores,
} = require("../models/storeModel");

const {
  findUserById,
} = require("../models/userModel");

// =========================
// ADD STORE
// =========================
const addStore = (req, res) => {
  const {
    name,
    email,
    address,
    owner_id,
  } = req.body;

  // Required fields
  if (!name || !email || !address || !owner_id) {
    return res.status(400).json({
      message: "All fields are required",
    });
  }

  const trimmedName = name.trim();
  const trimmedEmail = email.trim().toLowerCase();
  const trimmedAddress = address.trim();

  // Name validation
  if (
    trimmedName.length < 20 ||
    trimmedName.length > 60
  ) {
    return res.status(400).json({
      message: "Store name must be between 20 and 60 characters",
    });
  }

  // Address validation
  if (trimmedAddress.length > 400) {
    return res.status(400).json({
      message: "Address must not exceed 400 characters",
    });
  }

  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(trimmedEmail)) {
    return res.status(400).json({
      message: "Please enter a valid email address",
    });
  }

  // Check owner
  findUserById(owner_id, (userError, users) => {
    if (userError) {
      console.error("Owner lookup error:", userError);

      return res.status(500).json({
        message: "Database error",
      });
    }

    if (users.length === 0) {
      return res.status(404).json({
        message: "Store owner not found",
      });
    }

    const owner = users[0];

    if (owner.role !== "owner") {
      return res.status(400).json({
        message: "Selected user is not a store owner",
      });
    }

    // Check duplicate store email
    findStoreByEmail(trimmedEmail, (err, stores) => {
      if (err) {
        console.error("Store email lookup error:", err);

        return res.status(500).json({
          message: "Database error",
        });
      }

      if (stores.length > 0) {
        return res.status(409).json({
          message: "Store email already exists",
        });
      }

      const storeData = {
        name: trimmedName,
        email: trimmedEmail,
        address: trimmedAddress,
        owner_id,
      };

      createStore(storeData, (err, result) => {
        if (err) {
          console.error("Create store error:", err);

          return res.status(500).json({
            message: "Failed to create store",
          });
        }

        return res.status(201).json({
          message: "Store created successfully",
          storeId: result.insertId,
        });
      });
    });
  });
};

// =========================
// GET ALL STORES
// =========================
const getStores = (req, res) => {
  const filters = {
    name: req.query.name || "",
    email: req.query.email || "",
    address: req.query.address || "",
    sortBy: req.query.sortBy || "id",
    order: req.query.order || "DESC",
  };

  getAllStores(filters, (err, results) => {
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
  addStore,
  getStores,
};