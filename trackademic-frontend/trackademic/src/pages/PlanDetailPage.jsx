import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  getEvaluationPlan,
  updateActivity,
  getEstimatedGrades,
} from "../services/api";
import { useAuth } from "../context/AuthContext";
import Sidebar from "../components/Sidebar";
import { calcularPromedio, tieneNotasPendientes, getAverageColorClass } from "../utils/grades";
import { Pencil, Trash } from "lucide-react";

const PlanDetailPage = () => {
  const { semester, subjectCode } = useParams();
  const { user } = useAuth();
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [activityToDeleteIndex, setActivityToDeleteIndex] = useState(null);

  useEffect(() => {
    const fetchPlan = async () => {
      try {
        const res = await getEvaluationPlan(semester, subjectCode, user.id);
        const planData = res.data;

        console.log("Plan recibido:", planData);

        // 🔥 Calcular promedio real
        const estimate = await getEstimatedGrades(
          user.id,
          subjectCode,
          semester
        );
        planData.average = estimate.data;

        setPlan(planData);
      } catch (err) {
        console.error("Error al cargar el plan", err);
      } finally {
        setLoading(false);
      }
    };

    if (user?.id) fetchPlan();
  }, [semester, subjectCode, user]);

  const handleEdit = (activity) => {
    setEditing({
      name: activity.name,
      grade: activity.grade ?? 0.0,
      percentage: activity.percentage,
      due_date: activity.due_date?.split("T")[0] ?? "",
    });
  };

  const handleDelete = (index) => {
    setActivityToDeleteIndex(index);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    const nuevasActividades = [...plan.activities];
    nuevasActividades.splice(activityToDeleteIndex, 1);

    try {
      await updateActivity(semester, subjectCode, user.id, {
        activities: nuevasActividades,
      });

      setPlan({ ...plan, activities: nuevasActividades });
      setShowDeleteModal(false);
      setActivityToDeleteIndex(null);
    } catch (err) {
      console.error(
        "Error al eliminar actividad:",
        err.response?.data || err.message
      );
      alert("No se pudo eliminar la actividad.");
    }
  };

  return (
    <>
      <div className="flex">
        <Sidebar />

        <main className="flex-1 p-4">
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
                        <td>
                          {activity.grade !== null
                            ? activity.grade.toFixed(1)
                            : 0.0}
                        </td>
                        <td>
                          {activity.due_date
                            ? new Date(activity.due_date).toLocaleDateString()
                            : "—"}
                        </td>
                        <td>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleEdit(activity)}
                              className="btn btn-sm btn-ghost tooltip"
                              data-tip="Editar"
                            >
                              <Pencil className="w-4 h-4 text-info" />
                            </button>
                            <button
                              onClick={() => handleDelete(index)}
                              className="btn btn-sm btn-ghost tooltip"
                              data-tip="Eliminar"
                            >
                              <Trash className="w-4 h-4 text-error" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {editing && (
                  <form
                    className="card bg-base-100 shadow-md p-4 mt-6"
                    onSubmit={async (e) => {
                      e.preventDefault();
                      try {
                        const payload = {
                          name: editing.name,
                          new_data: {
                            grade:
                              editing.grade !== ""
                                ? parseFloat(editing.grade)
                                : null,
                            percentage: parseFloat(editing.percentage),
                            due_date: editing.due_date
                              ? new Date(editing.due_date).toISOString()
                              : null,
                          },
                        };

                        // Ver qué estás enviando
                        console.log("Payload a enviar:", payload);

                        // Verificar valores numéricos antes de enviar
                        if (
                          isNaN(payload.new_data.percentage) ||
                          (payload.new_data.grade !== null &&
                            isNaN(payload.new_data.grade))
                        ) {
                          console.error("Error: porcentaje o nota inválida");
                          return;
                        }

                        await updateActivity(
                          semester,
                          subjectCode,
                          user.id,
                          payload
                        );

                        // Confirmación visual rápida en consola
                        console.log("Actualización exitosa");
                        await updateActivity(
                          semester,
                          subjectCode,
                          user.id,
                          payload
                        );
                        // recargar el plan sin recargar la página
                        const res = await getEvaluationPlan(
                          semester,
                          subjectCode,
                          user.id
                        );
                        setPlan(res.data);
                        setEditing(null);
                      } catch (err) {
                        // Captura de errores detallada
                        console.error(
                          "Error al actualizar actividad:",
                          err.response?.data || err.message
                        );
                      }
                    }}
                  >
                    <h2 className="text-lg font-bold mb-2">
                      Editar actividad: {editing.name}
                    </h2>
                    <div className="grid gap-2 grid-cols-1 md:grid-cols-3">
                      <input
                        type="number"
                        step="0.1"
                        placeholder="Nota"
                        className="input input-bordered w-full"
                        value={editing.grade}
                        onChange={(e) =>
                          setEditing({ ...editing, grade: e.target.value })
                        }
                      />
                      <input
                        type="number"
                        placeholder="Porcentaje"
                        className="input input-bordered w-full"
                        value={editing.percentage}
                        onChange={(e) =>
                          setEditing({ ...editing, percentage: e.target.value })
                        }
                      />
                      <input
                        type="date"
                        className="input input-bordered w-full"
                        value={editing.due_date}
                        onChange={(e) =>
                          setEditing({ ...editing, due_date: e.target.value })
                        }
                      />
                    </div>
                    <div className="mt-4 flex gap-2">
                      <button
                        type="submit"
                        className="btn bg-cyan-400 text-base-100"
                      >
                        Guardar
                      </button>
                      <button
                        type="button"
                        className="btn btn-outline"
                        onClick={() => setEditing(null)}
                      >
                        Cancelar
                      </button>
                    </div>
                  </form>
                )}

                <div className="mt-4">
                  <p className={`font-bold ${getAverageColorClass(calcularPromedio(plan.activities))}`}>
                    Promedio actual:{" "}
                    {calcularPromedio(plan.activities).toFixed(2)}
                  </p>
                </div>
              </div>
            )}
          </div>
          {showDeleteModal && (
            <dialog className="modal modal-open">
              <div className="modal-box">
                <h3 className="font-bold text-lg">¿Eliminar actividad?</h3>
                <p className="py-4">Esta acción no se puede deshacer.</p>
                <div className="modal-action">
                  <button onClick={confirmDelete} className="btn btn-error">
                    Sí, eliminar
                  </button>
                  <button
                    onClick={() => {
                      setShowDeleteModal(false);
                      setActivityToDeleteIndex(null);
                    }}
                    className="btn btn-outline"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            </dialog>
          )}
        </main>
      </div>
    </>
  );
};

export default PlanDetailPage;
