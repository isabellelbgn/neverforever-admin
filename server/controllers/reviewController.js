const Review = require("../models/reviewModel");

const getReviews = (req, res) => {
  Review.getAllReviews((err, data) => {
    if (err) {
      console.error("Error querying the database:", err);
      return res.status(500).json({ error: "Internal server error" });
    }
    return res.json(data);
  });
};

const getReviewById = (req, res) => {
  const reviewId = req.params.id;
  Review.getReviewById(reviewId, (err, data) => {
    if (err) {
      console.error("Error fetching review:", err);
      return res.status(500).json({ error: "Internal server error" });
    }
    if (data.length === 0) {
      return res.status(404).json({ error: "Review not found" });
    }
    return res.json(data[0]);
  });
};

const updateReview = (req, res) => {
  const reviewId = req.params.id;
  const reviewData = req.body;

  Review.updateReview(reviewId, reviewData, (err, data) => {
    if (err) {
      console.error("Error updating review:", err);
      return res.status(500).json({ error: "Internal server error" });
    }
    return res.json("Review has been updated successfully.");
  });
};

const deleteReview = (req, res) => {
  const reviewId = req.params.id;
  Review.deleteReviewById(reviewId, (err, data) => {
    if (err) {
      console.error("Error deleting review:", err);
      return res.status(500).json({ error: "Internal server error" });
    }
    return res.json("Review has been deleted successfully.");
  });
};

module.exports = {
  getReviews,
  getReviewById,
  updateReview,
  deleteReview,
};
