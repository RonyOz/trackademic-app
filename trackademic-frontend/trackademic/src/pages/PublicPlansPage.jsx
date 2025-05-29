import { useEffect, useState } from "react";
import { getAllPlans, addCommentToPlan } from "../services/api";
import { calcularPromedio, getAverageColorClass } from "../utils/grades";
import Sidebar from "../components/Sidebar";
import { useAuth } from "../context/AuthContext";

const PublicPlansPage = () => {
  const [plans, setPlans] = useState([]);
  const [commentText, setCommentText] = useState({});
  const { student_id } = useAuth();

  useEffect(() => {
    console.log("Current student_id:", student_id);
    getAllPlans().then((res) => {
      console.log("First plan object:", res.data[0]); // Add this
      setPlans(res.data);
    });
  }, []);


  const handleCommentChange = (key, value) => {
    setCommentText((prev) => ({ ...prev, [key]: value }));
  };

  const handleCommentSubmit = async (plan, key) => {
  const content = commentText[key]?.trim();
  const author_id = localStorage.getItem("student_id"); // Make sure this matches your storage key

  if (!content) return alert("Escribe un comentario antes de enviarlo.");
  if (!author_id) return alert("No se pudo identificar al estudiante.");

  try {
    // Create a composite ID from existing fields
    const planId = `${plan.subject_code}-${plan.semester}-${plan.student_id}`;
    
    await addCommentToPlan(planId, { 
      author_id,  // Now properly included
      content 
    });
    
    alert("Comentario enviado");
    setCommentText((prev) => ({ ...prev, [key]: "" }));
  } catch (err) {
    console.error("Error details:", err.response?.data);
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
          <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
            {plans.map((plan, index) => {
              const key = `${plan.subject_code}-${plan.semester}-${plan.student_id}-${index}`; // solo para comentario local
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
  onClick={() => handleCommentSubmit(plan, key)} // Pass the whole plan object
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
