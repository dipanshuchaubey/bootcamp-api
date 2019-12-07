const Course = require('../models/Course');
const ErrorResponse = require('../utils/ErrorResponse');
const asyncHandler = require('../middleware/asyncHandler');

exports.getCourses = asyncHandler(async (req, res, next) => {
  const courses = await Course.find();

  res.status(200).json({ success: true, count: courses.length, data: courses });
});
