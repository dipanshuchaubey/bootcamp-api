const express = require('express');
const User = require('../models/User');
const {
  getAllUsers,
  getSingleUser,
  createUser,
  updateUser,
  deleteUser
} = require('../controllers/users');

router = express.Router();

// Import middleware
const { protect, authorize } = require('../middleware/auth');
const advancedResult = require('../middleware/advancedResult');

// Mount middleware here so they will be available for all
router.use(protect);
router.use(authorize('admin'));

router
  .route('/')
  .get(advancedResult(User), getAllUsers)
  .post(createUser);

router
  .route('/:id')
  .get(getSingleUser)
  .put(updateUser)
  .delete(deleteUser);

module.exports = router;
