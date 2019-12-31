const ErrorResponse = require('../utils/ErrorResponse');

const errorHandler = (err, req, res, next) => {
  let error = { ...err };

  error.message = err.message;

  /**
   * Check for casting error
   * @desc valid ID but does not exsist in DB
   */
  if (error.name === 'CastError') {
    const message = `Illegal argument`;
    error = new ErrorResponse(message, 404);
  }

  /**
   * Check for validation errors
   */
  if (error.name === 'ValidationError') {
    const message = Object.values(error.errors).map(value => value.message);
    error = new ErrorResponse(message, 400);
  }

  /**
   * Check for duplicate entry.
   * @desc Value for unique feild already exsists
   */
  if (error.code === 11000) {
    const message = 'Duplicate information entered';
    error = new ErrorResponse(message, 400);
  }

  res
    .status(error.statusCode || 500)
    .json({ success: false, error: error.message || 'Server Error' });
};

module.exports = errorHandler;
