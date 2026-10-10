import type { Perfil } from '../types'
import { formatarReais } from '../utils/formatar'
import { Avatar } from './Avatar'
import { Tag } from './ui'

const estagios = { ideia: 'Ideia', mvp: 'MVP', tracao: 'Tração', escala: 'Escala' }

export function CardPerfil({ perfil }: { perfil: Perfil }) {
  return (
    <div className="flex h-full flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-lg">
      <div className="flex items-center gap-4">
        <Avatar nome={perfil.nome} foto={perfil.foto} tamanho="lg" />
        <div>
          <h2 className="text-2xl font-bold">{perfil.nome}</h2>
          {perfil.cidade && <p className="text-sm text-slate-500">{perfil.cidade}</p>}
        </div>
      </div>

      <p className="text-slate-700">{perfil.bio}</p>

      {perfil.papel === 'startup' && (
        <>
          <div className="flex flex-wrap gap-2">
            <Tag>{perfil.setor}</Tag>
            <Tag>{estagios[perfil.estagio]}</Tag>
          </div>
          <blockquote className="border-l-4 border-accent-500 pl-3 italic text-slate-600">{perfil.pitch}</blockquote>
          <p className="mt-auto text-sm text-slate-500">
            Captando <strong className="text-slate-900">{formatarReais(perfil.captacaoPretendida)}</strong>
          </p>
        </>
      )}

      {perfil.papel === 'investidor' && (
        <>
          <div className="flex flex-wrap gap-2">
            {perfil.setoresDeInteresse.map((s) => (
              <Tag key={s}>{s}</Tag>
            ))}
          </div>
          <p className="mt-auto text-sm text-slate-500">
            Ticket:{' '}
            <strong className="text-slate-900">
              {formatarReais(perfil.ticketMinimo)} – {formatarReais(perfil.ticketMaximo)}
            </strong>
          </p>
        </>
      )}

      {perfil.papel === 'mentor' && (
        <div className="flex flex-wrap gap-2">
          {perfil.especialidades.map((e) => (
            <Tag key={e}>{e}</Tag>
          ))}
        </div>
      )}
    </div>
  )
}
