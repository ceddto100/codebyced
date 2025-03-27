/**
 * Centralized error handling middleware
 */
const errorHandler = (err, req, res, next) => {
    console.error('Error:', err.message);
    
    // Default error values
    let statusCode = err.statusCode || 500;
    let message = err.message || 'Server Error';
    let errors = [];
  
    // Handle Mongoose validation errors
    if (err.name === 'ValidationError') {
      statusCode = 400;
      message = 'Validation Error';
      
      // Format mongoose validation errors
      Object.keys(err.errors).forEach(key => {
        errors.push({
          field: key,
          message: err.errors[key].message
        });
      });
    }
    
    // Handle MongoDB duplicate key error
    if (err.code === 11000) {
      statusCode = 400;
      message = 'Duplicate Field Value';
      
      // Extract the field name from the error message
      const field = Object.keys(err.keyValue)[0];
      errors.push({
        field,
        message: `${field} already exists with value: ${err.keyValue[field]}`
      });
    }
    
    // Handle Cast errors (invalid ObjectId)
    if (err.name === 'CastError') {
      statusCode = 400;
      message = 'Invalid ID Format';
      errors.push({
        field: err.path,
        message: `Invalid ${err.kind}`
      });
    }
  
    // Send the formatted error response
    res.status(statusCode).json({
      success: false,
      message,
      errors: errors.length > 0 ? errors : undefined,
      stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
  };
  
  module.exports = errorHandler;