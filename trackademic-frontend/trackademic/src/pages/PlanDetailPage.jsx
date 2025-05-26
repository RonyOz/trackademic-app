import { useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { getEvaluationPlan } from '../services/api'
import { useAuth } from '../context/AuthContext'

const PlanDetailPage = () => {
  const { semester, subjectCode } = useParams()
  const { user } = useAuth()
  const [plan, setPlan] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPlan = async () => {
      try {
        const res = await getEvaluationPlan(semester, subjectCode, user.id)
        setPlan(res.data)
      } catch (err) {
        console.error('Error al cargar el plan', err)
      } finally {
        setLoading(false)
      }
    }

    if (user?.id) fetchPlan()
  }, [semester, subjectCode, user])

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">
        {subjectCode} - {semester}
      </h1>

      {loading ? (
        <p>Cargando...</p>
      ) : !plan ? (
        <p>No se encontró el plan.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="table table-zebra w-full">
            <thead>
              <tr>
                <th>Actividad</th>
                <th>Porcentaje</th>
                <th>Nota</th>
                <th>Fecha</th>
              </tr>
            </thead>
            <tbody>
              {plan.activities.map((activity, index) => (
                <tr key={index}>
                  <td>{activity.name}</td>
                  <td>{activity.percentage}%</td>
                  <td>{activity.grade !== null ? activity.grade.toFixed(1) : '—'}</td>
                  <td>{activity.due_date ? new Date(activity.due_date).toLocaleDateString() : '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="mt-4">
            <p className="text-lg">
              Promedio actual:{" "}
              <span className="font-bold">
                {plan.average !== null ? plan.average.toFixed(2) : 'No calculado'}
              </span>
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

export default PlanDetailPage
