import Joi from "joi";

export const createArticleSchema = Joi.object({
  body: Joi.object({
    title: Joi.string().min(3).max(150).required(),
    content: Joi.string().min(3).required(),
    status: Joi.string().valid("draft", "published").default("draft")
  }).required()
});
