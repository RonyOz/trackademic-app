import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      setUser({ token }) // Carga básica inicial si hay token
    }
  }, [])

  const login = (userData) => {
  const payload = JSON.parse(atob(userData.token.split('.')[1]))
  setUser({
    token: userData.token,
    id: payload.sub, // normalmente FastAPI guarda el ID en "sub"
  })
}


  const logout = () => {
    localStorage.removeItem('token')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
