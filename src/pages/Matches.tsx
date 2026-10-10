import { useEffect, useState } from 'react'
import { Link } from 'react-router'
import { Avatar } from '../components/Avatar'
import { Cabecalho } from '../components/ui'
import { useAuth } from '../contexts/auth'
import * as api from '../services/api'
import type { Match, Perfil } from '../types'

export function Matches() {
  const { usuario } = useAuth()
  const [itens, setItens] = useState<Array<{ match: Match; outro: Perfil }> | null>(null)

  useEffect(() => {
    if (usuario) api.listarMatches(usuario.id).then(setItens)
  }, [usuario])

  return (
    <div>
      <Cabecalho titulo="Matches" />
      {itens === null && <p className="p-4 text-slate-500">Carregando…</p>}
      {itens?.length === 0 && <p className="p-4 text-slate-500">Nenhum match ainda. Continue explorando!</p>}
      <ul className="divide-y divide-slate-100">
        {itens?.map(({ match, outro }) => (
          <li key={match.id}>
            <Link to={`/chat/${match.id}`} className="flex items-center gap-3 p-4 hover:bg-slate-50">
              <Avatar nome={outro.nome} foto={outro.foto} />
              <div>
                <p className="font-semibold">{outro.nome}</p>
                <p className="text-sm text-slate-500 capitalize">{outro.papel}</p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
