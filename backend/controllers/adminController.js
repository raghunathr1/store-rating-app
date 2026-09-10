const bcrypt = require("bcryptjs");

const {
  getTotalUsers,
  getTotalStores,
  getTotalRatings,
  createUserByAdmin,
  getAllUsersForAdmin,
  getUserDetails,
  getOwnerStoreDetails,
  getStoreRaters,
} = require("../models/adminModel");

const { findUserByEmail } = require("../models/userModel");

// =========================
// ADMIN DASHBOARD
// =========================
const getDashboardStats = (req, res) => {
  getTotalUsers((userError, userResult) => {
    if (userError) {
      console.error("Users count error:", userError);

      return res.status(500).json({
        message: "Failed to get total users",
      });
    }

    getTotalStores((storeError, storeResult) => {
      if (storeError) {
        console.error("Stores count error:", storeError);

        return res.status(500).json({
          message: "Failed to get total stores",
        });
      }

      getTotalRatings((ratingError, ratingResult) => {
        if (ratingError) {
          console.error(
            "Ratings count error:",
            ratingError
          );

          return res.status(500).json({
            message: "Failed to get total ratings",
          });
        }

        return res.status(200).json({
          totalUsers: userResult[0].totalUsers,
          totalStores: storeResult[0].totalStores,
          totalRatings: ratingResult[0].totalRatings,
        });
      });
    });
  });
};

// =========================
// ADD USER BY ADMIN
// =========================
const addUser = (req, res) => {
  const {
    name,
    email,
    password,
    address,
    role,
  } = req.body;

  // Required fields
  if (
    !name ||
    !email ||
    !password ||
    !address ||
    !role
  ) {
    return res.status(400).json({
      message: "All fields are required",
    });
  }

  const trimmedName = name.trim();
  const trimmedEmail = email.trim().toLowerCase();
  const trimmedAddress = address.trim();

  // =========================
  // NAME VALIDATION
  // =========================
  if (
    trimmedName.length < 20 ||
    trimmedName.length > 60
  ) {
    return res.status(400).json({
      message:
        "Name must be between 20 and 60 characters",
    });
  }

  // =========================
  // ADDRESS VALIDATION
  // =========================
  if (trimmedAddress.length > 400) {
    return res.status(400).json({
      message:
        "Address must not exceed 400 characters",
    });
  }

  // =========================
  // EMAIL VALIDATION
  // =========================
  const emailRegex =
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(trimmedEmail)) {
    return res.status(400).json({
      message:
        "Please enter a valid email address",
    });
  }

  // =========================
  // PASSWORD VALIDATION
  // =========================
  const passwordRegex =
    /^(?=.*[A-Z])(?=.*[^A-Za-z0-9]).{8,16}$/;

  if (!passwordRegex.test(password)) {
    return res.status(400).json({
      message:
        "Password must be 8-16 characters long and contain at least one uppercase letter and one special character",
    });
  }

  // =========================
  // ROLE VALIDATION
  // =========================
  const allowedRoles = [
    "user",
    "admin",
    "owner",
  ];

  if (!allowedRoles.includes(role)) {
    return res.status(400).json({
      message: "Invalid role",
    });
  }

  // =========================
  // CHECK DUPLICATE EMAIL
  // =========================
  findUserByEmail(
    trimmedEmail,
    async (err, results) => {
      if (err) {
        console.error(
          "Find user error:",
          err
        );

        return res.status(500).json({
          message: "Database error",
        });
      }

      if (results.length > 0) {
        return res.status(409).json({
          message: "Email already registered",
        });
      }

      try {
        // Hash password
        const hashedPassword =
          await bcrypt.hash(password, 10);

        const newUser = {
          name: trimmedName,
          email: trimmedEmail,
          password: hashedPassword,
          address: trimmedAddress,
          role,
        };

        createUserByAdmin(
          newUser,
          (err, result) => {
            if (err) {
              console.error(
                "Create user error:",
                err
              );

              return res.status(500).json({
                message:
                  "Failed to create user",
              });
            }

            return res.status(201).json({
              message:
                "User created successfully",
              userId: result.insertId,
            });
          }
        );
      } catch (error) {
        console.error(
          "Password hashing error:",
          error
        );

        return res.status(500).json({
          message: "Something went wrong",
        });
      }
    }
  );
};

// =========================
// GET ALL USERS
// =========================
const getUsers = (req, res) => {
  const filters = {
    name: req.query.name || "",
    email: req.query.email || "",
    address: req.query.address || "",
    role: req.query.role || "",
    sortBy: req.query.sortBy || "id",
    order: req.query.order || "DESC",
  };

  getAllUsersForAdmin(
    filters,
    (err, results) => {
      if (err) {
        console.error(
          "Get users error:",
          err
        );

        return res.status(500).json({
          message: "Failed to get users",
        });
      }

      // Return array directly
      return res.status(200).json(results);
    }
  );
};

// =========================
// GET USER DETAILS BY ADMIN
// =========================
const getUserDetailsByAdmin = (
  req,
  res
) => {
  const userId = req.params.id;

  // Get user information
  getUserDetails(
    userId,
    (userError, users) => {
      if (userError) {
        console.error(
          "Get user details error:",
          userError
        );

        return res.status(500).json({
          message:
            "Failed to get user details",
        });
      }

      // User not found
      if (users.length === 0) {
        return res.status(404).json({
          message: "User not found",
        });
      }

      const user = users[0];

      // =========================
      // NORMAL USER / ADMIN
      // =========================
      if (user.role !== "owner") {
        return res.status(200).json({
          user,
        });
      }

      // =========================
      // STORE OWNER
      // =========================
      getOwnerStoreDetails(
        user.id,
        (storeError, stores) => {
          if (storeError) {
            console.error(
              "Get owner store error:",
              storeError
            );

            return res.status(500).json({
              message:
                "Failed to get owner store details",
            });
          }

          // Owner has no store
          if (stores.length === 0) {
            return res.status(200).json({
              user,
              store: null,
              ratings: [],
            });
          }

          const store = stores[0];

          // Get users who rated this store
          getStoreRaters(
            store.id,
            (ratingError, ratings) => {
              if (ratingError) {
                console.error(
                  "Get store ratings error:",
                  ratingError
                );

                return res.status(500).json({
                  message:
                    "Failed to get store ratings",
                });
              }

              return res.status(200).json({
                user,
                store,
                ratings,
              });
            }
          );
        }
      );
    }
  );
};

// =========================
// EXPORTS
// =========================
module.exports = {
  getDashboardStats,
  addUser,
  getUsers,
  getUserDetailsByAdmin,
};