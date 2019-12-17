const express = require('express');

const {
  getBootcamps,
  getBootcamp,
  createBootcamp,
  updateBootcamp,
  deleteBootcamp,
  getBootcampsInRadius,
  uploadBootcampPhoto
} = require('../controllers/bootcamps');

const router = express.Router();

// Include other resources router
const CoursesRouter = require('./courses');

const Bootcamp = require('../models/Bootcamp');
const advancedResult = require('../middleware/advancedResult');

// Import protect private router middleware
const { protect } = require('../middleware/auth');

// Re-router to other resource router
router.use('/:bootcampId/courses', CoursesRouter);

router
  .route('/')
  .get(
    advancedResult(Bootcamp, {
      path: 'courses',
      select: 'title description'
    }),
    getBootcamps
  )
  .post(protect, createBootcamp);

router
  .route('/:id')
  .get(getBootcamp)
  .put(protect, updateBootcamp)
  .delete(protect, deleteBootcamp);

router.route('/radius/:city/:distance').get(getBootcampsInRadius);

router.route('/:id/photo').put(protect, uploadBootcampPhoto);

module.exports = router;
