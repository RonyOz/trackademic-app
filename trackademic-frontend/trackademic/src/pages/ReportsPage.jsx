import { useEffect, useState } from 'react'
import { getGradeConsolidation, getPercentageReport, getCommentsReport } from '../services/api'

const ReportsPage = () => {
  const [consolidation, setConsolidation] = useState(null)
  const [percentages, setPercentages] = useState(null)
  const [comments, setComments] = useState(null)
  const studentId = localStorage.getItem('student_id') // o ajusta según cómo guardas los datos
  const semester = '2025-1' // Temporal

  useEffect(() => {
    getGradeConsolidation(studentId, semester).then(res => setConsolidation(res.data))
    getPercentageReport(semester).then(res => setPercentages(res.data))
    getCommentsReport(studentId).then(res => setComments(res.data))
  }, [])

  return (
    <div>
      <h2>Reporte de Consolidado</h2>
      <pre>{JSON.stringify(consolidation, null, 2)}</pre>

      <h2>Actividades por Peso</h2>
      <pre>{JSON.stringify(percentages, null, 2)}</pre>

      <h2>Comentarios por Plan</h2>
      <pre>{JSON.stringify(comments, null, 2)}</pre>
    </div>
  )
}

export default ReportsPage
