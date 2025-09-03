export const errorMiddleware = (err, req, res, next) => {
  const statusCode = err.code || 500;
  const message = err.message || 'Internal Server Error';

  res.status(statusCode).json({
    success: false,
    errors: [{ field: '', message }],
  });
};
