import { useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { getEvaluationPlan } from '../services/api'
import { useAuth } from '../context/AuthContext'

const PlanDetailPage = () => {
  const { semester, subjectCode } = useParams()
  const { user } = useAuth()
  const [plan, setPlan] = useState(null)
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(null)

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

  

const handleEdit = (activity) => {
  setEditing({
    name: activity.name,
    grade: activity.grade ?? '',
    percentage: activity.percentage,
    due_date: activity.due_date?.split('T')[0] ?? '',
  })
}

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
    <th>Acciones</th>
  </tr>
</thead>
<tbody>
  {plan.activities.map((activity, index) => (
    <tr key={index}>
      <td>{activity.name}</td>
      <td>{activity.percentage}%</td>
      <td>{activity.grade !== null ? activity.grade.toFixed(1) : '—'}</td>
      <td>{activity.due_date ? new Date(activity.due_date).toLocaleDateString() : '—'}</td>
      <td>
        <button className="btn btn-xs btn-outline" onClick={() => handleEdit(activity)}>
          Editar
        </button>
      </td>
    </tr>
  ))}
</tbody>

          </table>

          {editing && (
  <form
    className="card bg-base-100 shadow-md p-4 mt-6"
    onSubmit={async (e) => {
      e.preventDefault()
      try {
        const payload = {
          name: editing.name,
          new_data: {
            grade: parseFloat(editing.grade),
            percentage: parseFloat(editing.percentage),
            due_date: editing.due_date ? new Date(editing.due_date).toISOString() : null,
          },
        }
        await updateActivity(semester, subjectCode, user.id, payload)
        window.location.reload() // recarga el plan
      } catch (err) {
        console.error('Error al actualizar actividad', err)
      }
    }}
  >
    <h2 className="text-lg font-bold mb-2">Editar actividad: {editing.name}</h2>
    <div className="grid gap-2 grid-cols-1 md:grid-cols-3">
      <input
        type="number"
        step="0.1"
        placeholder="Nota"
        className="input input-bordered w-full"
        value={editing.grade}
        onChange={(e) => setEditing({ ...editing, grade: e.target.value })}
      />
      <input
        type="number"
        placeholder="Porcentaje"
        className="input input-bordered w-full"
        value={editing.percentage}
        onChange={(e) => setEditing({ ...editing, percentage: e.target.value })}
      />
      <input
        type="date"
        className="input input-bordered w-full"
        value={editing.due_date}
        onChange={(e) => setEditing({ ...editing, due_date: e.target.value })}
      />
    </div>
    <div className="mt-4 flex gap-2">
      <button type="submit" className="btn btn-primary">Guardar</button>
      <button type="button" className="btn btn-outline" onClick={() => setEditing(null)}>
        Cancelar
      </button>
    </div>
  </form>
)}


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
