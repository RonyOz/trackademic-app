import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginRequest } from "../services/api";
import { useAuth } from "../context/AuthContext";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false); 
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  setError("");

  try {
    const res = await loginRequest({ email, password });
    console.log("FULL RESPONSE:", res); // Add this
    console.log("Response data:", res.data); // Add this
    
    const token = res?.data?.access_token;
    console.log("Token received:", token); // Add this
    
    if (!token) {
      console.warn("No access_token received:", res.data);
      setError("Correo o contraseña inválidos");
      return;
    }

    // Add this debug line:
    console.log("Before calling login()");
    
    login(res.data);
    
    // Add this debug line:
    console.log("After calling login() - checking auth state");
    
    navigate("/dashboard");
  } catch (err) {
    console.error("Login error:", err.response?.data || err.message);
    setError("Correo o contraseña inválidos");
  } finally {
    setLoading(false);
  }
};


  const handleRegisterClick = () => {
    navigate("/register");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200 p-4">
      <div className="card w-full max-w-sm shadow-xl backdrop-blur-sm bg-white/10 hover:shadow-2xl transition-shadow duration-300 rounded-2xl">
        <form onSubmit={handleSubmit} className="card-body">
          <h2 className="text-3xl font-bold text-center text-white mb-6">
            Iniciar Sesión
          </h2>

          {/* email input */}
          <div className="mb-4">
            <label className="label">
              <span className="label-text text-white">Correo electrónico</span>
            </label>
            <label className="input validator w-full">
              {/* svg icon */}
              <svg className="h-[1.5em] w-[1.5em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <g strokeLinejoin="round" strokeLinecap="round" strokeWidth="2.5" fill="none" stroke="currentColor">
                  <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </g>
              </svg>
              <input
                type="email"
                required
                placeholder="ejemplo@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                title="Ingresa un correo válido"
              />
            </label>
          </div>

          {/* password input */}
          <div className="mb-6">
            <label className="label">
              <span className="label-text text-white">Contraseña</span>
            </label>
            <label className="input validator w-full">
              {/* svg icon */}
              <svg className="h-[1.5em] w-[1.5em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <g strokeLinejoin="round" strokeLinecap="round" strokeWidth="2.5" fill="none" stroke="currentColor">
                  <path d="M2.586 17.414A2 2 0 0 0 2 18.828V21a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h1a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h.172a2 2 0 0 0 1.414-.586l.814-.814a6.5 6.5 0 1 0-4-4z"></path>
                  <circle cx="16.5" cy="7.5" r=".5" fill="currentColor"></circle>
                </g>
              </svg>
              <input
                type="password"
                required
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </label>
          </div>

          {error && <p className="text-red-400 text-sm text-center mb-2">{error}</p>}

          {/* button with spinner */}
          <div className="w-full">
            <button
              type="submit"
              disabled={loading} 
              className={`btn w-full transition-all duration-300 ${loading ? "bg-cyan-400 cursor-not-allowed" : "bg-cyan-600 hover:bg-cyan-700 text-white"}`}
            >
              {loading ? (
                <span className="loading loading-spinner loading-sm text-white"></span> 
              ) : (
                "Ingresar"
              )}
            </button>
          </div>

          <label className="label justify-center mt-4">
            <span className="text-sm text-gray-300">¿No tienes cuenta?</span>
            <a
              onClick={handleRegisterClick}
              className="text-cyan-400 hover:text-cyan-300 ml-2 transition-colors duration-300 cursor-pointer"
            >
              Regístrate aquí
            </a>
          </label>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
