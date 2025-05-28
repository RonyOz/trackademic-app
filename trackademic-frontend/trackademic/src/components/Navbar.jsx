import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { LogOut } from "lucide-react"; // Usa lucide-react o react-icons si prefieres

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const isAuthRoute = location.pathname === "/login" || location.pathname === "/register";

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="navbar bg-base-100 px-6 shadow-md">
      {/* Logo */}
      <div className="flex-1">
        <Link to="/" className="text-2  xl font-bold text-white italic ">
          Trackademic
        </Link>
      </div>

      {/* Menú de navegación (solo si está autenticado y no es login/register) */}
      {!isAuthRoute && user && (
        <div className="flex-none flex items-center gap-4">
          <Link to="/dashboard" className="btn btn-ghost btn-sm">
            Dashboard
          </Link>
          <Link to="/dashboard/crear-plan" className="btn btn-ghost btn-sm">
            Crear Plan
          </Link>
          <button onClick={handleLogout} className="btn btn-ghost btn-sm text-error flex items-center gap-2">
            <LogOut className="w-4 h-4" />
            Salir
          </button>
        </div>
      )}
    </div>
  );
};

export default Navbar;
