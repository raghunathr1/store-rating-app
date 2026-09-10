const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const {
  createUser,
  findUserByEmail,
  findUserById,
  updatePassword,
} = require("../models/userModel");

// =========================
// SIGNUP
// =========================
const signup = (req, res) => {
  const { name, email, password, address } = req.body;

  // Check required fields
  if (!name || !email || !password || !address) {
    return res.status(400).json({
      message: "All fields are required",
    });
  }

  const trimmedName = name.trim();
  const trimmedEmail = email.trim().toLowerCase();
  const trimmedAddress = address.trim();

  // Name validation
  if (trimmedName.length < 20 || trimmedName.length > 60) {
    return res.status(400).json({
      message: "Name must be between 20 and 60 characters",
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

  // Password validation
  // 8-16 characters
  // At least one uppercase
  // At least one special character
  const passwordRegex =
    /^(?=.*[A-Z])(?=.*[^A-Za-z0-9]).{8,16}$/;

  if (!passwordRegex.test(password)) {
    return res.status(400).json({
      message:
        "Password must be 8-16 characters long and contain at least one uppercase letter and one special character",
    });
  }

  // Check if email already exists
  findUserByEmail(trimmedEmail, async (err, results) => {
    if (err) {
      console.error("Find user error:", err);

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
      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = {
        name: trimmedName,
        email: trimmedEmail,
        password: hashedPassword,
        address: trimmedAddress,
        role: "user",
      };

      createUser(newUser, (err, result) => {
        if (err) {
          console.error("Create user error:", err);

          return res.status(500).json({
            message: "Failed to create user",
          });
        }

        return res.status(201).json({
          message: "User registered successfully",
          userId: result.insertId,
        });
      });
    } catch (error) {
      console.error("Password hashing error:", error);

      return res.status(500).json({
        message: "Something went wrong",
      });
    }
  });
};

// =========================
// LOGIN
// =========================
const login = (req, res) => {
  const { email, password } = req.body;

  // Required fields
  if (!email || !password) {
    return res.status(400).json({
      message: "Email and password are required",
    });
  }

  const trimmedEmail = email.trim().toLowerCase();

  findUserByEmail(trimmedEmail, async (err, results) => {
    if (err) {
      console.error("Login database error:", err);

      return res.status(500).json({
        message: "Database error",
      });
    }

    // User not found
    if (results.length === 0) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const user = results[0];

    try {
      // Compare password
      const isPasswordCorrect = await bcrypt.compare(
        password,
        user.password
      );

      if (!isPasswordCorrect) {
        return res.status(401).json({
          message: "Invalid email or password",
        });
      }

      // Create JWT
      const token = jwt.sign(
        {
          id: user.id,
          role: user.role,
        },
        process.env.JWT_SECRET,
        {
          expiresIn: "1d",
        }
      );

      return res.status(200).json({
        message: "Login successful",
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      });
    } catch (error) {
      console.error("Login error:", error);

      return res.status(500).json({
        message: "Something went wrong",
      });
    }
  });
};
const changePassword = async (req, res) => {
  const userId = req.user.id;

  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return res.status(400).json({
      message: "Current password and new password are required",
    });
  }

  // Password validation
  const passwordRegex = /^(?=.*[A-Z])(?=.*[^A-Za-z0-9]).{8,16}$/;

  if (!passwordRegex.test(newPassword)) {
    return res.status(400).json({
      message:
        "New password must be 8-16 characters long and contain at least one uppercase letter and one special character",
    });
  }

  findUserById(userId, async (err, results) => {
    if (err) {
      console.error("Find user error:", err);

      return res.status(500).json({
        message: "Database error",
      });
    }

    if (results.length === 0) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // We need password, so find complete user by email
    findUserByEmail(results[0].email, async (err, users) => {
      if (err) {
        console.error("Find user password error:", err);

        return res.status(500).json({
          message: "Database error",
        });
      }

      if (users.length === 0) {
        return res.status(404).json({
          message: "User not found",
        });
      }

      const user = users[0];

      try {
        const isCurrentPasswordCorrect = await bcrypt.compare(
          currentPassword,
          user.password
        );

        if (!isCurrentPasswordCorrect) {
          return res.status(401).json({
            message: "Current password is incorrect",
          });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        updatePassword(userId, hashedPassword, (err) => {
          if (err) {
            console.error("Update password error:", err);

            return res.status(500).json({
              message: "Failed to update password",
            });
          }

          return res.status(200).json({
            message: "Password changed successfully",
          });
        });
      } catch (error) {
        console.error("Change password error:", error);

        return res.status(500).json({
          message: "Something went wrong",
        });
      }
    });
  });
};
module.exports = {
  signup,
  login,
  changePassword,
};