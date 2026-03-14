import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { logger } from '../utils/logger';

export const globalErrorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';
  let errors = null;

  // 1. Catch Zod Validation Errors
  if (err instanceof ZodError) {
    statusCode = 400;
    message = 'Validation Failed';
    // Format Zod errors into a clean array for the frontend
    errors = err.issues.map(e => ({
      field: e.path.join('.'),
      message: e.message
    }));
  } 
  // 2. Catch MongoDB Duplicate Key Errors (e.g., Email or Slug already exists)
  else if (err.code === 11000) {
    statusCode = 409;
    const field = Object.keys(err.keyValue)[0];
    message = `An account with that ${field} already exists.`;
  } 
  // 3. Catch Mongoose Cast Errors (Invalid ObjectIds)
  else if (err.name === 'CastError') {
    statusCode = 400;
    message = `Invalid ${err.path}: ${err.value}`;
  }

  // Log error
  logger.error({
    statusCode,
    message,
    path: req.path,
    method: req.method,
    stack: err.stack
  });

  // Send the unified response
  res.status(statusCode).json({
    success: false,
    message,
    ...(errors && { errors }), // Only include the errors array if it exists
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }) // Show stack trace only in dev
  });
};