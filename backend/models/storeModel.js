const db = require("../config/db");

// =========================
// CREATE STORE
// =========================
const createStore = (storeData, callback) => {
  const {
    name,
    email,
    address,
    owner_id,
  } = storeData;

  const sql = `
    INSERT INTO stores
    (name, email, address, owner_id)
    VALUES (?, ?, ?, ?)
  `;

  db.query(
    sql,
    [name, email, address, owner_id],
    callback
  );
};

// =========================
// FIND STORE BY EMAIL
// =========================
const findStoreByEmail = (email, callback) => {
  const sql = `
    SELECT *
    FROM stores
    WHERE email = ?
  `;

  db.query(sql, [email], callback);
};

// =========================
// GET ALL STORES
// =========================
const getAllStores = (filters, callback) => {
  let sql = `
    SELECT
      s.id,
      s.name,
      s.email,
      s.address,
      s.owner_id,
      COALESCE(AVG(r.rating), 0) AS rating,
      s.created_at
    FROM stores s
    LEFT JOIN ratings r
      ON s.id = r.store_id
    WHERE 1 = 1
  `;

  const values = [];

  // Search by name
  if (filters.name) {
    sql += ` AND s.name LIKE ?`;
    values.push(`%${filters.name}%`);
  }

  // Search by email
  if (filters.email) {
    sql += ` AND s.email LIKE ?`;
    values.push(`%${filters.email}%`);
  }

  // Search by address
  if (filters.address) {
    sql += ` AND s.address LIKE ?`;
    values.push(`%${filters.address}%`);
  }

  sql += ` GROUP BY s.id`;

  // Allowed sorting fields
  const allowedSortFields = [
    "id",
    "name",
    "email",
    "address",
    "rating",
    "created_at",
  ];

  const sortBy = allowedSortFields.includes(filters.sortBy)
    ? filters.sortBy
    : "id";

  const sortOrder =
    filters.order?.toUpperCase() === "ASC"
      ? "ASC"
      : "DESC";

  if (sortBy === "rating") {
    sql += ` ORDER BY rating ${sortOrder}`;
  } else {
    sql += ` ORDER BY s.${sortBy} ${sortOrder}`;
  }

  db.query(sql, values, callback);
};

module.exports = {
  createStore,
  findStoreByEmail,
  getAllStores,
};