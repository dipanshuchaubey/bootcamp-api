const User = require('../models/User');
const asyncHandler = require('../middleware/asyncHandler');
const ErrorResponse = require('../utils/ErrorResponse');

/**
 * @desc        Get all users
 * @route       GET /api/v1/users
 * @access      Private
 */
exports.getAllUsers = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResult);
});

/**
 * @desc        Get a single user
 * @route       GET /api/v1/users/:id
 * @access      Private
 */
exports.getSingleUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    next(new ErrorResponse('User not found', 404));
  }

  res.status(200).json({ sucess: true, data: user });
});

/**
 * @desc        Delete a user
 * @route       POST /api/v1/users
 * @access      Private
 */
exports.createUser = asyncHandler(async (req, res, next) => {
  const user = await User.create(req.body);

  res.status(201).json({ sucess: true, data: user });
});

/**
 * @desc        Update a user
 * @route       PUT /api/v1/users/:id
 * @access      Private
 */
exports.updateUser = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  if (!user) {
    return next(new ErrorResponse('User not found', 404));
  }

  res.status(200).json({ sucess: true, data: user });
});

/**
 * @desc        Delete a user
 * @route       DELETE /api/v1/users/:id
 * @access      Private
 */
exports.deleteUser = asyncHandler(async (req, res, next) => {
  const user = User.findByIdAndDelete(req.params.id);

  if (!user) {
    return next(new ErrorResponse('User not found', 404));
  }

  res.status(200).json({
    sucess: true,
    data: `User with id: ${req.params.id} deleted successfully`
  });
});
