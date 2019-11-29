const Bootcamp = require('../models/Bootcamp');
const ErrorResponse = require('../utils/ErrorResponse');

/**
 * Fetch all the bootcamps
 * @desc        Get all bootcamps
 * @route       /api/v1/bootcamps
 * @access      Public
 */

exports.getBootcamps = async (req, res, next) => {
  try {
    const bootcamps = await Bootcamp.find();

    res
      .status(200)
      .json({ success: true, response: bootcamps.length, data: bootcamps });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc        Get single bootcamp
 * @route       /api/v1/bootcamps/:id
 * @access      Public
 */

exports.getBootcamp = async (req, res, next) => {
  try {
    const bootcamp = await Bootcamp.findById(req.params.id);

    if (!bootcamp) {
      return next(
        new ErrorResponse(`Bootcamp not found with id : ${req.params.id}`, 404)
      );
    }

    res.status(200).json({ success: true, data: bootcamp });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc        create new bootcamp
 * @route       /api/v1/bootcamps
 * @access      Private
 */

exports.createBootcamp = async (req, res, next) => {
  try {
    const bootcamps = await Bootcamp.create(req.body);

    res.status(201).json({ success: true, data: bootcamps });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc        Update bootcamp
 * @route       /api/v1/bootcamps/:id
 * @access      Private
 */

exports.updateBootcamp = async (req, res, next) => {
  try {
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
  } catch (err) {
    next(err);
  }
};

/**
 * @desc        Delete bootcamp
 * @route       /api/v1/bootcamps/:id
 * @access      Private
 */

exports.deleteBootcamp = async (req, res, next) => {
  try {
    const bootcamp = await Bootcamp.findByIdAndDelete(req.params.id);

    if (!bootcamp) {
      return next(
        new ErrorResponse(`Bootcamp not found with id : ${req.params.id}`, 404)
      );
    }

    res.status(200).json({ success: true, data: 'Deleted successfully' });
  } catch (err) {
    next(err);
  }
};
