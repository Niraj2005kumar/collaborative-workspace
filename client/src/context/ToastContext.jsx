import { createContext, useContext, useState, useCallback, useMemo } from "react";
import ToastContainer from "../components/ToastContainer";

const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback((message, type = "info", duration = 4000) => {
    const id = Math.random().toString(36).substring(2, 9);
    
    setToasts((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      removeToast(id);
    }, duration);
  }, [removeToast]);

  const showSuccess = useCallback((msg, dur) => addToast(msg, "success", dur), [addToast]);
  const showError = useCallback((msg, dur) => addToast(msg, "error", dur), [addToast]);
  const showWarning = useCallback((msg, dur) => addToast(msg, "warning", dur), [addToast]);
  const showInfo = useCallback((msg, dur) => addToast(msg, "info", dur), [addToast]);

  const contextValue = useMemo(() => ({
    showSuccess,
    showError,
    showWarning,
    showInfo
  }), [showSuccess, showError, showWarning, showInfo]);

  return (
    <ToastContext.Provider value={contextValue}>
      {children}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};

export default ToastContext;
