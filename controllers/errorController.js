// GLOBAL ERROR HANDLER MIDDLEWARRE

const AppGlobalErrorClass = require('../utils/appGlobalError');

// express error handler middleware
const sendErrorDev = (res, err) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

const sendErrorProd = (res, err) => {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    console.error('Error 💥:', err.message);
    res.status(500).json({
      status: 'error',
      message: 'Something went wrong!',
      error: err,
    });
  }
};

const handlerForInvalidId = (error) => {
  const message = `Invalid ${error.path}: ${error.value}`;
  return new AppGlobalErrorClass(400, message);
};

const handleDuplicatePost = (error) => {
  const value = error.message.match(/"([^"]*)"/)[0];
  const message = `Duplicate field value ${value}, Please use another`;
  return new AppGlobalErrorClass(400, message);
};

const handleValidationErrors = (error) => {
  const value = Object.values(error.errors).map((err) => err.message);
  const message = `Invalid input data: ${value.join('. ')}`;
  return new AppGlobalErrorClass(400, message);
};
module.exports = (err, req, res, next) => {
  console.log(err.stack); //Error: The req url /api/v1/tourssss not found on this server

  err.status = err.status || 'error';
  err.statusCode = err.statusCode || 500;
  if (process.env.NODE_ENV === 'development') sendErrorDev(res, err);
  else if (process.env.NODE_ENV === 'production') {
    let error = Object.assign(err);
    if (error.name === 'CastError') error = handlerForInvalidId(error);

    if (error.code === 11000) error = handleDuplicatePost(error);

    if (error.name === 'ValidationError') error = handleValidationErrors(error);

    sendErrorProd(res, error);
  }
};
