import { Navigate, Outlet } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { useAuth } from '../context/AuthContext'

const ProtectedLayout = () => {
  const { user } = useAuth()

  if (!user) return <Navigate to="/login" />

  return (
    <div className="min-h-screen bg-base-200">
      <Navbar />
      <div className="p-6">
        <Outlet />
      </div>
    </div>
  )
}

export default ProtectedLayout
