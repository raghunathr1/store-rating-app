const db = require("../config/db");

// Create a new user
const createUser = (userData, callback) => {
  const { name, email, password, address, role } = userData;

  const sql = `
    INSERT INTO users (name, email, password, address, role)
    VALUES (?, ?, ?, ?, ?)
  `;

  db.query(
    sql,
    [name, email, password, address, role || "user"],
    callback
  );
};

// Find user by email
const findUserByEmail = (email, callback) => {
  const sql = `
    SELECT *
    FROM users
    WHERE email = ?
  `;

  db.query(sql, [email], callback);
};

// Find user by ID
const findUserById = (id, callback) => {
  const sql = `
    SELECT id, name, email, address, role, created_at
    FROM users
    WHERE id = ?
  `;

  db.query(sql, [id], callback);
};

// Get all users
const getAllUsers = (callback) => {
  const sql = `
    SELECT id, name, email, address, role, created_at
    FROM users
    ORDER BY id DESC
  `;

  db.query(sql, callback);
};
const updatePassword = (userId, hashedPassword, callback) => {
  const sql = `
    UPDATE users
    SET password = ?
    WHERE id = ?
  `;

  db.query(sql, [hashedPassword, userId], callback);
};
module.exports = {
  createUser,
  findUserByEmail,
  findUserById,
  getAllUsers,
  updatePassword,
};