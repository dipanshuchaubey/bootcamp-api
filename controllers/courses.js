const Course = require('../models/Course');
const Bootcamp = require('../models/Bootcamp');
const asyncHandler = require('../middleware/asyncHandler');
const ErrorResponse = require('../utils/ErrorResponse');

/**
 * @desc        Get courses
 * @route       GET /api/v1/courses
 * @route       GET /api/v1/bootcamp/:bootcampId/courses
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

/**
 * @desc        Get a single course
 * @route       GET /api/v1/courses/:id
 * @access      Public
 */

exports.getSingleCourse = asyncHandler(async (req, res, next) => {
  const course = await Course.findById(req.params.id);

  if (!course) {
    return next(new ErrorResponse('Course does not exists', 404));
  }

  res.status(200).json({ success: true, data: course });
});

/**
 * @desc        Create a course
 * @route       POST /api/v1/bootcamp/:bootcampId/courses
 * @access      Private
 */

exports.createCourse = asyncHandler(async (req, res, next) => {
  // Set bootcamp equals to bootcampId as passed into params
  req.body.bootcamp = req.params.bootcampId;

  // Check if bootcamp exists
  const bootcamp = await Bootcamp.findById(req.params.bootcampId);

  if (!bootcamp) {
    return next(new ErrorResponse('Bootcamp does not exists', 404));
  }

  // Check if user is owner of bootcamp in which course
  // is been added
  if (bootcamp.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        'You dont own the bootcamp in which you are trying to add the course',
        403
      )
    );
  }

  // Add user field in course table
  req.body.user = bootcamp.user;

  const course = await Course.create(req.body);

  res.status(201).json({ success: true, data: course });
});

/**
 * @desc        Update a course
 * @route       PUT /api/v1/courses/:id
 * @access      Private
 */

exports.updateCourse = asyncHandler(async (req, res, next) => {
  let course = await Course.findById(req.params.id);

  if (!course) {
    return next(new ErrorResponse('Course doest not exists', 404));
  }

  // Check if user is owner of course
  if (course.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        'You dont own the course that you are trying to update',
        403
      )
    );
  }

  course = await Course.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.status(201).json({ success: true, data: course });
});

/**
 * @desc        Delete a course
 * @route       Delete /api/v1/courses/:id
 * @access      Private
 */

exports.deleteCourse = asyncHandler(async (req, res, next) => {
  const course = await Course.findById(req.params.id);

  if (!course) {
    return next(new ErrorResponse('Course does not exists', 404));
  }

  // Check if user is owner of course
  if (course.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        'You dont own the course that you are trying to update',
        403
      )
    );
  }

  await course.remove();

  res.status(200).json({ success: true, data: 'Course deleted successfully' });
});
