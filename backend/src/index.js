import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { fileURLToPath } from "url";
import path from "path";

import UserRoute from "./routes/UserRoute.js";
import connectDB from "./utils/database.js";

dotenv.config();
const PORT = process.env.PORT || 5000;
const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(cors());
app.use(express.json());
app.use(cookieParser());

// Database connection
connectDB();

// API routes
app.use("/api/auth", UserRoute);

// Serve frontend (React build)
const frontendPath = path.join(__dirname, "frontend", "build");
app.use(express.static(frontendPath));

// Handle frontend routing
app.get("*", (req, res) => {
  res.sendFile(path.join(frontendPath, "index.html"));
});

// Security headers
app.use((req, res, next) => {
  res.setHeader(
    "Content-Security-Policy",
    "default-src 'self'; font-src 'self' data: https://fonts.gstatic.com"
  );
  next();
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);

  // ✅ Keep-alive ping every 14 minutes
  if (process.env.RENDER_URL) {
    setInterval(() => {
      axios.get(process.env.RENDER_URL)
        .then(() => console.log("🔄 Keep-alive ping sent"))
        .catch(err => console.error("⚠️ Keep-alive ping failed:", err.message));
    }, 14 * 60 * 1000); // 14 minutes
  } else {
    console.warn("⚠️ No RENDER_URL set in .env — keep-alive disabled");
  }
});