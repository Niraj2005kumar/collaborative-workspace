import { io } from "socket.io-client";

const SOCKET_URL = "http://localhost:5000";

let socket = null;

export const connectSocket = () => {
  if (socket && socket.connected) {
    return socket;
  }

  const token = localStorage.getItem("token");

  socket = io(SOCKET_URL, {
    transports: ["websocket"],
    autoConnect: true,
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
    auth: {
      token,
    },
  });

  socket.on("connect", () => {
    console.log("🟢 Socket Connected:", socket.id);
  });

  socket.on("disconnect", (reason) => {
    console.log("🔴 Socket Disconnected:", reason);
  });

  socket.on("connect_error", (error) => {
    console.error("❌ Socket Connection Error:", error.message);
  });

  return socket;
};

export const getSocket = () => socket;

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

export default connectSocket;