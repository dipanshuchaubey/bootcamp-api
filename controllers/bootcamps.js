const Bootcamp = require('../models/Bootcamp');

// @desc        Get all bootcamps
// @route       /api/v1/bootcamps
// @access      Public

exports.getBootcamps = async (req, res, next) => {
  try {
    const bootcamps = await Bootcamp.find();

    res.status(200).json({ success: true, data: bootcamps });
  } catch (err) {
    res.status(400).json({ success: false, data: 'Bad request' });
  }
};

// @desc        Get single bootcamp
// @route       /api/v1/bootcamps/:id
// @access      Public

exports.getBootcamp = async (req, res, next) => {
  try {
    const bootcamp = await Bootcamp.findById(req.params.id);

    if (!bootcamp) {
      return res
        .status(400)
        .json({ success: false, data: 'No bootcamp found' });
    }

    res.status(200).json({ success: true, data: bootcamp });
  } catch (err) {
    res.status(400).json({ success: false, data: 'No bootcamp found' });
  }
};

// @desc        create new bootcamp
// @route       /api/v1/bootcamps
// @access      Private

exports.createBootcamp = async (req, res, next) => {
  try {
    const bootcamps = await Bootcamp.create(req.body);

    res.status(201).json({ success: true, data: bootcamps });
  } catch (err) {
    res.status(400).json({ success: false, data: 'Bad request' });
  }
};

// @desc        Update bootcamp
// @route       /api/v1/bootcamps/:id
// @access      Private

exports.updateBootcamp = async (req, res, next) => {
  try {
    const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!bootcamp) {
      return res.status(400).json({ success: false, data: 'Bad Request' });
    }

    res.status(201).json({ success: true, data: bootcamp });
  } catch (err) {
    res.status(400).json({ success: false, data: 'Bad Request' });
  }
};

// @desc        Delete bootcamp
// @route       /api/v1/bootcamps/:id
// @access      Private

exports.deleteBootcamp = async (req, res, next) => {
  try {
    const bootcamp = await Bootcamp.findByIdAndDelete(req.params.id);

    if (!bootcamp) {
      return res.status(400).json({ success: false, data: 'Bad request' });
    }

    res.status(200).json({ success: true, data: 'Deleted successfully' });
  } catch (err) {
    res.status(400).json({ success: false, data: 'Bad request' });
  }
};
