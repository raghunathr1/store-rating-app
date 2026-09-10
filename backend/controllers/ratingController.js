const {
  findStoreById,
  findUserRating,
  createRating,
  updateRating,
} = require("../models/ratingModel");

const submitRating = (req, res) => {
  const userId = req.user.id;
  const { store_id, rating } = req.body;

  // Required fields
  if (!store_id || rating === undefined) {
    return res.status(400).json({
      message: "Store ID and rating are required",
    });
  }

  // Validate rating
  const ratingNumber = Number(rating);

  if (
    !Number.isInteger(ratingNumber) ||
    ratingNumber < 1 ||
    ratingNumber > 5
  ) {
    return res.status(400).json({
      message: "Rating must be an integer between 1 and 5",
    });
  }

  // Check store exists
  findStoreById(store_id, (err, stores) => {
    if (err) {
      console.error("Find store error:", err);

      return res.status(500).json({
        message: "Database error",
      });
    }

    if (stores.length === 0) {
      return res.status(404).json({
        message: "Store not found",
      });
    }

    // Check existing rating
    findUserRating(userId, store_id, (err, existingRatings) => {
      if (err) {
        console.error("Find rating error:", err);

        return res.status(500).json({
          message: "Database error",
        });
      }

      // If rating already exists → UPDATE
      if (existingRatings.length > 0) {
        const ratingId = existingRatings[0].id;

        updateRating(ratingId, ratingNumber, (err) => {
          if (err) {
            console.error("Update rating error:", err);

            return res.status(500).json({
              message: "Failed to update rating",
            });
          }

          return res.status(200).json({
            message: "Rating updated successfully",
          });
        });

        return;
      }

      // Otherwise → CREATE
      createRating(userId, store_id, ratingNumber, (err, result) => {
        if (err) {
          console.error("Create rating error:", err);

          return res.status(500).json({
            message: "Failed to submit rating",
          });
        }

        return res.status(201).json({
          message: "Rating submitted successfully",
          ratingId: result.insertId,
        });
      });
    });
  });
};

module.exports = {
  submitRating,
};