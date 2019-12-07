const express = require('express');

const {
  getBootcamps,
  getBootcamp,
  createBootcamp,
  updateBootcamp,
  deleteBootcamp,
  getBootcampsInRadius
} = require('../controllers/bootcamps');

// Include other resources router
const CoursesRouter = require('./courses');

const router = express.Router();

// Re-router to other resource router
router.use('/:bootcampId/courses', CoursesRouter);

router
  .route('/')
  .get(getBootcamps)
  .post(createBootcamp);

router
  .route('/:id')
  .get(getBootcamp)
  .put(updateBootcamp)
  .delete(deleteBootcamp);

router.route('/radius/:city/:distance').get(getBootcampsInRadius);

module.exports = router;
