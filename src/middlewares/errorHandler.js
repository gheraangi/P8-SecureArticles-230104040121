import logger from "../utils/logger.js";

export default function errorHandler(err, req, res, next) {
  logger.error(
    {
      correlationId: req.correlationId,
      error: err.message,
      stack: err.stack
    },
    "Unhandled error"
  );

  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal server error",
    correlationId: req.correlationId
  });
}
