const db = require("../config/db");

// =========================
// TOTAL USERS
// =========================
const getTotalUsers = (callback) => {
  const sql = `
    SELECT COUNT(*) AS totalUsers
    FROM users
  `;

  db.query(sql, callback);
};

// =========================
// TOTAL STORES
// =========================
const getTotalStores = (callback) => {
  const sql = `
    SELECT COUNT(*) AS totalStores
    FROM stores
  `;

  db.query(sql, callback);
};

// =========================
// TOTAL RATINGS
// =========================
const getTotalRatings = (callback) => {
  const sql = `
    SELECT COUNT(*) AS totalRatings
    FROM ratings
  `;

  db.query(sql, callback);
};

// =========================
// CREATE USER BY ADMIN
// =========================
const createUserByAdmin = (userData, callback) => {
  const {
    name,
    email,
    password,
    address,
    role,
  } = userData;

  const sql = `
    INSERT INTO users
    (name, email, password, address, role)
    VALUES (?, ?, ?, ?, ?)
  `;

  db.query(
    sql,
    [name, email, password, address, role],
    callback
  );
};

// =========================
// GET ALL USERS FOR ADMIN
// =========================
const getAllUsersForAdmin = (filters, callback) => {
  let sql = `
    SELECT
      id,
      name,
      email,
      address,
      role,
      created_at
    FROM users
    WHERE 1 = 1
  `;

  const values = [];

  // Search by name
  if (filters.name) {
    sql += ` AND name LIKE ?`;
    values.push(`%${filters.name}%`);
  }

  // Search by email
  if (filters.email) {
    sql += ` AND email LIKE ?`;
    values.push(`%${filters.email}%`);
  }

  // Search by address
  if (filters.address) {
    sql += ` AND address LIKE ?`;
    values.push(`%${filters.address}%`);
  }

  // Filter by role
  if (filters.role) {
    sql += ` AND role = ?`;
    values.push(filters.role);
  }

  // Allowed sorting fields
  const allowedSortFields = [
    "id",
    "name",
    "email",
    "address",
    "role",
    "created_at",
  ];

  const sortBy = allowedSortFields.includes(filters.sortBy)
    ? filters.sortBy
    : "id";

  // Sorting order
  const sortOrder =
    filters.order?.toUpperCase() === "ASC"
      ? "ASC"
      : "DESC";

  sql += ` ORDER BY ${sortBy} ${sortOrder}`;

  db.query(sql, values, callback);
};

// =========================
// GET USER DETAILS
// =========================
const getUserDetails = (userId, callback) => {
  const sql = `
    SELECT
      id,
      name,
      email,
      address,
      role,
      created_at
    FROM users
    WHERE id = ?
  `;

  db.query(sql, [userId], callback);
};

// =========================
// GET OWNER STORE DETAILS
// =========================
const getOwnerStoreDetails = (ownerId, callback) => {
  const sql = `
    SELECT
      s.id,
      s.name,
      s.email,
      s.address,
      COALESCE(AVG(r.rating), 0) AS average_rating,
      COUNT(r.id) AS total_ratings
    FROM stores s
    LEFT JOIN ratings r
      ON s.id = r.store_id
    WHERE s.owner_id = ?
    GROUP BY
      s.id,
      s.name,
      s.email,
      s.address
  `;

  db.query(sql, [ownerId], callback);
};

// =========================
// GET STORE RATERS
// =========================
const getStoreRaters = (storeId, callback) => {
  const sql = `
    SELECT
      u.id,
      u.name,
      u.email,
      r.rating,
      r.created_at,
      r.updated_at
    FROM ratings r
    INNER JOIN users u
      ON r.user_id = u.id
    WHERE r.store_id = ?
    ORDER BY r.updated_at DESC
  `;

  db.query(sql, [storeId], callback);
};

// =========================
// EXPORTS
// =========================
module.exports = {
  getTotalUsers,
  getTotalStores,
  getTotalRatings,
  createUserByAdmin,
  getAllUsersForAdmin,
  getUserDetails,
  getOwnerStoreDetails,
  getStoreRaters,
};