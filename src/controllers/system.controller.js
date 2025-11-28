// src/controllers/system.controller.js

export const healthCheck = (req, res) => {
  res.json({
    success: true,
    message: "Server OK",
    uptime: process.uptime(),
    timestamp: Date.now(),
    pid: process.pid
  });
};

export const docsInfo = (req, res) => {
  res.json({
    success: true,
    message: "Swagger UI available at /docs"
  });
};
