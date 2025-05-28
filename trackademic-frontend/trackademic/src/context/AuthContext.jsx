import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setUser({ token, id: token }); // Usa el email como ID temporal
    }
  }, []);

  const login = (userData) => {
    const token = userData.token || userData.access_token || userData.email;

    if (!token) return;

    setUser({
      token: token,
      id: token, // puedes usar `token` como ID si es el email
    });
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
