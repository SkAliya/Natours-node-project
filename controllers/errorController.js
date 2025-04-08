// GLOBAL ERROR HANDLER MIDDLEWARRE
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
    console.error('Error 💥:', err);
    res.status(500).json({
      status: 'error',
      message: 'Something went wrong!',
    });
  }
};
module.exports = (err, req, res, next) => {
  console.log(err.stack); //Error: The req url /api/v1/tourssss not found on this server

  err.status = err.status || 'error';
  err.statusCode = err.statusCode || '500';
  if (process.env.NODE_ENV === 'development') sendErrorDev(res, err);
  else if (process.env.NODE_ENV === 'production') sendErrorProd(res, err);
};
