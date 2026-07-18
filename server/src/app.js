const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/userRoutes");
const workspaceRoutes = require("./routes/workspaceRoutes");
const inviteRoutes = require("./routes/inviteRoutes");
const boardRoutes = require("./routes/boardRoutes");
const listRoutes = require("./routes/listRoutes");
const cardRoutes = require("./routes/cardRoutes");
const commentRoutes = require("./routes/commentRoutes");
const projectRoutes = require("./routes/projectRoutes").default || require("./routes/projectRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const searchRoutes = require("./routes/searchRoutes");
const activityRoutes = require("./routes/activityRoutes");
const analyticsRoutes = require("./routes/analyticsRoutes");

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Collaborative Workspace API is running...",
  });
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/workspaces", workspaceRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/invites", inviteRoutes);
app.use("/api/boards", boardRoutes);
app.use("/api/lists", listRoutes);
app.use("/api/cards", cardRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/search", searchRoutes);
app.use("/api/activities", activityRoutes);
app.use("/api/analytics", analyticsRoutes);

// 404 Route
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

module.exports = app;