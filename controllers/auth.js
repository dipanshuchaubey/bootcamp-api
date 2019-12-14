const User = require('../models/User');
const asyncHandler = require('../middleware/asyncHandler');
const ErrorResponse = require('../utils/ErrorResponse');

/**
 * @desc        Regsiter a user
 * @route       POST /api/v1/auth/register
 * @access      Public
 */

exports.register = asyncHandler(async (req, res, next) => {
  const { name, email, password, role } = req.body;

  const user = await User.create({
    name,
    email,
    password,
    role
  });

  res.status(201).json({ success: true, data: user });
});
