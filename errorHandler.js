const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  console.error(err.stack);

  // Mongoose duplicate key
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    error.message = `${field.charAt(0).toUpperCase() + field.slice(1)} already exists`;
    return res.status(400).json({ success: false, message: error.message });
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map(val => val.message).join(', ');
    return res.status(400).json({ success: false, message });
  }

  // Mongoose cast error (bad ObjectId)
  if (err.name === 'CastError') {
    return res.status(404).json({ success: false, message: 'Resource not found' });
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({ success: false, message: 'Invalid token' });
  }

  res.status(err.statusCode || 500).json({
    success: false,
    message: error.message || 'Server Error'
  });
};

module.exports = errorHandler;
