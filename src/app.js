require("dotenv").config();

const express = require("express");
const { testDatabaseConnection } = require("./config/db");

const app = express();

app.use(express.json());

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

module.exports = app;
