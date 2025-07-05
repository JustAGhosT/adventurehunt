import { Request, Response, NextFunction } from 'express';

export interface AppError extends Error {
  statusCode?: number;
  code?: string;
  details?: any;
}

export const errorHandler = (
  error: AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const statusCode = error.statusCode || 500;
  const errorCode = error.code || 'INTERNAL_SERVER_ERROR';
  
  console.error(`[ERROR] ${errorCode}:`, error.message);
  console.error(error.stack);

  res.status(statusCode).json({
    code: errorCode,
    message: error.message || 'Something went wrong!',
    details: error.details || null,
    timestamp: new Date().toISOString()
  });
};

export const createError = (
  message: string, 
  statusCode: number = 500, 
  code: string = 'INTERNAL_SERVER_ERROR',
  details?: any
): AppError => {
  const error = new Error(message) as AppError;
  error.statusCode = statusCode;
  error.code = code;
  error.details = details;
  return error;
};