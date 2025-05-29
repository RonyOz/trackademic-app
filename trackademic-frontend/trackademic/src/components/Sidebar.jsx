import { Link, useLocation } from 'react-router-dom'

const Sidebar = () => {
  const { pathname } = useLocation()

  const navItems = [
    {
      to: '/dashboard',
      label: 'Mis Planes',
      iconPath: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6',
    },
    {
      to: '/dashboard/crear-plan',
      label: 'Crear Plan',
      iconPath: 'M12 4v16m8-8H4',
    },
    {
      to: '/dashboard/reportes',
      label: 'Reportes',
      iconPath: 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
    },
    {
      to: '/dashboard/planes-publicos',
      label: 'Planes Públicos',
      iconPath: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z',
    },
  ]

  return (
    <aside className="w-50 min-h-screen bg-base-200 p-4 border-r mr-4">
      <ul className="menu rounded-box w-full">
        {navItems.map(({ to, label, iconPath }) => (
          <li key={to} className={pathname === to ? 'bg-base-300 rounded-lg' : ''}>
            <Link to={to}>
              <a className="flex items-center gap-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none"
                  viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={iconPath} />
                </svg>
                {label}
              </a>
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  )
}

export default Sidebar
