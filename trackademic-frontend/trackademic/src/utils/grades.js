//utils/grades.js

export const calcularPromedio = (activities) => {
  const notasValidas = activities.filter(
    (a) => a.grade !== null && !isNaN(a.grade)
  );

  const totalPeso = notasValidas.reduce((acc, act) => acc + act.percentage, 0);

  if (totalPeso === 0) return 0;

  const totalNotas = notasValidas.reduce(
    (acc, act) => acc + act.grade * act.percentage,
    0
  );

  return totalNotas / totalPeso;
};


export const getAverageColorClass = (average) => {
  if (average < 3) return "text-error";
  if (average >= 3 && average <= 3.7) return "text-warning";
  if (average > 3.7) return "text-success";
  return "";
};


export const allActivitiesHaveGrades = (activities) => {
  return activities.every(
    (act) =>
      act.grade !== null &&
      act.grade !== undefined &&
      !isNaN(act.grade)
  );
};


export const tieneNotasPendientes = (activities) => {
  return activities.some(
    (act) =>
      act.grade === null ||
      act.grade === undefined ||
      isNaN(act.grade)
  );
};


export const calcularNotaMinima = (actividades) => {
  const total = actividades.reduce((acc, act) => acc + act.percentage, 0);
  const conNota = actividades.filter((a) => !isNaN(a.grade) && a.grade > 0);
  const sinNota = actividades.filter((a) => isNaN(a.grade) || a.grade === 0);

  const hasRecordedGrades = actividades.some(a => a.grade !== null && !isNaN(a.grade));
  
  if (!hasRecordedGrades) {
    return -2; // Special code for "no grades recorded yet"
  }


  const notaActual = conNota.reduce(
    (acc, a) => acc + (a.grade * a.percentage) / 100,
    0
  );

  const porcentajeRestante = sinNota.reduce((acc, a) => acc + a.percentage, 0);

  // Si no hay actividades restantes, no se puede estimar nada
  if (porcentajeRestante === 0) return null;

  const notaMinima = (3 - notaActual) / (porcentajeRestante / 100);

  return notaMinima;
};
