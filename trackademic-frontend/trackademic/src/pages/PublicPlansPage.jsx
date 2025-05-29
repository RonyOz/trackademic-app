import { useEffect, useState } from "react";
import { getAllPlans, addCommentToPlan } from "../services/api";
import { calcularPromedio, getAverageColorClass } from "../utils/grades";
import Sidebar from "../components/Sidebar";
import { useAuth } from "../context/AuthContext";

const PublicPlansPage = () => {
  const [plans, setPlans] = useState([]);
  const [commentText, setCommentText] = useState({});
  const [selectedPlan, setSelectedPlan] = useState(null);
  const { user } = useAuth();
  const author_id = user?.id;

  useEffect(() => {
    const fetchPlans = async () => {
      const res = await getAllPlans();

      // Solo mostrar planes de otros usuarios
      const filteredPlans = res.data.filter((p) => p.student_id !== user?.id);
      setPlans(filteredPlans);
    };

    if (user?.id) fetchPlans();
  }, [user]);

  const handleCommentChange = (key, value) => {
    setCommentText((prev) => ({ ...prev, [key]: value }));
  };

  const handleCommentSubmit = async (plan, key) => {
  const content = commentText[key]?.trim();

  if (!content) return alert("Escribe un comentario antes de enviarlo.");
  if (!author_id) return alert("No se pudo identificar al estudiante.");
  
  // Change from plan.id to plan._id
  const planId = plan._id; 
  if (!planId) return alert("No se encontró el ID del plan.");

  try {
    await addCommentToPlan(planId, {
      author_id,
      content,
    });

    alert("Comentario enviado");
    setCommentText((prev) => ({ ...prev, [key]: "" }));
  } catch (err) {
    console.error("Error al enviar comentario:", err.response?.data);
    alert(`Error: ${err.response?.data?.detail || err.message}`);
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
          <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2">
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

                    {plan.Comments?.length > 0 && (
                      <div className="mt-4">
                        <p className="text-sm font-semibold text-gray-500">Comentarios:</p>
                        <ul className="text-sm pl-4 list-disc">
                          {plan.Comments.slice(0, 3).map((c, i) => (
                            <li key={i}>
                              {c.content}{" "}
                              <span className="text-xs text-gray-400">por {c.author_id}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

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
                        onClick={() => handleCommentSubmit(plan, key)}
                      >
                        Enviar Comentario
                      </button>
                    </div>

                    <button
                      className="btn btn-outline btn-xs mt-2"
                      onClick={() => setSelectedPlan(plan)}
                    >
                      Ver actividades
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Modal de actividades */}
        {selectedPlan && (
          <dialog id="modal_actividades" className="modal modal-open">
            <div className="modal-box">
              <h3 className="font-bold text-lg mb-2">
                Actividades de {selectedPlan.subject_code} ({selectedPlan.semester})
              </h3>
              <ul className="list-disc pl-5 space-y-1">
                {selectedPlan.activities.map((act, i) => (
                  <li key={i}>
                    <strong>{act.name}</strong> — {act.percentage}% —{" "}
                    {act.grade !== null ? `Nota: ${act.grade}` : "Sin nota"} —{" "}
                    {new Date(act.due_date).toLocaleDateString()}
                  </li>
                ))}
              </ul>
              <div className="modal-action">
                <button
                  className="btn"
                  onClick={() => setSelectedPlan(null)}
                >
                  Cerrar
                </button>
              </div>
            </div>
          </dialog>
        )}
      </main>
    </div>
  );
};

export default PublicPlansPage;
