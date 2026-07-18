const ToastContainer = ({ toasts, removeToast }) => {
  if (!toasts || toasts.length === 0) return null;

  const getToastStyles = (type) => {
    switch (type) {
      case "success":
        return {
          backgroundColor: "#ecfdf5",
          color: "#065f46",
          border: "1px solid #a7f3d0",
          iconColor: "#10b981",
        };
      case "error":
        return {
          backgroundColor: "#fef2f2",
          color: "#991b1b",
          border: "1px solid #fca5a5",
          iconColor: "#ef4444",
        };
      case "warning":
        return {
          backgroundColor: "#fffbeb",
          color: "#92400e",
          border: "1px solid #fde68a",
          iconColor: "#f59e0b",
        };
      case "info":
      default:
        return {
          backgroundColor: "#eff6ff",
          color: "#1e40af",
          border: "1px solid #bfdbfe",
          iconColor: "#3b82f6",
        };
    }
  };

  const getIcon = (type) => {
    switch (type) {
      case "success":
        return (
          <svg style={{ width: "20px", height: "20px" }} viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
        );
      case "error":
        return (
          <svg style={{ width: "20px", height: "20px" }} viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
        );
      case "warning":
        return (
          <svg style={{ width: "20px", height: "20px" }} viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        );
      case "info":
      default:
        return (
          <svg style={{ width: "20px", height: "20px" }} viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
        );
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        top: "24px",
        right: "24px",
        zIndex: 9999,
        display: "flex",
        flexDirection: "column",
        gap: "12px",
        pointerEvents: "none",
        maxWidth: "380px",
        width: "100%",
      }}
    >
      {toasts.map((toast) => {
        const styles = getToastStyles(toast.type);

        return (
          <div
            key={toast.id}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              padding: "14px 18px",
              borderRadius: "var(--radius-md)",
              boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)",
              backgroundColor: styles.backgroundColor,
              color: styles.color,
              border: styles.border,
              pointerEvents: "auto",
              animation: "slideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <div style={{ color: styles.iconColor, flexShrink: 0, display: "flex", alignItems: "center" }}>
              {getIcon(toast.type)}
            </div>

            <div style={{ fontSize: "13.5px", fontWeight: "500", lineHeight: "1.4", flex: 1, paddingRight: "16px" }}>
              {toast.message}
            </div>

            <button
              onClick={() => removeToast(toast.id)}
              style={{
                background: "none",
                border: "none",
                color: styles.color,
                opacity: 0.6,
                cursor: "pointer",
                fontSize: "16px",
                fontWeight: "700",
                padding: "2px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "opacity 0.15s ease",
              }}
              onMouseEnter={(e) => { e.target.style.opacity = 1; }}
              onMouseLeave={(e) => { e.target.style.opacity = 0.6; }}
            >
              ×
            </button>
          </div>
        );
      })}

      <style>{`
        @keyframes slideIn {
          from {
            transform: translateX(120%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
};

export default ToastContainer;
