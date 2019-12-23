const User = require('../models/User');
const asyncHandler = require('../middleware/asyncHandler');
const ErrorResponse = require('../utils/ErrorResponse');
const sendEmail = require('../utils/sendEmail');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');

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
 * @desc        User Logout
 * @route       GET /api/v1/auth/logout
 * @access      Private
 */
exports.logout = asyncHandler(async (req, res, next) => {
  res
    .status(200)
    .cookie('token', undefined, {
      expires: new Date(Date.now() + 10 * 1000),
      httpOnly: true
    })
    .json({ success: true });
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
 * @desc        Update user details
 * @route       PUT /api/v1/auth/updatedetails
 * @access      Private
 */
exports.updateDetails = asyncHandler(async (req, res, next) => {
  // So that only these values can be changed
  // And user will not be alter value of resetPasswordToken
  const updateOptions = {
    name: req.body.name,
    email: req.body.email
  };

  const user = await User.findByIdAndUpdate(req.user.id, updateOptions, {
    new: true,
    runValidators: true
  });

  res.status(200).json({ success: true, data: user });
});

/**
 * @desc        Update Password
 * @route       PUT /api/v1/auth/updatepassword
 * @access      Private
 */
exports.updatePassword = asyncHandler(async (req, res, next) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    new ErrorResponse('Please enter current and new password', 400);
  }

  const user = await User.findById(req.user.id).select('+password');

  // Check if entered current password is correct
  if (!(await user.matchPassword(currentPassword))) {
    return next(
      new ErrorResponse('Entered password does not match current password', 401)
    );
  }

  user.password = newPassword;

  await user.save();

  sendResponseToken(user, 200, res);
});

/**
 * @desc        Forgot password
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
  await user.save({ validateBeforeSave: false });

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

/**
 * @desc        Reset forgot password
 * @route       POST /api/v1/auth/forgotpassword
 * @access      Public
 */

exports.resetpassword = asyncHandler(async (req, res, next) => {
  if (!req.body.password) {
    return next(new ErrorResponse('Password not provided', 400));
  }

  // Hash token
  const token = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  const user = await User.findOne({
    resetPasswordToken: token,
    resetPasswordExpire: { $gt: Date.now() }
  });

  if (!user) {
    return next(new ErrorResponse('Invalid token', 401));
  }

  /**
   *  Set new password
   *  Set resetPasswordToken and resetPasswordExpire to undefined
   *  Because we dont want them to populate our database
   */
  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  await user.save();

  res
    .status(200)
    .json({ success: true, data: 'Password changed successfully' });
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
