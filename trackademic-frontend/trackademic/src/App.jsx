import { Routes, Route, Navigate } from 'react-router-dom'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import DashboardHome from './pages/DashboardHome'
import NotFoundPage from './pages/NotFoundPage'
import ProtectedLayout from './layouts/ProtectedLayout'

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      <Route path="/dashboard/*" element={<ProtectedLayout />}>
        <Route index element={<DashboardHome />} />
      </Route>

      <Route path="*" element={<NotFoundPage />} />
      <Route path="plans/:semester/:subjectCode" element={<PlanDetailPage />} />
      <Route path="plans/new" element={<CreatePlanPage />} />

    </Routes>
  )
}

export default App
