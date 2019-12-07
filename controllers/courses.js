const Course = require('../models/Course');
const asyncHandler = require('../middleware/asyncHandler');

/**
 * @desc        Get courses
 * @route       /api/v1/courses
 * @route       /api/v1/bootcamp/:bootcampId/courses
 * @access      Public
 */

exports.getCourses = asyncHandler(async (req, res, next) => {
  let query;

  // If bootcampId is provided then show all courses
  // for that specific bootcamp
  if (req.params.bootcampId) {
    query = Course.find({ bootcamp: req.params.bootcampId });
  }
  // Else show courses of all bootcamps
  else {
    query = Course.find().populate({
      path: 'bootcamp',
      select: 'name description'
    });
  }

  const courses = await query;

  res.status(200).json({ success: true, count: courses.length, data: courses });
});
