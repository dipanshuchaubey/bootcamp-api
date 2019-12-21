const express = require('express');
const {
  getAllReviews,
  getSingleReview,
  createReview,
  updateReview,
  deleteReview
} = require('../controllers/reviews');

const router = express.Router({ mergeParams: true });

// Import middlewares
const { protect, authorize } = require('../middleware/auth');

router
  .route('/')
  .get(getAllReviews)
  .post(protect, authorize('user', 'publisher', 'admin'), createReview);

router
  .route('/:id')
  .get(getSingleReview)
  .put(protect, authorize('user', 'publisher', 'admin'), updateReview)
  .delete(protect, authorize('user', 'publisher', 'admin'), deleteReview);

module.exports = router;
