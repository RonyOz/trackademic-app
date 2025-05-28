import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerRequest } from "../services/api";
import { FiUser, FiMail, FiLock, FiFileText } from "react-icons/fi";

const RegisterPage = () => {
  const [formData, setFormData] = useState({
  id: "",
  email: "",
  password: "",
  full_name: ""
});
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await registerRequest(formData);
      setSuccess("Registro exitoso. Puedes iniciar sesión.");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setError("Error al registrar");
    }
  };

  return (
  <div className="min-h-screen flex items-center justify-center bg-base-200 p-4">
    <div className="card w-full max-w-sm shadow-xl backdrop-blur-sm bg-white/10 hover:shadow-2xl transition-shadow duration-300 rounded-2xl">
      <form onSubmit={handleSubmit} className="card-body">
        <h2 className="text-3xl font-bold text-center text-white mb-6">
          Registrarse
        </h2>

        {error && <div className="text-error mb-3">{error}</div>}
        {success && <div className="text-success mb-3">{success}</div>}

        <div className="mb-4">
          <label className="label">
            <span className="label-text text-white">Número de documento</span>
          </label>
          <label className="input validator w-full">
            <FiFileText className="h-[1.5em] w-[1.5em] opacity-50" />
            <input
              type="text"
              name="id"
              placeholder="Número de documento"
              value={formData.id}
              onChange={handleChange}
              required
            />
          </label>
        </div>

        <div className="mb-4">
          <label className="label">
            <span className="label-text text-white">Nombre completo</span>
          </label>
          <label className="input validator w-full">
            <FiUser className="h-[1.5em] w-[1.5em] opacity-50" />
            <input
              type="text"
              name="full_name"
              placeholder="Nombre completo"
              value={formData.full_name}
              onChange={handleChange}
              required
            />
          </label>
        </div>

        <div className="mb-4">
          <label className="label">
            <span className="label-text text-white">Correo electrónico</span>
          </label>
          <label className="input validator w-full">
            <FiMail className="h-[1.5em] w-[1.5em] opacity-50" />
            <input
              type="email"
              name="email"
              placeholder="ejemplo@email.com"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </label>
        </div>

        <div className="mb-6">
          <label className="label">
            <span className="label-text text-white">Contraseña</span>
          </label>
          <label className="input validator w-full">
            <FiLock className="h-[1.5em] w-[1.5em] opacity-50" />
            <input
              type="password"
              name="password"
              placeholder="Contraseña"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </label>
        </div>

        <div className="w-full">
          <button
            type="submit"
            className="btn bg-purple-600 hover:bg-purple-700 text-white w-full transition-all duration-300"
          >
            Crear cuenta
          </button>
        </div>

        <label className="label justify-center mt-4">
          <span className="text-sm text-gray-300">¿Ya tienes cuenta?</span>
          <a href="/login" className="text-purple-400 hover:text-purple-300 ml-2 transition-colors duration-300 cursor-pointer">
            Inicia sesión
          </a>
        </label>
      </form>
    </div>
  </div>
);

};

export default RegisterPage;
