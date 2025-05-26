import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createPlan } from '../services/api'
import { useAuth } from '../context/AuthContext'

const CreatePlanPage = () => {
  const { user } = useAuth()
  const navigate = useNavigate()

  const [subjectCode, setSubjectCode] = useState('')
  const [semester, setSemester] = useState('')
  const [activities, setActivities] = useState([])
  const [error, setError] = useState('')

  const handleAddActivity = () => {
    setActivities([...activities, { name: '', percentage: 0 }])
  }

  const handleChangeActivity = (index, field, value) => {
    const updated = [...activities]
    updated[index][field] = field === 'percentage' ? parseFloat(value) : value
    setActivities(updated)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const total = activities.reduce((sum, a) => sum + a.percentage, 0)
    if (total !== 100) {
      setError('La suma de porcentajes debe ser 100%')
      return
    }
    try {
      const payload = {
        student_id: user.id,
        subject_code: subjectCode,
        semester,
        activities,
      }
      await createPlan(payload)
      navigate('/dashboard')
    } catch (err) {
      setError('Error al crear el plan. ¿Ya existe uno igual?')
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">Crear Plan de Evaluación</h1>

      {error && <div className="text-error mb-4">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Código de la materia"
          className="input input-bordered w-full"
          value={subjectCode}
          onChange={(e) => setSubjectCode(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Semestre (ej: 2025-1)"
          className="input input-bordered w-full"
          value={semester}
          onChange={(e) => setSemester(e.target.value)}
          required
        />

        <div>
          <h2 className="font-bold mt-4 mb-2">Actividades</h2>
          {activities.map((activity, index) => (
            <div key={index} className="flex gap-2 mb-2">
              <input
                type="text"
                placeholder="Nombre"
                className="input input-bordered w-full"
                value={activity.name}
                onChange={(e) => handleChangeActivity(index, 'name', e.target.value)}
                required
              />
              <input
                type="number"
                placeholder="%"
                className="input input-bordered w-24"
                value={activity.percentage}
                onChange={(e) => handleChangeActivity(index, 'percentage', e.target.value)}
                required
              />
            </div>
          ))}
          <button type="button" className="btn btn-outline btn-sm" onClick={handleAddActivity}>
            + Agregar actividad
          </button>
        </div>

        <button type="submit" className="btn btn-primary w-full">Crear plan</button>
      </form>
    </div>
  )
}

export default CreatePlanPage
