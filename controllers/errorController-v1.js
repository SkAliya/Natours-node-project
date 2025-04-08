// GLOBAL ERROR HANDLER MIDDLEWARRE
// express error handler middleware
module.exports = (err, req, res, next) => {
  console.log(err.stack); //Error: The req url /api/v1/tourssss not found on this server

  err.status = err.status || 'error';
  err.statusCode = err.statusCode || '500';

  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });
};
