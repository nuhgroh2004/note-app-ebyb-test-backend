require("dotenv").config();

const express = require("express");
const helmet = require("helmet");
const { testDatabaseConnection } = require("./config/db");
const apiRoutes = require("./routes");
const notFoundHandler = require("./middlewares/notFoundHandler");
const errorHandler = require("./middlewares/errorHandler");

const app = express();

app.use(helmet());
app.use(express.json({ limit: "100kb" }));

app.get("/", (req, res) => {
  res.json({ message: "Notes App API is running" });
});

app.get("/api/health", async (req, res) => {
  try {
    await testDatabaseConnection();

    res.status(200).json({
      status: "ok",
      database: "connected",
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      database: "disconnected",
      message: error.message,
    });
  }
});

app.use("/api", apiRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
