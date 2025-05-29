import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createPlan } from "../services/api";
import { useAuth } from "../context/AuthContext";
import Sidebar from "../components/Sidebar";

const CreatePlanPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [subjectCode, setSubjectCode] = useState("");
  const [semester, setSemester] = useState("");
  const [activities, setActivities] = useState([]);

  const [error, setError] = useState("");

  const handleAddActivity = () => {
    setActivities([
      ...activities,
      {
        name: "",
        percentage: 0,
        grade: 0.0,
        due_date: "",
      },
    ]);
  };

  const handleChangeActivity = (index, field, value) => {
    const updated = [...activities];
    if (field === "percentage" || field === "grade") {
      updated[index][field] = parseFloat(value);
    } else {
      updated[index][field] = value;
    }
    setActivities(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const total = activities.reduce((sum, a) => sum + a.percentage, 0);
if (total > 100) {
  setError("La suma de porcentajes no puede superar el 100%");
  return;
}

    try {
      const payload = {
        student_id: user.id,
        subject_code: subjectCode,
        semester,
        activities,
      };
      await createPlan(payload);
      navigate("/dashboard");
    } catch (err) {
      setError("Error al crear el plan. ¿Ya existe uno igual?");
    }
  };

  return (
    <>
      <div className="flex">
        <Sidebar />

        <main className="flex-1 p-4">
          <div className="max-w-2xl mx-auto">
            <h1 className="text-3xl font-bold mb-4">
              Crear Plan de Evaluación
            </h1>

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
                  <div
                    key={index}
                    className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4"
                  >
                    <div>
                      <label className="label">
                        <span className="label-text">Nombre</span>
                      </label>
                      <input
                        type="text"
                        placeholder="Nombre"
                        className="input input-bordered w-full"
                        value={activity.name}
                        onChange={(e) =>
                          handleChangeActivity(index, "name", e.target.value)
                        }
                        required
                      />
                    </div>

                    <div>
                      <label className="label">
                        <span className="label-text">Porcentaje (%)</span>
                      </label>
                      <input
                        type="number"
                        placeholder="0"
                        className="input input-bordered w-full"
                        value={activity.percentage}
                        onChange={(e) =>
                          handleChangeActivity(
                            index,
                            "percentage",
                            e.target.value
                          )
                        }
                        required
                      />
                    </div>

                    <div>
                      <label className="label">
                        <span className="label-text">Nota</span>
                      </label>
                      <input
                        type="number"
                        placeholder="0.0"
                        className="input input-bordered w-full"
                        value={activity.grade}
                        onChange={(e) =>
                          handleChangeActivity(index, "grade", e.target.value)
                        }
                      />
                    </div>

                    <div>
                      <label className="label">
                        <span className="label-text">Fecha de entrega</span>
                      </label>
                      <input
                        type="date"
                        className="input input-bordered w-full"
                        value={activity.due_date}
                        onChange={(e) =>
                          handleChangeActivity(
                            index,
                            "due_date",
                            e.target.value
                          )
                        }
                      />
                    </div>
                  </div>
                ))}

                <button
                  type="button"
                  className="btn btn-outline btn-sm"
                  onClick={handleAddActivity}
                >
                  + Agregar actividad
                </button>
              </div>

              <button
                type="submit"
                className="btn bg-cyan-400 w-full text-base-100"
              >
                Crear plan
              </button>
            </form>
          </div>
        </main>
      </div>
    </>
  );
};

export default CreatePlanPage;
