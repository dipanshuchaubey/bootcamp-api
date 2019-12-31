const express = require('express');
const Review = require('../models/Review');
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
const advancedResult = require('../middleware/advancedResult');

router
  .route('/')
  .get(
    advancedResult(Review, {
      path: 'bootcamp',
      select: 'name description'
    }),
    getAllReviews
  )
  .post(protect, authorize('user', 'admin'), createReview);

router
  .route('/:id')
  .get(getSingleReview)
  .put(protect, authorize('user', 'admin'), updateReview)
  .delete(protect, authorize('user', 'admin'), deleteReview);

module.exports = router;
