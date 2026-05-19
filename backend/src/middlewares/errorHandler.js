export function errorHandler(err, _req, res, _next) {
  const isMulterError = err?.name === 'MulterError'
  const status = err?.status || (isMulterError ? 400 : 500)

  let message = err?.message || 'Internal server error'

  if (isMulterError && err.code === 'LIMIT_FILE_SIZE') {
    message = 'Resume file must be 5MB or smaller.'
  }

  res.status(status).json({
    error: {
      message,
      ...(process.env.NODE_ENV === 'development' && status >= 500 ? { stack: err?.stack } : {}),
    },
  })
}
