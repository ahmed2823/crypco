import "dotenv/config";
import cors from "cors";
import express from "express";
import { demoProperties } from "./data/properties.js";
import { ENV } from "./config/env.js";

const app = express();
const PORT = ENV.PORT || 5001;

app.use(cors());
app.use(express.json({ limit: "32kb" }));

app.get("/api/health", (_req, res) => {
  res.status(200).json({ status: "ok", service: "cove-property-api" });
});

app.get("/api/properties", (_req, res) => {
  res.status(200).json(demoProperties);
});

app.get("/api/properties/:id", (req, res) => {
  const property = demoProperties.find((item) => item.id === req.params.id);
  if (!property) {
    return res.status(404).json({ error: "Property not found" });
  }
  return res.status(200).json(property);
});

app.use((error, _req, res, _next) => {
  console.error("Unhandled API error:", error);
  res.status(500).json({ error: "An unexpected server error occurred." });
});

app.listen(PORT, () => {
  console.log(`Property API listening on port ${PORT}`);
});
