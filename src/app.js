// src/app.js
import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import cors from "cors";
import rateLimit from "express-rate-limit";
import sanitize from "./middlewares/sanitize.js";
import noSQL from "./middlewares/nosql.js";

dotenv.config();

import authRoutes from "./routes/auth.routes.js";
import articleRoutes from "./routes/articles.routes.js";

import correlationId from "./middlewares/correlationId.js";
import requestLogger from "./middlewares/requestLogger.js";
import errorHandler from "./middlewares/errorHandler.js";
import logger from "./utils/logger.js";

const app = express();

// SECURITY: HTTP headers
app.use(
  helmet({
    frameguard: { action: "deny" }, // cegah iframe
    xssFilter: true,                 // X-XSS-Protection
    noSniff: true,                   // X-Content-Type-Options
    ieNoOpen: true,                  // X-Download-Options
    hidePoweredBy: true,             // Hilangkan "X-Powered-By: Express"
    referrerPolicy: { policy: "no-referrer" },
  })
);

// CONTENT SECURITY POLICY (CSP)
app.use(
  helmet.contentSecurityPolicy({
    useDefaults: true,
    directives: {
      "default-src": ["'self'"],
      "script-src": ["'self'"],
      "style-src": ["'self'", "'unsafe-inline'"],
      "img-src": ["'self'", "data:"],
      "connect-src": ["'self'"],
      "frame-src": ["'none'"],
      "object-src": ["'none'"],
      "base-uri": ["'self'"],
      "form-action": ["'self'"]
    }
  })
);

app.use(
  helmet.hsts({
    maxAge: 60 * 60 * 24 * 30, // 30 hari
    includeSubDomains: true,
    preload: true
  })
);


// CORS - whitelist dari .env (pisah koma jika banyak)
const whitelist = (process.env.CORS_WHITELIST || "http://localhost:3000").split(",");
const corsOptions = {
  origin: (origin, callback) => {
    // allow requests with no origin (e.g., curl, Postman)
    if (!origin) return callback(null, true);
    if (whitelist.indexOf(origin) !== -1) {
      return callback(null, true);
    }
    return callback(new Error("Not allowed by CORS"));
  },
  credentials: true
};
app.use(cors(corsOptions));

// parsers
app.use(express.json());
app.use(cookieParser());

app.use(noSQL);
app.use(sanitize);

app.use(correlationId);    // ⭐ generate correlation id
app.use(requestLogger());  // ⭐ log setiap request

// GLOBAL rate limiter (lenient, protects minor abuse)
const globalLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 200,            // max 200 req per minute per IP
  standardHeaders: true,
  legacyHeaders: false
});
app.use(globalLimiter);

// mount routes (auth before articles is OK)
app.use(authRoutes);
app.use(articleRoutes);

app.use(errorHandler);

// health
app.get("/health", (req, res) => {
  res.json({
    success: true,
    uptime: process.uptime(),
    timestamp: Date.now(),
    pid: process.pid
  });
});

export default app;
