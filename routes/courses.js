const express = require('express');
const {
  getCourses,
  getSingleCourse,
  createCourse,
  updateCourse,
  deleteCourse
} = require('../controllers/courses');

// Import protect route middleware
const { protect } = require('../middleware/auth');

const router = express.Router({ mergeParams: true });

router
  .route('/')
  .get(getCourses)
  .post(protect, createCourse);

router
  .route('/:id')
  .get(getSingleCourse)
  .put(protect, updateCourse)
  .delete(protect, deleteCourse);

module.exports = router;
