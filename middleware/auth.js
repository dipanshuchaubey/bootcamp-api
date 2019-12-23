const asyncHandler = require('./asyncHandler');
const ErrorResponse = require('../utils/ErrorResponse');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.protect = asyncHandler(async (req, res, next) => {
  let token;

  // If token is passed as Auth Header
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  // If token is passed as Cookie
  if (req.cookies.token) {
    token = req.cookies.token;
  }

  // If no token is passed throw error
  if (!token) {
    return next(new ErrorResponse('Unauthorized call to route', 401));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = await User.findById(decoded.id);

    if (!req.user) {
      return next(new ErrorResponse('Unauthorized call to route', 401));
    }
  } catch (err) {
    return next(new ErrorResponse('Unauthorized call to route', 401));
  }

  next();
});

exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      next(
        new ErrorResponse(
          `User with role ${req.user.role} are unathourized to access this route`,
          403
        )
      );
    }

    next();
  };
};
