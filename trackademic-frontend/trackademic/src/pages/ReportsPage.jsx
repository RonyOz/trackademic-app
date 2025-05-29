import { useEffect, useState } from "react";
import {
  getGradeConsolidation,
  getPercentageReport,
  getCommentsReport,
} from "../services/api";
import Sidebar from "../components/Sidebar";
import { useAuth } from "../context/AuthContext";

const ReportsPage = () => {
  const [consolidation, setConsolidation] = useState(null)
  const [percentages, setPercentages] = useState(null)
  const [comments, setComments] = useState(null)
  const [semester, setSemester] = useState('2025-1')
  const [loading, setLoading] = useState(false)
  const studentId = localStorage.getItem('student_id')
  const { user } = useAuth();

  const availableSemesters = [
    '2025-1',
    '2024-2',
    '2024-1',
    '2023-2',
    '2023-1'
  ]

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const [consolidationRes, percentagesRes, commentsRes] = await Promise.all([
          getGradeConsolidation(studentId, semester),
          getPercentageReport(semester),
          getCommentsReport(studentId)
        ])
        setConsolidation(consolidationRes.data)
        setPercentages(percentagesRes.data)
        setComments(commentsRes.data)
      } catch (error) {
        console.error('Error fetching reports:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [semester, studentId])

  return (
    <>
      <div className="flex min-h-screen bg-base-200">
        <Sidebar />

        <main className="flex-1 p-6 space-y-6">
          <div>
            <h1 className="text-4xl font-bold text-white mb-4">
              Reportes Académicos
            </h1>

            <div className="flex justify-between items-center mb-8">
              <div className="text-lg font-semibold">
                Estudiante: {user.name || user.email}
              </div>
              <div className="form-control w-64">
                <label className="label">
                  <span className="label-text">Seleccionar Semestre</span>
                </label>
                <select
                  className="select select-bordered"
                  value={semester}
                  onChange={(e) => setSemester(e.target.value)}
                >
                  {availableSemesters.map((sem) => (
                    <option key={sem} value={sem}>
                      {sem}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {loading ? (
              <div className="flex justify-center my-12">
                <span className="loading loading-spinner loading-lg"></span>
              </div>
            ) : (
              <div className="space-y-8">
                <div className="card bg-base-100 shadow-lg">
                  <div className="card-body">
                    <h2 className="card-title text-xl font-bold mb-4">
                      Reporte de Consolidado
                    </h2>
                    <div className="mockup-code">
                      <pre className="p-4">
                        <code>{JSON.stringify(consolidation, null, 2)}</code>
                      </pre>
                    </div>
                  </div>
                </div>

                <div className="card bg-base-100 shadow-lg">
                  <div className="card-body">
                    <h2 className="card-title text-xl font-bold mb-4">
                      Actividades por Peso
                    </h2>
                    <div className="mockup-code">
                      <pre className="p-4">
                        <code>{JSON.stringify(percentages, null, 2)}</code>
                      </pre>
                    </div>
                  </div>
                </div>

                <div className="card bg-base-100 shadow-lg">
                  <div className="card-body">
                    <h2 className="card-title text-xl font-bold mb-4">
                      Comentarios por Plan
                    </h2>
                    <div className="mockup-code">
                      <pre className="p-4">
                        <code>{JSON.stringify(comments, null, 2)}</code>
                      </pre>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </>
  );
};

export default ReportsPage;
