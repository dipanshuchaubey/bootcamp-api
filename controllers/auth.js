const User = require('../models/User');
const asyncHandler = require('../middleware/asyncHandler');
const ErrorResponse = require('../utils/ErrorResponse');
const sendEmail = require('../utils/sendEmail');

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
  const isMatch = await user.matchPassword(password);

  if (!isMatch) {
    return next(new ErrorResponse('Invalid credentials', 401));
  }

  sendResponseToken(user, 200, res);
});

/**
 * @desc        Get currently logged in user
 * @route       GET /api/v1/auth/me
 * @access      Private
 */

exports.findMe = asyncHandler(async (req, res, next) => {
  const me = req.user; // Validation of if me exists is already done

  res.status(200).json({ success: true, data: me });
});

/**
 * @desc        Reset forgot password
 * @route       POST /api/v1/auth/forgotpassword
 * @access      Public
 */

exports.forgotPassword = asyncHandler(async (req, res, next) => {
  const email = req.body.email;

  if (!email) {
    return next(new ErrorResponse('Please add an email', 400));
  }

  const user = await User.findOne({ email });

  if (!user) {
    return next(
      new ErrorResponse(`User does not exists with email ${email}`, 404)
    );
  }

  // Get rest password token
  const resetToken = user.getResetPasswordToken();

  // Save changes made to user
  user.save({ validateBeforeSave: false });

  // Send email
  const resetUrl = `${req.protocol}://${req.get(
    'host'
  )}/api/v1/auth/resetpassword/${resetToken}`;

  const message = `You are receiving this email because you (or someone else) has requested the reset of a password. Please make a PUT request to: \n\n ${resetUrl}`;

  try {
    // Send Email
    await sendEmail(user.email, 'DevCamper - Reset Password', message);
  } catch (err) {
    return next(new ErrorResponse('Error occured while sending email', 500));
  }

  res
    .status(200)
    .json({ success: true, data: 'Rest password email has been sent' });
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
