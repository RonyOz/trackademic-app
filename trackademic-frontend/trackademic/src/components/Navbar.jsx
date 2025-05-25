import { Link } from 'react-router-dom'

const Navbar = () => {
  return (
    <div className="navbar bg-base-100 shadow-md">
      <div className="flex-1">
        <Link to="/dashboard" className="btn btn-ghost text-xl">
          Trackademic
        </Link>
      </div>
      <div className="flex-none">
        <Link to="/dashboard/plans" className="btn btn-ghost">Mis Planes</Link>
        <Link to="/dashboard/public-plans" className="btn btn-ghost">Explorar</Link>
        <Link to="/dashboard/reports" className="btn btn-ghost">Reportes</Link>
      </div>
    </div>
  )
}

export default Navbar
