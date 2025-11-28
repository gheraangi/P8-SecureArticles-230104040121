// src/middlewares/correlationId.js
import { v4 as uuidv4 } from "uuid";

export default function correlationId(req, res, next) {
  // gunakan header jika ada, kalau tidak generate baru
  const incoming = req.headers["x-correlation-id"];
  req.correlationId = incoming || uuidv4();
  // expose ke response agar client bisa lihat
  res.setHeader("x-correlation-id", req.correlationId);
  next();
}
