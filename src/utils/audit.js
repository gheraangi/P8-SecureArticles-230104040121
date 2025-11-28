// src/utils/audit.js
import logger from "./logger.js";

export function auditLog(req, type, detail = {}) {
  logger.warn({
    type,                    // tipe aktivitas yang dicurigai
    correlationId: req.id,   // dari pino-http
    ip: req.ip,
    method: req.method,
    url: req.originalUrl,
    userAgent: req.headers["user-agent"],
    ...detail               // detail tambahan
  });
}
