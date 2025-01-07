const express = require("express");
const router = express.Router();
const reviewController = require("../controllers/reviewController");

router.get("/reviews", reviewController.getReviews);
router.get("/reviews/:id", reviewController.getReviewById);
router.put("/reviews/update/:id", reviewController.updateReview);
router.delete("/reviews/:id", reviewController.deleteReview);

module.exports = router;
