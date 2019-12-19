const path = require('path');
const Bootcamp = require('../models/Bootcamp');
const geocoder = require('../utils/geocoder');
const ErrorResponse = require('../utils/ErrorResponse');
const asyncHandler = require('../middleware/asyncHandler');
/**
 * Fetch all the bootcamps
 * @desc        Get all bootcamps
 * @route       GET /api/v1/bootcamps
 * @access      Public
 */

exports.getBootcamps = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResult);
});

/**
 * @desc        Get single bootcamp
 * @route       GET /api/v1/bootcamps/:id
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
 * @route       GET /api/v1/bootcamps/redius/:zipcode/:distance
 * @access      Public
 */
exports.getBootcampsInRadius = asyncHandler(async (req, res, next) => {
  const { city, distance } = req.params;

  const radius = distance / 3963;

  const loc = await geocoder.geocode(city);

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
 * @route       POST /api/v1/bootcamps
 * @access      Private
 */

exports.createBootcamp = asyncHandler(async (req, res, next) => {
  // Put userId into body
  req.body.user = req.user.id;

  const published = await Bootcamp.findOne({ user: req.user.id });

  if (published && req.user.role !== 'admin') {
    return next(
      new ErrorResponse('You cannot publish more than 1 bootcamp', 401)
    );
  }

  const bootcamps = await Bootcamp.create(req.body);

  res.status(201).json({ success: true, data: bootcamps });
});

/**
 * @desc        Update bootcamp
 * @route       PUT /api/v1/bootcamps/:id
 * @access      Private
 */

exports.updateBootcamp = asyncHandler(async (req, res, next) => {
  let bootcamp = await Bootcamp.findById(req.params.id);

  if (!bootcamp) {
    return next(
      new ErrorResponse(`Bootcamp not found with id : ${req.params.id}`, 404)
    );
  }

  // Check current user is the owner of the bootcamp
  if (bootcamp.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(
      new ErrorResponse('You cannot update the bootcamp that you dont own', 403)
    );
  }

  bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.status(201).json({ success: true, data: bootcamp });
});

/**
 * @desc        Delete bootcamp
 * @route       DELETE /api/v1/bootcamps/:id
 * @access      Private
 */

exports.deleteBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findById(req.params.id);

  if (!bootcamp) {
    return next(
      new ErrorResponse(`Bootcamp not found with id : ${req.params.id}`, 404)
    );
  }

  // Check current user is the owner of the bootcamp
  if (bootcamp.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(
      new ErrorResponse('You cannot update the bootcamp that you dont own', 403)
    );
  }

  await bootcamp.remove();

  res.status(200).json({ success: true, data: 'Deleted successfully' });
});

/**
 * @desc        Add bootcamp image
 * @route       PUT /api/v1/bootcamps/:id/image
 * @access      Private
 */

exports.uploadBootcampPhoto = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findById(req.params.id);

  if (!bootcamp) {
    return next(new ErrorResponse('Bootcamp does not exists', 400));
  }

  // Check current user is the owner of the bootcamp

  if (bootcamp.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(
      new ErrorResponse('You cannot update the bootcamp that you dont own', 403)
    );
  }

  const file = req.files.file;

  if (!file) {
    return next(new ErrorResponse('Please upload a photo', 404));
  }

  // Check if uploaded file is image
  if (!file.mimetype.startsWith('image')) {
    return next(new ErrorResponse('Please a file type image', 400));
  }

  // Check file size
  if (file.size > process.env.MAX_FILE_UPLOAD_SIZE) {
    return next(
      new ErrorResponse(
        `Image size should be less ${process.env.MAX_FILE_UPLOAD_SIZE}`,
        400
      )
    );
  }

  // Set custom file name
  file.name = `photo_${bootcamp._id}${path.extname(file.name)}`;

  file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async err => {
    try {
      await Bootcamp.findByIdAndUpdate(req.params.id, { photo: file.name });

      res.status(200).json({
        success: true,
        data: `Photo ${file.name} uploaded successfully`
      });
    } catch (err) {
      return next(
        new ErrorResponse('Error - Problem with uploading file', 500)
      );
    }
  });
});
