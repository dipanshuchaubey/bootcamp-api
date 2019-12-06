const Bootcamp = require('../models/Bootcamp');
const geocoder = require('../utils/geocoder');
const ErrorResponse = require('../utils/ErrorResponse');
const asyncHandler = require('../middleware/asyncHandler');

/**
 * Fetch all the bootcamps
 * @desc        Get all bootcamps
 * @route       /api/v1/bootcamps
 * @access      Public
 */

exports.getBootcamps = asyncHandler(async (req, res, next) => {
  let query;

  // Copy req.query into a variable usign spread operator
  const queryStr = { ...req.query };

  // Array for fields to be removed
  const remove = ['select', 'sort', 'page', 'limit'];

  // Remove fields from req.query
  remove.forEach(param => delete queryStr[param]);

  // Convert req.query from JSON to String
  query = JSON.stringify(queryStr);

  // Replace gte, lte, etc to $gte, $lte, etc
  query = query.replace(/gt|gte|lt|lte|in/g, match => `$${match}`);

  // Convert the query string into JSON Object
  let result = Bootcamp.find(JSON.parse(query));

  // Select query Logic
  if (req.query.select) {
    const advQuery = req.query.select.split(',').join(' ');
    result = result.select(advQuery);
  }

  // Sort query Logic
  if (req.query.sort) {
  }

  // Pagination
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const startIndex = (page - 1) * limit;
  const endIndex = limit * page;
  const total = await Bootcamp.countDocuments();

  // Pagination Result
  let pagination = {};

  if (endIndex < total) {
    pagination.next = {
      page: page + 1,
      limit
    };
  }

  if (startIndex > 0) {
    pagination.previous = {
      page: page - 1,
      limit
    };
  }

  query = result.skip(startIndex).limit(limit);

  const bootcamps = await result;

  res.status(200).json({
    success: true,
    count: bootcamps.length,
    pagination,
    data: bootcamps
  });
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
 * @desc        Get bootcamp within a redius
 * @route       /api/v1/bootcamps/redius/:zipcode/:distance
 * @access      Public
 */
exports.getBootcampsInRadius = asyncHandler(async (req, res, next) => {
  const { city, distance } = req.params;

  const radius = distance / 3963;

  const loc = await geocoder.geocode(city);
  console.log(loc);

  const lat = loc[0].latitude;
  const lng = loc[0].longitude;

  const bootcamps = await Bootcamp.find({
    location: {
      $geoWithin: { $centerSphere: [[lng, lat], radius] }
    }
  });

  res
    .status(200)
    .json({ success: true, count: bootcamps.length, data: bootcamps });
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
