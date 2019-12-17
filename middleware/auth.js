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
  // else if (req.cookies.token) {
  //   token = req.cookies.token;
  // }

  // If no token is passed throw error
  if (!token) {
    return next(new ErrorResponse('Unauthorized call to route', 401));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id);

    if (!user) {
      return next(new ErrorResponse('Unauthorized call to route', 401));
    }
  } catch (err) {
    return next(new ErrorResponse('Unauthorized call to route', 401));
  }

  next();
});
