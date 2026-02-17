import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // ✅ SAFE localStorage parsing (prevents crashes)
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem("user");
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // ✅ LOGIN
  const login = (data) => {
    const userData = {
      ...data.user,
      token: data.token, // ⭐ store token INSIDE user
    };

    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
  };

  // ✅ LOGOUT
  const logout = () => {
    localStorage.removeItem("user"); // safer than clear()
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// ✅ Custom hook
export const useAuth = () => useContext(AuthContext);
