require("dotenv").config();

console.log("1. Server.js started");

const app = require("./src/app");
console.log("2. App loaded");

const connectDB = require("./src/config/db");
console.log("3. DB function loaded");

const DEFAULT_PORT = Number(process.env.PORT) || 5000;

function listenOnPort(port) {
  const server = app.listen(port, () => {
    console.log(`✅ Server running on port ${port}`);
  });

  server.on("error", (error) => {
    if (error.code === "EADDRINUSE") {
      const nextPort = port + 1;
      console.warn(`Port ${port} is busy. Trying ${nextPort} instead...`);
      server.close(() => listenOnPort(nextPort));
    } else {
      console.error("Server startup failed:", error);
    }
  });
}

async function startServer() {
  try {
    console.log("4. Connecting to MongoDB...");
    await connectDB();
    console.log("5. MongoDB Connected");

    listenOnPort(DEFAULT_PORT);
  } catch (error) {
    console.error("Server Error:", error);
  }
}

startServer();