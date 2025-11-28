console.log("AUTH ROUTES LOADED");
import rateLimit from "express-rate-limit";
import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import auth from "../middlewares/auth.js";
import { verifyRefreshToken, generateAccessToken } from "../utils/jwt.js";
import { auditLog } from "../utils/audit.js";

const router = express.Router();

/* ============================
    REGISTER
============================ */
router.post("/api/auth/register", async (req, res) => {
  req.body.password = await bcrypt.hash(req.body.password, 10);
  const user = await User.create(req.body);
  res.status(201).json({ success: true, user });
});

const loginLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 5,
  message: {
    success: false,
    message: "Too many login attempts. Please try again later."
  },
  standardHeaders: true,
  legacyHeaders: false
});

router.post("/api/auth/login", loginLimiter, async (req, res) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
  auditLog(req, "login_failed", { emailAttempt: req.body.email });
  return res.status(401).json({ message: "Invalid credentials" });
}

  if (!isValid) {
  auditLog(req, "login_failed_password", {
    email: user.email
  });
  return res.status(401).json({ message: "Invalid credentials" });
}

  const isValid = await bcrypt.compare(req.body.password, user.password);
  if (!isValid) return res.status(401).json({ message: "Invalid credentials" });

  const accessToken = jwt.sign(
    { id: user._id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "15m" }
  );

  const refreshToken = jwt.sign(
    { id: user._id },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: "7d" }
  );

  // simpan refreshToken di cookie HttpOnly
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: false,
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000
  });

  res.json({
    accessToken,
    message: "Login success"
  });
});

/* ============================
    GET /me
============================ */
router.get("/api/auth/me", auth, async (req, res) => {
  res.json({
    id: req.user.id,
    email: req.user.email,
    role: req.user.role
  });
});

/* ============================
    REFRESH TOKEN
============================ */
router.post("/api/auth/refresh", async (req, res) => {
  try {
    const token = req.cookies.refreshToken;

    if (!token) {
      return res.status(401).json({ message: "No refresh token" });
    }

    // verify refresh token
    const decoded = verifyRefreshToken(token);

    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // buat access token baru
    const newAccessToken = generateAccessToken({
      id: user._id,
      email: user.email,
      role: user.role
    });

    res.json({
      accessToken: newAccessToken
    });

  } catch (err) {
    res.status(401).json({ message: "Invalid refresh token" });
  }
});

/* ============================
    LOGOUT
============================ */
router.post("/api/auth/logout", (req, res) => {
  // hapus cookie refreshToken
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: false,
    sameSite: "strict"
  });

  res.json({
    message: "Logged out successfully"
  });
});

console.log("Logout route registered");

export default router;
