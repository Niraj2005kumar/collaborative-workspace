const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Collaborative Workspace API is running",
  });
});

app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/workspaces", require("./routes/workspaceRoutes"));

app.use("/api/invites", require("./routes/inviteRoutes"));

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

module.exports = app;