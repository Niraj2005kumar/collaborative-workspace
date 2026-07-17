import { useEffect } from "react";
import AppRoutes from "./routes/AppRoutes";
import { connectSocket, disconnectSocket } from "./services/socket";
import "./App.css";

function App() {
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      connectSocket();
    }

    return () => {
      disconnectSocket();
    };
  }, []);

  return <AppRoutes />;
}

export default App;