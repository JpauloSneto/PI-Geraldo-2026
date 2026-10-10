import { Link } from 'react-router'

export function NaoEncontrada() {
  return (
    <div className="grid h-full place-items-center p-6 text-center">
      <div className="space-y-2">
        <p className="text-5xl font-black text-brand-600">404</p>
        <p className="text-slate-600">Página não encontrada.</p>
        <Link to="/" className="font-semibold text-brand-600">
          Voltar ao início
        </Link>
      </div>
    </div>
  )
}
