require("dotenv").config();

const app = require("./src/app");
const connectDB = require("./src/config/db");

const DEFAULT_PORT = Number(process.env.PORT) || 5000;

async function startServer(port) {
  try {
    await connectDB();

    const server = app.listen(port, () => {
      console.log(`✅ Server running on port ${port}`);
    });

    server.on("error", (error) => {
      if (error.code === "EADDRINUSE") {
        const nextPort = port + 1;
        console.warn(`Port ${port} is busy. Trying ${nextPort} instead...`);
        server.close(() => startServer(nextPort));
      } else {
        console.error("Server startup failed:", error);
      }
    });
  } catch (err) {
    console.error("Failed to start server:", err);
  }
}

startServer(DEFAULT_PORT);