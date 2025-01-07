const dbConnection = require("../config/db");

const getAllReviews = (callback) => {
  const sql = "SELECT * FROM review";
  dbConnection.query(sql, (err, data) => {
    if (err) {
      callback(err, null);
    } else {
      callback(null, data);
    }
  });
};

const getReviewById = (reviewId, callback) => {
  const sql = "SELECT * FROM review WHERE `review_id` = ?";
  dbConnection.query(sql, [reviewId], (err, data) => {
    if (err) {
      callback(err, null);
    } else {
      callback(null, data);
    }
  });
};

const updateReview = (reviewId, reviewData, callback) => {
  const { reviewComment, reviewProduct, reviewCustomer, reviewSO, reviewSOI } =
    reviewData;

  const sql = `
    UPDATE review
    SET
    review_comment = ?,
    product_id_fk = ?,
    customer_account_id_fk = ?,
    sales_order_id_fk = ?,
    sales_order_item_id_fk = ?
    WHERE review_id = ?
  `;
  const values = [
    reviewComment,
    reviewProduct,
    reviewCustomer,
    reviewSO,
    reviewSOI,
    reviewId,
  ];

  dbConnection.query(sql, values, (err, data) => {
    if (err) {
      callback(err, null);
    } else {
      callback(null, data);
    }
  });
};

const deleteReviewById = (reviewId, callback) => {
  const sql = "DELETE FROM review WHERE `review_id` = ?";
  dbConnection.query(sql, [reviewId], (err, data) => {
    if (err) {
      callback(err, null);
    } else {
      callback(null, data);
    }
  });
};

module.exports = {
  getAllReviews,
  getReviewById,
  updateReview,
  deleteReviewById,
};
