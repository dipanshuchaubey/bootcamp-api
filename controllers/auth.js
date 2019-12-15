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

  sendResponseToken(user, 200, res);
});

/**
 * @desc        User login
 * @route       POST /api/v1/auth/login
 * @access      Public
 */

exports.login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new ErrorResponse('Please enter email and password', 400));
  }

  const user = await User.findOne({ email }).select('+password');

  if (!user) {
    return next(new ErrorResponse('Invalid credentials', 401));
  }

  // Match user email and password
  const isMatch = user.matchPassword(password);

  if (!isMatch) {
    return next(new ErrorResponse('Invalid credentials', 401));
  }

  sendResponseToken(user, 200, res);
});

// Sign Jwt token, set cookie and send response token
const sendResponseToken = (user, statusCode, res) => {
  // Sign JWT token
  const token = user.getSignedJwtToken();

  // Set cookie options
  const options = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true
  };

  // Allow connection over HTTPS if env === production
  if (process.env.NODE_ENV === 'production') {
    options.secure = true;
  }

  // Set cookie
  res
    .status(statusCode)
    .cookie('token', token, options)
    .json({ success: true, token });
};
