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
  .post(createBootcamp);

router
  .route('/:id')
  .get(getBootcamp)
  .put(updateBootcamp)
  .delete(deleteBootcamp);

router.route('/radius/:city/:distance').get(getBootcampsInRadius);

router.route('/:id/photo').put(uploadBootcampPhoto);

module.exports = router;
