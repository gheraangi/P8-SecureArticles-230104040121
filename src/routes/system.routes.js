// src/routes/system.routes.js
import express from "express";
import { healthCheck } from "../controllers/system.controller.js";
import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";

const router = express.Router();
const swaggerDocument = YAML.load("src/docs/openapi.yaml");

router.get("/health", healthCheck);

// Swagger UI
router.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

export default router;