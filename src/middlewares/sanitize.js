// src/middlewares/sanitize.js
import sanitizeHtml from "sanitize-html";

// hanya sanitize req.body, tidak menyentuh query/params (read-only)
function deepSanitize(obj) {
  if (!obj || typeof obj !== "object") return obj;

  const sanitized = Array.isArray(obj) ? [] : {};

  for (const key in obj) {
    const value = obj[key];

    if (typeof value === "string") {
      sanitized[key] = sanitizeHtml(value, {
        allowedTags: ["b", "i", "em", "strong", "u", "p", "br"],
        allowedAttributes: {}
      });
    } else if (typeof value === "object") {
      sanitized[key] = deepSanitize(value);
    } else {
      sanitized[key] = value;
    }
  }

  return sanitized;
}

export default function sanitizerMiddleware(req, res, next) {
  try {
    if (req.body) {
      req.body = deepSanitize(req.body);
    }
    next();
  } catch (err) {
    console.error("Sanitize error:", err);
    return res.status(500).json({
      success: false,
      message: "Sanitize middleware error"
    });
  }
}
