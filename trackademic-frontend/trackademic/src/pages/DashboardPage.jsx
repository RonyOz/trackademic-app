import { useEffect, useState } from "react";
import { getPlansByStudent } from "../services/api";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import { Navigate } from "react-router-dom";

const DashboardPage = () => {
  const { user } = useAuth();
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const res = await getPlansByStudent(user.id);
        setPlans(res.data);
      } catch (err) {
        console.error("Error al cargar los planes", err);
      } finally {
        setLoading(false);
      }
    };

    if (user?.id) {
      fetchPlans();
    }
  }, [user]);

  return (
    <div>
      <h1 className="text-3xl font-bold text-white mb-6">Mis Planes de Evaluación</h1>

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
            const totalPercentage = plan.activities?.reduce((acc, act) => acc + act.percentage, 0) ?? 0;
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
                      <span className="font-bold text-primary">
                        {plan.average?.toFixed(2) ?? "N/A"}
                      </span>
                    </p>
                    <p
                      className={`text-sm ${
                        isComplete ? "text-success" : "text-warning"
                      }`}
                    >
                      {isComplete
                        ? "Plan completo (100%)"
                        : `Plan incompleto (${totalPercentage}%)`}
                    </p>
                  </div>

                  <div className="mt-4 flex flex-col gap-2">
                    <Link
                      to={`/dashboard/plan/${plan.semester}/${plan.subject_code}`}
                      className="btn btn-outline btn-sm"
                    >
                      Ver Detalles
                    </Link>
                    <Link
                      to={`/dashboard/estimador?semester=${plan.semester}&subject_code=${plan.subject_code}`}
                      className="btn btn-info btn-sm"
                    >
                      Estimar Nota
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default DashboardPage;
