require("dotenv").config();

const cors = require("cors");
const express = require("express");
const connectToDatabase = require("./config/db");
const leadsRouter = require("./routes/leads");

const app = express();
const port = process.env.PORT || 4000;
const allowVercelPreviews = process.env.ALLOW_VERCEL_PREVIEWS === "true";

function normalizeOrigin(origin) {
  return String(origin || "").trim().replace(/\/$/, "");
}

const allowedOrigins = (process.env.CLIENT_ORIGIN || "http://localhost:3000")
  .split(",")
  .map(normalizeOrigin)
  .filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) {
        return callback(null, true);
      }

      const normalizedOrigin = normalizeOrigin(origin);

      if (allowedOrigins.includes(normalizedOrigin)) {
        return callback(null, true);
      }

      if (allowVercelPreviews && normalizedOrigin.endsWith(".vercel.app")) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    }
  })
);
app.use(express.json());

app.get("/health", (_request, response) => {
  response.json({ status: "ok" });
});

app.use("/leads", leadsRouter);

app.use((error, _request, response, _next) => {
  console.error(error);
  response.status(500).json({
    message: "Internal server error"
  });
});

connectToDatabase()
  .then(() => {
    app.listen(port, () => {
      console.log(`Backend listening on port ${port}`);
    });
  })
  .catch((error) => {
    console.error("Failed to connect to database", error);
    process.exit(1);
  });
