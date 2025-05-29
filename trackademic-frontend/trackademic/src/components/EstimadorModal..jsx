import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { getEstimatedGrades } from "../services/api";
import { calcularNotaMinima } from "../utils/grades";

const EstimadorModal = ({ semester, subject_code, onClose }) => {
  const { user } = useAuth();
  const [estimaciones, setEstimaciones] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEstimaciones = async () => {
      try {
        const res = await getEstimatedGrades(user.id, subject_code, semester);
        if (typeof res.data === "number") {
          setEstimaciones(res.data);
        } else {
          setEstimaciones(null);
        }
      } catch (err) {
        setEstimaciones(null);
      } finally {
        setLoading(false);
      }
    };

    if (user?.id && semester && subject_code) {
      fetchEstimaciones();
    }
  }, [user, semester, subject_code]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-base-100 p-6 rounded-lg shadow-lg max-w-lg w-full relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 btn btn-sm btn-circle btn-ghost"
          aria-label="Cerrar modal"
        >
          ✕
        </button>
        <h1 className="text-3xl font-bold mb-6">Estimador de Notas</h1>
        <p className="mb-4">
          Para: <strong>{subject_code}</strong> — {semester}
        </p>

        {loading ? (
          <p>Cargando estimación...</p>
        ) : estimaciones === null ? (
          <p className="text-error">
            No se pudo calcular la estimación. Asegúrate de tener actividades
            pendientes.
          </p>
        ) : estimaciones === 0 ? (
          <div className="text-success text-lg bg-base-200 p-4 rounded-lg">
            🎉 ¡Ya tienes las notas necesarias para aprobar!
          </div>
        ) : (
          <div className="p-4 border border-base-300 rounded-lg">
            <h2 className="text-xl font-bold mb-2">Resultado</h2>
            <p className="text-gray-500 mb-2">
              Nota mínima promedio necesaria en las actividades restantes para
              aprobar:
            </p>
            {estimaciones === -2 ? (
              <p className="text-warning">
                No se puede calcular la nota mínima porque no hay notas
                registradas aún. 💬
              </p>
            ) : estimaciones === -1 ? (
              <p className="text-error">
                No es posible aprobar con las actividades restantes. 😞
              </p>
            ) : estimaciones === 0 ? (
              <div className="text-success text-lg bg-base-200 p-4 rounded-lg">
                🎉 ¡Ya tienes las notas necesarias para aprobar!
              </div>
            ) : (
              <>
                <p
                  className={`text-4xl font-bold ${
                    estimaciones > 5 ? "text-error" : "text-success"
                  }`}
                >
                  {estimaciones.toFixed(2)}
                </p>
                {estimaciones < 3 && (
                  <p className="text-warning mt-2">
                    Necesitas mejorar tu rendimiento en las actividades
                    restantes para aprobar.
                    {estimaciones.toFixed(2)}
                  </p>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default EstimadorModal;
