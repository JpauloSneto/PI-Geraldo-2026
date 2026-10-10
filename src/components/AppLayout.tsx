import { NavLink, Outlet } from 'react-router'
import { useAuth } from '../contexts/auth'

export function AppLayout() {
  const { usuario } = useAuth()

  const itens = [
    // Mentores não participam do swipe; o início deles é a lista de solicitações
    ...(usuario?.papel !== 'mentor' ? [{ to: '/', label: 'Descobrir', icone: '🔥' }] : []),
    { to: '/matches', label: 'Matches', icone: '💬' },
    ...(usuario?.papel !== 'investidor' ? [{ to: '/mentorias', label: 'Mentorias', icone: '🎓' }] : []),
    { to: '/perfil', label: 'Perfil', icone: '👤' },
  ]

  return (
    <div className="mx-auto flex h-full max-w-md flex-col bg-white shadow-sm">
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
      <nav
        className="flex border-t border-slate-200 bg-white"
        style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
      >
        {itens.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end
            className={({ isActive }) =>
              `flex flex-1 flex-col items-center gap-0.5 py-2 text-xs ${
                isActive ? 'text-brand-600 font-semibold' : 'text-slate-500'
              }`
            }
          >
            <span className="text-xl" aria-hidden>
              {item.icone}
            </span>
            {item.label}
          </NavLink>
        ))}
      </nav>
    </div>
  )
}
