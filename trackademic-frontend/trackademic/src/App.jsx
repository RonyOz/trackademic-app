//src/App.jsx

import { Routes, Route, Navigate } from 'react-router-dom'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import DashboardPage from './pages/DashboardPage'
import NotFoundPage from './pages/NotFoundPage'
import ProtectedLayout from './layouts/ProtectedLayout'
import PlanDetailPage from './pages/PlanDetailPage'
import CreatePlanPage from './pages/CreatePlanPage'
import ReportsPage from './pages/ReportsPage'
import PublicPlansPage from './pages/PublicPlansPage'

import Navbar from './components/Navbar'

const App = () => {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Rutas protegidas */}
        <Route path="/dashboard/*" element={<ProtectedLayout />}>
          <Route index element={<DashboardPage />} />
          <Route path="plan/:semester/:subjectCode" element={<PlanDetailPage />} />
          <Route path="crear-plan" element={<CreatePlanPage />} />
          <Route path="reportes" element={<ReportsPage />} />
          <Route path="planes-publicos" element={<PublicPlansPage />} />

        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </>
  )
}

export default App
