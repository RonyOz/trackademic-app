import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUserId = localStorage.getItem("userId"); // Assuming you'd store the actual user ID
    const storedSemester = localStorage.getItem("semester"); // Store semester as well

    if (token && storedUserId && storedSemester) {
      setUser({
        token: token,
        id: storedUserId, // Use the actual user ID if available
        semester: storedSemester, // Load semester from local storage
      });
    } else if (token) {
      // Fallback if only token is stored, but ideally, all user data should be stored
      // This part might need adjustment based on how your backend provides user ID and semester.
      // For now, if only token, assume token is the ID (as before), and semester is unknown.
      // You'll need to fetch semester or have it in the initial login.
      setUser({ token, id: token });
    }
  }, []);

  const login = (userData) => {
  const token = userData.token || userData.access_token;
  const userId = userData.id || userData.user_id;

  if (!token || !userId) { // Only require token and user ID
    console.warn("Missing token or user ID in login data.");
    return;
  }

  localStorage.setItem("token", token);
  localStorage.setItem("userId", userId);
  
  // Set semester if provided, otherwise use a default
  const userSemester = userData.semester || "default_semester";
  localStorage.setItem("semester", userSemester);

  setUser({
    token: token,
    id: userId,
    semester: userSemester,
  });
};

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("semester"); // Remove semester on logout
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);