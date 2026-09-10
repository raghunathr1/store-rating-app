const db = require("../config/db");

// =========================
// GET STORES FOR NORMAL USER
// =========================
const getStoresForUser = (userId, filters, callback) => {
  let sql = `
    SELECT
      s.id,
      s.name,
      s.address,

      COALESCE(AVG(allRatings.rating), 0) AS overallRating,

      myRating.rating AS userRating

    FROM stores s

    LEFT JOIN ratings allRatings
      ON s.id = allRatings.store_id

    LEFT JOIN ratings myRating
      ON s.id = myRating.store_id
      AND myRating.user_id = ?

    WHERE 1 = 1
  `;

  const values = [userId];

  // Search by store name
  if (filters.name) {
    sql += ` AND s.name LIKE ?`;
    values.push(`%${filters.name}%`);
  }

  // Search by address
  if (filters.address) {
    sql += ` AND s.address LIKE ?`;
    values.push(`%${filters.address}%`);
  }

  sql += `
    GROUP BY
      s.id,
      s.name,
      s.address,
      myRating.rating
  `;

  // Allowed sorting fields
  const allowedSortFields = [
    "id",
    "name",
    "address",
    "overallRating",
  ];

  const sortBy = allowedSortFields.includes(filters.sortBy)
    ? filters.sortBy
    : "id";

  const sortOrder =
    filters.order?.toUpperCase() === "ASC"
      ? "ASC"
      : "DESC";

  if (sortBy === "overallRating") {
    sql += ` ORDER BY overallRating ${sortOrder}`;
  } else {
    sql += ` ORDER BY s.${sortBy} ${sortOrder}`;
  }

  db.query(sql, values, callback);
};

module.exports = {
  getStoresForUser,
};