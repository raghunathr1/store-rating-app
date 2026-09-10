const db = require("../config/db");

// GET STORE OWNER DASHBOARD
const getOwnerDashboard = (ownerId, callback) => {
  const sql = `
    SELECT
      s.id AS store_id,
      s.name AS store_name,
      s.email AS store_email,
      s.address AS store_address,
      COALESCE(AVG(r.rating), 0) AS average_rating,
      COUNT(r.id) AS total_ratings
    FROM stores s
    LEFT JOIN ratings r
      ON s.id = r.store_id
    WHERE s.owner_id = ?
    GROUP BY s.id
  `;

  db.query(sql, [ownerId], callback);
};

// GET USERS WHO RATED OWNER'S STORE
const getStoreRaters = (ownerId, callback) => {
  const sql = `
    SELECT
      u.id AS user_id,
      u.name AS user_name,
      u.email AS user_email,
      s.name AS store_name,
      r.rating,
      r.created_at,
      r.updated_at
    FROM stores s
    INNER JOIN ratings r
      ON s.id = r.store_id
    INNER JOIN users u
      ON r.user_id = u.id
    WHERE s.owner_id = ?
    ORDER BY r.updated_at DESC
  `;

  db.query(sql, [ownerId], callback);
};

module.exports = {
  getOwnerDashboard,
  getStoreRaters,
};