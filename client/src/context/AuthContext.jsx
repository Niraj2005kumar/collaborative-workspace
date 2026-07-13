import { createContext, useMemo, useState } from "react";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    if (typeof window === "undefined") {
      return null;
    }

    const token = window.localStorage.getItem("token");

    return token ? { token } : null;
  });

  const [loading, setLoading] = useState(false);

  const login = (token, userData) => {
    localStorage.setItem("token", token);

    setUser({
      ...userData,
      token,
    });
    setLoading(false);
  };

  const logout = () => {
    localStorage.removeItem("token");

    setUser(null);
    setLoading(false);
  };

  const value = useMemo(
    () => ({
      user,
      loading,
      login,
      logout,
      isAuthenticated: !!user,
    }),
    [user, loading]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};