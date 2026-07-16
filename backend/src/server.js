const express = require("express");
const cors    = require("cors");
require("dotenv").config();

const authRoutes  = require("./routes/auth");
const adminRoutes = require("./routes/admin");

const app  = express();
const PORT = process.env.PORT || 5000;

// ─── Middleware ───────────────────────────────────────────────────────────────
app.use(cors({
  origin: ["http://localhost:5173", "http://localhost:3000"],
  credentials: true,
}));
app.use(express.json());

// ─── Routes ───────────────────────────────────────────────────────────────────
app.use("/api/auth",  authRoutes);
app.use("/api/admin", adminRoutes);

// Health check
app.get("/api/health", (req, res) => res.json({ status: "ok", time: new Date() }));

// 404 handler
app.use((req, res) => res.status(404).json({ error: "Route not found" }));

// ─── Start ────────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`✅ UMS Backend running on http://localhost:${PORT}`);
});
