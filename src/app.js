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
import systemRoutes from "./routes/system.routes.js";

import correlationId from "./middlewares/correlationId.js";
import requestLogger from "./middlewares/requestLogger.js";
import errorHandler from "./middlewares/errorHandler.js";
import logger from "./utils/logger.js";

const app = express();   // <-- HARUS DI SINI (sebelum app.use)

// SECURITY: HTTP Headers
app.use(
  helmet({
    frameguard: { action: "deny" },
    xssFilter: true,
    noSniff: true,
    ieNoOpen: true,
    hidePoweredBy: true,
    referrerPolicy: { policy: "no-referrer" },
  })
);

// CSP
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
      "form-action": ["'self'"],
    }
  })
);

// HSTS
app.use(
  helmet.hsts({
    maxAge: 60 * 60 * 24 * 30,
    includeSubDomains: true,
    preload: true
  })
);

// CORS
const whitelist = (process.env.CORS_WHITELIST || "http://localhost:3000").split(",");
const corsOptions = {
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (whitelist.includes(origin)) return callback(null, true);
    return callback(new Error("Not allowed by CORS"));
  },
  credentials: true
};
app.use(cors(corsOptions));

// Parsers
app.use(express.json());
app.use(cookieParser());

// Security Middlewares
app.use(noSQL);
app.use(sanitize);

// Logging + Correlation ID
app.use(correlationId);
app.use(requestLogger());

// Rate Limiter
const globalLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(globalLimiter);

// ROUTES
app.use(systemRoutes);   // <-- DIPINDAH KE SINI (BENAR)
app.use(authRoutes);
app.use(articleRoutes);

// ERROR HANDLER
app.use(errorHandler);

// Health
app.get("/health", (req, res) => {
  res.json({
    success: true,
    uptime: process.uptime(),
    timestamp: Date.now(),
    pid: process.pid
  });
});

export default app;
