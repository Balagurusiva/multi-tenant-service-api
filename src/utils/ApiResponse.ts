import { Response } from 'express';

export class ApiResponse {
  /**
   * Sends a standardized JSON response.
   * @param res The Express Response object
   * @param statusCode The HTTP status code (e.g., 200, 201)
   * @param message A human-readable message
   * @param data Optional payload
   */
  static send<T>(res: Response, statusCode: number, message: string, data?: T) {
    return res.status(statusCode).json({
      success: statusCode >= 200 && statusCode < 300,
      message,
      // The spread operator ensures 'data' is only included in the JSON if it actually exists
      ...(data !== undefined && { data }) 
    });
  }
}