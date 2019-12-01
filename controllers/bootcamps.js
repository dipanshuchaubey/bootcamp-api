const Bootcamp = require('../models/Bootcamp');
const ErrorResponse = require('../utils/ErrorResponse');
const asyncHandler = require('../middleware/asyncHandler');

/**
 * Fetch all the bootcamps
 * @desc        Get all bootcamps
 * @route       /api/v1/bootcamps
 * @access      Public
 */

exports.getBootcamps = asyncHandler(async (req, res, next) => {
  const bootcamps = await Bootcamp.find();

  res
    .status(200)
    .json({ success: true, response: bootcamps.length, data: bootcamps });
});

/**
 * @desc        Get single bootcamp
 * @route       /api/v1/bootcamps/:id
 * @access      Public
 */

exports.getBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findById(req.params.id);

  if (!bootcamp) {
    return next(
      new ErrorResponse(`Bootcamp not found with id : ${req.params.id}`, 404)
    );
  }

  res.status(200).json({ success: true, data: bootcamp });
});

/**
 * @desc        create new bootcamp
 * @route       /api/v1/bootcamps
 * @access      Private
 */

exports.createBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamps = await Bootcamp.create(req.body);

  res.status(201).json({ success: true, data: bootcamps });
});

/**
 * @desc        Update bootcamp
 * @route       /api/v1/bootcamps/:id
 * @access      Private
 */

exports.updateBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  if (!bootcamp) {
    return next(
      new ErrorResponse(`Bootcamp not found with id : ${req.params.id}`, 404)
    );
  }

  res.status(201).json({ success: true, data: bootcamp });
});

/**
 * @desc        Delete bootcamp
 * @route       /api/v1/bootcamps/:id
 * @access      Private
 */

exports.deleteBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findByIdAndDelete(req.params.id);

  if (!bootcamp) {
    return next(
      new ErrorResponse(`Bootcamp not found with id : ${req.params.id}`, 404)
    );
  }

  res.status(200).json({ success: true, data: 'Deleted successfully' });
});
