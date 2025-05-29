import { useEffect, useState } from "react";
import { getAllPlans, addCommentToPlan } from "../services/api";
import { calcularPromedio, getAverageColorClass } from "../utils/grades";
import Sidebar from "../components/Sidebar";

const PublicPlansPage = () => {
  const [plans, setPlans] = useState([]);
  const [commentText, setCommentText] = useState({});

  useEffect(() => {
    getAllPlans().then((res) => setPlans(res.data));
    console.log(plans.map((p) => p.id));
  }, []);

  const handleCommentChange = (key, value) => {
    setCommentText((prev) => ({ ...prev, [key]: value }));
  };

  const handleCommentSubmit = async (planId, key) => {
    const content = commentText[key]?.trim();
    const author_id = localStorage.getItem("student_id");

    if (!content) return alert("Escribe un comentario antes de enviarlo.");

    try {
      await addCommentToPlan(planId, { author_id, content });
      alert("Comentario enviado");
      setCommentText((prev) => ({ ...prev, [key]: "" }));
    } catch (err) {
      console.error("Error al enviar comentario:", err);
      alert("Ocurrió un error.");
    }
  };

  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 p-6">
        <h1 className="text-3xl font-bold text-white mb-6">
          Planes Públicos de Evaluación
        </h1>

        {plans.length === 0 ? (
          <p className="text-white">No hay planes públicos disponibles.</p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
            {plans.map((plan, index) => {
              const key = `${plan.subject_code}-${plan.semester}-${plan.student_id}-${index}`;
              const promedio = calcularPromedio(plan.activities);
              const promedioClass = getAverageColorClass(promedio);

              return (
                <div
                  key={key}
                  className="card bg-base-100 shadow-xl p-4 transition hover:shadow-2xl border border-base-300"
                >
                  <div className="card-body">
                    <h2 className="text-xl font-bold">{plan.subject_code}</h2>
                    <p className="text-sm text-gray-400">
                      Semestre: {plan.semester}
                    </p>
                    <p className="text-sm text-gray-400">
                      Estudiante ID: {plan.student_id}
                    </p>

                    <div className="mt-2">
                      <p className="text-lg">
                        Promedio:{" "}
                        <span className={`font-bold ${promedioClass}`}>
                          {promedio.toFixed(2)}
                        </span>
                      </p>
                      <p className="text-sm text-gray-400">
                        Actividades: {plan.activities.length}
                      </p>
                    </div>

                    <div className="mt-4">
                      <textarea
                        className="textarea textarea-bordered w-full text-sm"
                        rows={2}
                        placeholder="Escribe un comentario..."
                        value={commentText[key] || ""}
                        onChange={(e) =>
                          handleCommentChange(key, e.target.value)
                        }
                      />
                      <button
                        className="btn bg-cyan-400 btn-sm mt-2 text-base-100"
                        onClick={() => handleCommentSubmit(key, key)}
                      >
                        Enviar Comentario
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
  );
};

export default PublicPlansPage;
