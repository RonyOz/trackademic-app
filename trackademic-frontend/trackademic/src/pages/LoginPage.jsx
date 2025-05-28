import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginRequest } from "../services/api";
import { useAuth } from "../context/AuthContext";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await loginRequest({ email, password });
      const token = res.data.access_token;
      localStorage.setItem("token", token);
      login({ token });
      navigate("/dashboard");
    } catch (err) {
      setError("Correo o contraseña inválidos");
    }
  };

  const handleRegisterClick = () => {
    navigate("/register");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200 p-4">
      <div className="card w-full max-w-sm shadow-xl backdrop-blur-sm bg-white/10 hover:shadow-2xl transition-shadow duration-300 rounded-2xl">
        <div className="card-body">
          <h2 className="text-3xl font-bold text-center text-white mb-6">
            Iniciar Sesión
          </h2>

          <div className="mb-4">
            <label className="label">
              <span className="label-text text-white">Correo electrónico</span>
            </label>
            <label className="input validator w-full">
              <svg
                className="h-[1.5em] w-[1.5em] opacity-50"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
              >
                <g
                  strokeLinejoin="round"
                  strokeLinecap="round"
                  strokeWidth="2.5"
                  fill="none"
                  stroke="currentColor"
                >
                  <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </g>
              </svg>
              <input
                type="email"
                required
                placeholder="ejemplo@email.com"
                title="Ingresa un correo válido"
              />
            </label>
          </div>

          <div className="mb-6">
            <label className="label">
              <span className="label-text text-white">Contraseña</span>
            </label>
            <label className="input validator w-full">
              <svg
                className="h-[1.5em] w-[1.5em] opacity-50"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
              >
                <g
                  strokeLinejoin="round"
                  strokeLinecap="round"
                  strokeWidth="2.5"
                  fill="none"
                  stroke="currentColor"
                >
                  <path d="M2.586 17.414A2 2 0 0 0 2 18.828V21a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h1a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h.172a2 2 0 0 0 1.414-.586l.814-.814a6.5 6.5 0 1 0-4-4z"></path>
                  <circle
                    cx="16.5"
                    cy="7.5"
                    r=".5"
                    fill="currentColor"
                  ></circle>
                </g>
              </svg>
              <input
                type="password"
                required
                placeholder="Password"
                minLength="8"
                pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
                title="Must be more than 8 characters, including number, lowercase letter, uppercase letter"
              />
            </label>
          </div>

          <div className="w-full">
            <button
              type="submit"
              className="btn bg-purple-600 hover:bg-purple-700 text-white w-full transition-all duration-300"
            >
              Ingresar
            </button>
          </div>

          <label className="label justify-center mt-4">
            <span className="text-sm text-gray-300">¿No tienes cuenta?</span>
            <a
              onClick={handleRegisterClick}
              className="text-purple-400 hover:text-purple-300 ml-2 transition-colors duration-300 cursor-pointer"
            >
              Regístrate aquí
            </a>
          </label>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
