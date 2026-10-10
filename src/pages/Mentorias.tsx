import { useEffect, useState, type FormEvent } from 'react'
import { Avatar } from '../components/Avatar'
import { AreaTexto, Botao, Cabecalho, Campo, Tag } from '../components/ui'
import { useAuth } from '../contexts/auth'
import * as api from '../services/api'
import type { Perfil, PerfilMentor, SolicitacaoMentoria, StatusMentoria } from '../types'
import { formatarData } from '../utils/formatar'

const corStatus: Record<StatusMentoria, string> = {
  pendente: 'bg-amber-100 text-amber-800',
  aceita: 'bg-emerald-100 text-emerald-800',
  recusada: 'bg-rose-100 text-rose-800',
  concluida: 'bg-slate-100 text-slate-700',
}

function Status({ status }: { status: StatusMentoria }) {
  return <span className={`rounded-full px-2 py-0.5 text-xs font-medium capitalize ${corStatus[status]}`}>{status}</span>
}

export function Mentorias() {
  const { usuario } = useAuth()
  const [solicitacoes, setSolicitacoes] = useState<SolicitacaoMentoria[]>([])
  const [mentores, setMentores] = useState<PerfilMentor[]>([])
  const [selecionado, setSelecionado] = useState<PerfilMentor | null>(null)
  const [nomes, setNomes] = useState<Record<string, string>>({})

  useEffect(() => {
    if (!usuario) return
    api.listarSolicitacoes(usuario).then(setSolicitacoes)
    if (usuario.papel === 'startup') api.listarMentores().then(setMentores)
  }, [usuario])

  // Carrega o nome da outra parte de cada solicitação (startup para o mentor, mentor para a startup)
  useEffect(() => {
    if (!usuario) return
    const campo = usuario.papel === 'mentor' ? 'startupId' : 'mentorId'
    const ids = [...new Set(solicitacoes.map((s) => s[campo]))]
    Promise.all(ids.map(api.buscarPerfil)).then((perfis) =>
      setNomes(Object.fromEntries(perfis.filter((p): p is Perfil => !!p).map((p) => [p.id, p.nome]))),
    )
  }, [usuario, solicitacoes])

  if (!usuario) return null
  const souMentor = usuario.papel === 'mentor'

  async function responder(id: string, status: 'aceita' | 'recusada') {
    const atualizada = await api.responderSolicitacao(id, status)
    setSolicitacoes((lista) => lista.map((s) => (s.id === id ? atualizada : s)))
  }

  return (
    <div>
      <Cabecalho titulo={souMentor ? 'Solicitações de mentoria' : 'Mentorias'} />

      <section className="space-y-3 p-4">
        <h2 className="font-semibold text-slate-700">{souMentor ? 'Recebidas' : 'Minhas solicitações'}</h2>
        {solicitacoes.length === 0 && <p className="text-sm text-slate-500">Nenhuma solicitação.</p>}
        {solicitacoes.map((s) => (
          <article key={s.id} className="space-y-2 rounded-xl border border-slate-200 p-4">
            <div className="flex items-center justify-between gap-2">
              <h3 className="font-semibold">{s.assunto}</h3>
              <Status status={s.status} />
            </div>
            <p className="text-sm text-slate-600">{s.descricao}</p>
            <p className="text-xs text-slate-400">
              {nomes[souMentor ? s.startupId : s.mentorId] ?? '…'} · {formatarData(s.criadaEm)}
            </p>
            {souMentor && s.status === 'pendente' && (
              <div className="flex gap-2 pt-1">
                <Botao className="flex-1" onClick={() => responder(s.id, 'aceita')}>
                  Aceitar
                </Botao>
                <Botao variante="secundario" className="flex-1" onClick={() => responder(s.id, 'recusada')}>
                  Recusar
                </Botao>
              </div>
            )}
          </article>
        ))}
      </section>

      {!souMentor && (
        <section className="space-y-3 p-4">
          <h2 className="font-semibold text-slate-700">Mentores disponíveis</h2>
          {mentores.map((m) => (
            <article key={m.id} className="flex gap-3 rounded-xl border border-slate-200 p-4">
              <Avatar nome={m.nome} foto={m.foto} />
              <div className="flex-1 space-y-2">
                <p className="font-semibold">{m.nome}</p>
                <p className="text-sm text-slate-600">{m.bio}</p>
                <div className="flex flex-wrap gap-1">
                  {m.especialidades.map((e) => (
                    <Tag key={e}>{e}</Tag>
                  ))}
                </div>
                <Botao variante="secundario" className="w-full" onClick={() => setSelecionado(m)}>
                  Solicitar mentoria
                </Botao>
              </div>
            </article>
          ))}
        </section>
      )}

      {selecionado && (
        <FormularioSolicitacao
          mentor={selecionado}
          startupId={usuario.id}
          onFechar={() => setSelecionado(null)}
          onEnviada={(s) => {
            setSolicitacoes((lista) => [s, ...lista])
            setSelecionado(null)
          }}
        />
      )}
    </div>
  )
}

function FormularioSolicitacao({
  mentor,
  startupId,
  onFechar,
  onEnviada,
}: {
  mentor: PerfilMentor
  startupId: string
  onFechar: () => void
  onEnviada: (s: SolicitacaoMentoria) => void
}) {
  const [assunto, setAssunto] = useState('')
  const [descricao, setDescricao] = useState('')
  const [enviando, setEnviando] = useState(false)

  async function enviar(e: FormEvent) {
    e.preventDefault()
    setEnviando(true)
    onEnviada(await api.solicitarMentoria({ startupId, mentorId: mentor.id, assunto, descricao }))
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40" onClick={onFechar}>
      <form
        onSubmit={enviar}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md space-y-4 rounded-t-2xl bg-white p-6"
        style={{ paddingBottom: 'calc(1.5rem + env(safe-area-inset-bottom))' }}
      >
        <h2 className="text-lg font-bold">Mentoria com {mentor.nome}</h2>
        <Campo label="Assunto" required value={assunto} onChange={(e) => setAssunto(e.target.value)} />
        <AreaTexto
          label="Descreva o que você precisa"
          required
          value={descricao}
          onChange={(e) => setDescricao(e.target.value)}
        />
        <div className="flex gap-2">
          <Botao type="button" variante="secundario" className="flex-1" onClick={onFechar}>
            Cancelar
          </Botao>
          <Botao type="submit" className="flex-1" disabled={enviando}>
            Enviar
          </Botao>
        </div>
      </form>
    </div>
  )
}
