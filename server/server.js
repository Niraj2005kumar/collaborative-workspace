require("dotenv").config();

console.log("1. Server.js started");

const http = require("http");
const { Server } = require("socket.io");

const app = require("./src/app");
console.log("2. App loaded");

const connectDB = require("./src/config/db");
console.log("3. DB function loaded");

const setupSocket = require("./src/socket/socket");
console.log("4. Socket loaded");

const DEFAULT_PORT = Number(process.env.PORT) || 5000;

function listenOnPort(port) {
  const httpServer = http.createServer(app);

  const io = new Server(httpServer, {
    cors: {
      origin: (origin, callback) => {
        const allowedOrigins = [
          process.env.CLIENT_URL,
          process.env.CLIENT_URL2,
          "https://collaborative-workspace-mlex.vercel.app",
          "http://localhost:5173",
          "http://localhost:5174",
        ].filter(Boolean);

        const isLocalhost =
          typeof origin === "string" && /^https?:\/\/localhost(:\d+)?$/.test(origin);

        if (!origin || allowedOrigins.includes(origin) || isLocalhost) {
          callback(null, true);
        } else {
          callback(new Error(`CORS policy does not allow access from origin ${origin}`));
        }
      },
      methods: ["GET", "POST", "PUT", "DELETE"],
      credentials: true,
    },
  });

  // Make io available throughout the app
  app.set("io", io);

  // Initialize Socket.IO
  setupSocket(io);

  httpServer.listen(port, () => {
    console.log(`✅ Server running on port ${port}`);
    console.log("🚀 Socket.IO Server Started");
  });

  httpServer.on("error", (error) => {
    if (error.code === "EADDRINUSE") {
      const nextPort = port + 1;
      console.warn(`Port ${port} is busy. Trying ${nextPort} instead...`);
      httpServer.close(() => listenOnPort(nextPort));
    } else {
      console.error("❌ Server startup failed:", error);
    }
  });
}

async function startServer() {
  try {
    console.log("5. Connecting to MongoDB...");
    await connectDB();
    console.log("6. MongoDB Connected");

    listenOnPort(DEFAULT_PORT);
  } catch (error) {
    console.error("❌ Server Error:", error);
  }
}

startServer();