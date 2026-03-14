import { Request, Response, NextFunction } from 'express';

/**
 * Sanitizes user input to prevent NoSQL injection attacks
 * Removes MongoDB operators like $where, $regex, etc. from request data
 */
const sanitizeData = (data: any): any => {
  if (data === null || data === undefined) return data;

  if (typeof data === 'string') {
    // Remove common NoSQL injection patterns
    return data.replace(/[{$}]/g, '');
  }

  if (Array.isArray(data)) {
    return data.map(item => sanitizeData(item));
  }

  if (typeof data === 'object') {
    const sanitized: any = {};
    for (const key in data) {
      if (data.hasOwnProperty(key)) {
        // Block keys that start with $ (MongoDB operators)
        if (key.startsWith('$')) {
          continue;
        }
        sanitized[key] = sanitizeData(data[key]);
      }
    }
    return sanitized;
  }

  return data;
};

export const sanitizeMiddleware = (req: Request, res: Response, next: NextFunction) => {
  if (req.body) {
    req.body = sanitizeData(req.body);
  }
  if (req.query) {
    req.query = sanitizeData(req.query) as any;
  }
  if (req.params) {
    req.params = sanitizeData(req.params) as any;
  }
  next();
};
