import pinoHttp from "pino-http";
import logger from "../utils/logger.js";

export default function requestLogger() {
  return pinoHttp({
    logger,

    // gunakan correlation-id sebagai request id
    genReqId: (req) => req.correlationId,

    customLogLevel(res, err) {
      if (err || res.statusCode >= 500) {
        return "error";
      }
      if (res.statusCode >= 400) {
        return "warn";
      }
      return "info";
    },

    serializers: {
      req(req) {
        return {
          method: req.method,
          url: req.url
        };
      },
      res(res) {
        return {
          statusCode: res.statusCode
        };
      }
    },

    customSuccessMessage(req, res) {
      return "request completed";
    }
  });
}
