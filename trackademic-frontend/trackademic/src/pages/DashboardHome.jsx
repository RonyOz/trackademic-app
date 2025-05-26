import { useEffect, useState } from 'react'
import { getPlansByStudent } from '../services/api'
import { useAuth } from '../context/AuthContext'
import { Link } from 'react-router-dom'

const DashboardHome = () => {
  const { user } = useAuth()
  const [plans, setPlans] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const res = await getPlansByStudent(user.id)
        setPlans(res.data)
      } catch (err) {
        console.error('Error al cargar los planes', err)
      } finally {
        setLoading(false)
      }
    }

    if (user?.id) {
      fetchPlans()
    }
  }, [user])

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Mis Planes de Evaluación</h1>
      {loading ? (
        <p>Cargando...</p>
      ) : plans.length === 0 ? (
        <p>No tienes planes registrados. <Link to="/dashboard/plans/new" className="link link-primary">Crear uno</Link></p>
      ) : (
        <div className="grid gap-4">
          {plans.map((plan, index) => (
            <div key={index} className="card bg-base-100 shadow-md p-4">
              <h2 className="text-xl font-semibold">{plan.subject_code} ({plan.semester})</h2>
              <p className="mt-1">Promedio: <span className="font-bold">{plan.average?.toFixed(2) ?? 'N/A'}</span></p>
              <div className="mt-2">
                <Link to={`/dashboard/plans/${plan.semester}/${plan.subject_code}`} className="btn btn-outline btn-sm">Ver Detalles</Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default DashboardHome
