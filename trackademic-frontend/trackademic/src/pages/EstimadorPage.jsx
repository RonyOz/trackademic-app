import { useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { getEstimatedGrades } from "../services/api";

const EstimadorPage = () => {
  const { user } = useAuth();
  const [params] = useSearchParams();
  const [estimaciones, setEstimaciones] = useState([]);
  const [loading, setLoading] = useState(true);

  const semester = params.get("semester");
  const subject_code = params.get("subject_code");

 useEffect(() => {
  const fetchEstimaciones = async () => {
    try {
      const res = await getEstimatedGrades(user.id, subject_code, semester);
      console.log("Estimación recibida:", res.data);

      if (typeof res.data === "number") {
        setEstimaciones(res.data);
      } else {
        setEstimaciones(null); // error o formato inesperado
      }
    } catch (err) {
      console.error("Error al calcular estimación", err);
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
    <div>
      <h1 className="text-3xl font-bold text-white mb-6">Estimador de Notas</h1>
      <p className="text-white mb-4">
        Para: <strong>{subject_code}</strong> — {semester}
      </p>

      {loading ? (
        <p className="text-white">Cargando estimación...</p>
      ) : estimaciones === null ? (
        <p className="text-error">
          No se pudo calcular la estimación. Asegúrate de tener actividades
          pendientes.
        </p>
      ) : (
        <div className="card bg-base-100 shadow-lg p-6 border border-base-300">
          <h2 className="text-xl font-bold mb-2">Resultado</h2>
          <p className="text-md text-gray-500 mb-2">
            Nota mínima promedio necesaria en las actividades restantes para
            aprobar:
          </p>
          <p
            className={`text-4xl font-bold ${
              estimaciones > 5 ? "text-error" : "text-success"
            }`}
          >
            {estimaciones.toFixed(2)}
          </p>
          {estimaciones > 5 && (
            <p className="text-warning mt-2">
              😬 No es posible alcanzar la nota mínima en las actividades
              restantes.
            </p>
          )}
        </div>
      )}
    </div>
  );    
};

export default EstimadorPage;
