// src/routes/articles.routes.js

import express from "express";
import Article from "../models/article.model.js";
import auth from "../middlewares/auth.js";

// VALIDATION IMPORT
import validate from "../validators/validate.js";
import { createArticleSchema } from "../validators/article.schema.js";

const router = express.Router();

/* ============================
   GET ALL ARTICLES (PUBLIC)
============================ */
router.get("/api/articles", async (req, res) => {
  const data = await Article.find();
  res.json({ success: true, data });
});

/* ============================
   CREATE ARTICLE (PROTECTED + VALIDATION)
============================ */
router.post(
  "/api/articles",
  auth,
  validate(createArticleSchema),  // <-- VALIDATION ADA DI SINI
  async (req, res) => {

    const payload = {
      title: req.body.title,
      content: req.body.content,
      status: req.body.status,
      authorId: req.user.id
    };

    const data = await Article.create(payload);

    res.status(201).json({
      success: true,
      message: "Article created",
      data
    });
  }
);

// UPDATE (owner atau admin)
router.put("/api/articles/:id", auth, async (req, res) => {
  const article = await Article.findById(req.params.id);

  if (!article) {
    return res.status(404).json({ message: "Not found" });
  }

  // cek kepemilikan
  if (article.authorId.toString() !== req.user.id && req.user.role !== "admin") {
    auditLog(req, "forbidden_update_attempt", {
      articleId: req.params.id,
      userId: req.user.id,
    });

    return res.status(403).json({ message: "Forbidden" });
  }

  Object.assign(article, req.body);
  await article.save();

  res.json({
    success: true,
    message: "Updated",
    data: article,
  });
});

/* ============================
   DELETE ARTICLE (ADMIN ONLY)
============================ */
router.delete("/api/articles/:id", auth, async (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Admin only" });
  }

  await Article.findByIdAndDelete(req.params.id);

  res.status(204).send();
});

export default router;
