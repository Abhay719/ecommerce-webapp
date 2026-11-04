import type { Request, Response, NextFunction } from 'express';

// 404 Not Found Middleware
export const notFoundHandler = (req: Request, res: Response): void => {
  res.status(404).json({
    error: 'Route Not Found',
    path: req.originalUrl,
    method: req.method,
  });
};

// Global Error Handler Middleware
export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  const isDev = process.env.NODE_ENV !== 'production';

  console.error('[API Error]:', err.message);
  if (isDev) {
    console.error(err.stack);
  }

  res.status(500).json({
    error: 'Internal Server Error',
    message: err.message,
    ...(isDev && { stack: err.stack }),
  });
};
