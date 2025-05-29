import { useEffect, useState } from "react";
import { getPlansByStudent } from "../services/api";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { calcularPromedio, tieneNotasPendientes, getAverageColorClass } from "../utils/grades";
import EstimadorModal from "../components/EstimadorModal.";

const DashboardPage = () => {
  const { user } = useAuth();
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);

  // Estado para modal
  const [modalData, setModalData] = useState(null);

  useEffect(() => {
    const fetchPlansWithAverages = async () => {
      try {
        const res = await getPlansByStudent(user.id);
        setPlans(res.data);
      } catch (err) {
        console.error("Error al obtener planes:", err);
      } finally {
        setLoading(false);
      }
    };

    if (user?.id) {
      fetchPlansWithAverages();
    }
  }, [user]);

  // Abrir modal con datos
  const openEstimador = (semester, subject_code) => {
    setModalData({ semester, subject_code });
  };

  // Cerrar modal
  const closeEstimador = () => {
    setModalData(null);
  };

  return (
    <>
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-4">
          <h1 className="text-3xl font-bold text-white mb-6">
            Mis Planes de Evaluación
          </h1>

          {loading ? (
            <div className="text-white">Cargando...</div>
          ) : plans.length === 0 ? (
            <div className="text-white">
              No tienes planes registrados.{" "}
              <Link to="/plans/new" className="link link-primary">
                Crear uno
              </Link>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
              {plans.map((plan, index) => {
                const totalPercentage =
                  plan.activities?.reduce((acc, act) => acc + act.percentage, 0) ?? 0;
                const isComplete = totalPercentage === 100;

                return (
                  <div
                    key={index}
                    className="card bg-base-100 shadow-xl p-4 transition hover:shadow-2xl border border-base-300"
                  >
                    <div className="card-body">
                      <h2 className="text-xl font-bold">{plan.subject_code}</h2>
                      <p className="text-sm text-gray-400">
                        Semestre: {plan.semester}
                      </p>

                      <div className="mt-2">
                        <p className="text-lg">
                          Promedio:{" "}
                          <span
                            className={`font-bold ${getAverageColorClass(
                              calcularPromedio(plan.activities)
                            )}`}
                          >
                            {calcularPromedio(plan.activities).toFixed(2)}
                          </span>
                        </p>
                        {isComplete ? (
                          tieneNotasPendientes(plan.activities) ? (
                            <p className="text-warning text-sm">Plan con notas pendientes</p>
                          ) : (
                            <p className="text-success text-sm">Plan completo (100%)</p>
                          )
                        ) : (
                          <p className="text-warning text-sm">Plan incompleto ({totalPercentage}%)</p>
                        )}
                      </div>

                      <div className="mt-4 flex flex-col gap-2">
                        <Link
                          to={`/dashboard/plan/${plan.semester}/${plan.subject_code}`}
                          className="btn btn-outline btn-sm"
                        >
                          Ver Detalles
                        </Link>
                        <button
                          onClick={() => openEstimador(plan.semester, plan.subject_code)}
                          className="btn bg-cyan-400 btn-sm text-base-100"
                        >
                          Estimar Nota
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </main>
      </div>

      {/* Mostrar modal si hay datos */}
      {modalData && (
        <EstimadorModal
          semester={modalData.semester}
          subject_code={modalData.subject_code}
          onClose={closeEstimador}
        />
      )}
    </>
  );
};

export default DashboardPage;
