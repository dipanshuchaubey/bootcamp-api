const Review = require('../models/Review');
const Bootcamp = require('../models/Bootcamp');
const ErrorResponse = require('../utils/ErrorResponse');
const asyncHanlder = require('../middleware/asyncHandler');

/**
 * @desc        Get reviews
 * @route       GET /api/v1/reviews
 * @route       GET /api/v1/bootcamp/:bootcampId/reviews
 * @access      Public
 */
exports.getAllReviews = asyncHanlder(async (req, res, next) => {
  let query;

  // If bootcampId is present in params
  if (req.params.bootcampId) {
    query = await Review.find({ bootcamp: req.params.bootcampId });
  } else {
    query = await Review.find();
  }

  res.status(200).json({ success: true, data: query });
});

/**
 * @desc        Get single review
 * @route       GET /api/v1/reviews
 * @access      Public
 */
exports.getSingleReview = asyncHanlder(async (req, res, next) => {
  const review = await Review.findById(req.params.id);

  if (!review) {
    return next(new ErrorResponse('Review does not exists', 404));
  }

  res.status(200).json({ success: true, data: review });
});

/**
 * @desc        Create review
 * @route       POST /api/v1/reviews
 * @access      Private
 */
exports.createReview = asyncHanlder(async (req, res, next) => {
  // Set user and bootcamp

  req.body.bootcamp = req.params.bootcampId;
  req.body.user = req.user.id;

  // Check if bootcamp exists
  const bootcamp = await Bootcamp.findById(req.params.bootcampId);

  if (!bootcamp) {
    return next(new ErrorResponse('Bootcamp does not exists', 404));
  }

  const review = await Review.create(req.body);

  res.status(201).json({ success: true, data: review });
});

/**
 * @desc        Update a review
 * @route       PUT /api/v1/reviews/:id
 * @access      Private
 */
exports.updateReview = asyncHanlder(async (req, res, next) => {
  let review = await Review.findById(req.params.id);

  if (!review) {
    return next(new ErrorResponse('Review does not exists', 404));
  }

  // Check for owner of review
  if (review.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        'You are unauthorized to update as you are not the author of review',
        401
      )
    );
  }

  review = await Review.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.status(200).json({ success: true, data: review });
});

/**
 * @desc        Delete a review
 * @route       DELETE /api/v1/reviews/:id
 * @access      Private
 */
exports.deleteReview = asyncHanlder(async (req, res, next) => {
  let review = await Review.findById(req.params.id);

  if (!review) {
    return next(new ErrorResponse('Review does not exists', 404));
  }

  // Check for owner of review
  if (review.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        'You are unauthorized to update as you are not the author of review',
        401
      )
    );
  }

  await review.remove(req.params.id);

  res.status(200).json({
    success: true,
    data: `Review with id: ${req.params.id} deleted successfully`
  });
});
