const ErrorResponse = require('../utils/ErrorResponse');

const errorHandler = (err, req, res, next) => {
  let error = { ...err };

  error.message = err.message;

  if (error.name === 'CastError') {
    const message = `Bootcamp not found with id : ${error.value}`;
    error = new ErrorResponse(message, 404);
  }

  if (error.code === 11000) {
    const message = 'Duplicate information entered';
    error = new ErrorResponse(message, 400);
  }

  res
    .status(error.statusCode || 500)
    .json({ success: false, error: error.message || 'Server Error' });
};

module.exports = errorHandler;
