const db = require("../config/db");

// CHECK STORE EXISTS
const findStoreById = (storeId, callback) => {
  const sql = `
    SELECT id
    FROM stores
    WHERE id = ?
  `;

  db.query(sql, [storeId], callback);
};

// CHECK USER'S EXISTING RATING
const findUserRating = (userId, storeId, callback) => {
  const sql = `
    SELECT id, rating
    FROM ratings
    WHERE user_id = ? AND store_id = ?
  `;

  db.query(sql, [userId, storeId], callback);
};

// CREATE RATING
const createRating = (userId, storeId, rating, callback) => {
  const sql = `
    INSERT INTO ratings (user_id, store_id, rating)
    VALUES (?, ?, ?)
  `;

  db.query(sql, [userId, storeId, rating], callback);
};

// UPDATE RATING
const updateRating = (ratingId, rating, callback) => {
  const sql = `
    UPDATE ratings
    SET rating = ?, updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `;

  db.query(sql, [rating, ratingId], callback);
};

module.exports = {
  findStoreById,
  findUserRating,
  createRating,
  updateRating,
};