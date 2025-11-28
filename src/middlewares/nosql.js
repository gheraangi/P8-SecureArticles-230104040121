// src/middlewares/nosql.js

function sanitizeNoSQL(value) {
  if (value === null || value === undefined) return value;

  // jika string, aman
  if (typeof value === "string") return value;

  // jika object (misal { "$gt": "" }), kita blok
  if (typeof value === "object") {
    // buang seluruh key yang mengandung $ atau .
    const hasInjection = Object.keys(value).some(
      (k) => k.includes("$") || k.includes(".")
    );

    if (hasInjection) {
      return ""; // ← ubah jadi string kosong supaya tidak trigger CastError
    }

    // kalau object normal, sanitize tiap key
    const clean = {};
    for (const key in value) {
      if (!key.includes("$") && !key.includes(".")) {
        clean[key] = sanitizeNoSQL(value[key]);
      }
    }
    return clean;
  }

  return value; // number, boolean, dll aman
}

export default function noSQLMiddleware(req, res, next) {
  try {
    if (req.body) req.body = sanitizeNoSQL(req.body);
    next();
  } catch (err) {
    console.error("NoSQL sanitize error:", err);
    res.status(400).json({
      success: false,
      message: "Invalid input detected (blocked possible NoSQL injection)"
    });
  }
}
