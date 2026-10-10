import { useEffect, useRef, useState, type FormEvent } from 'react'
import { Link, useParams } from 'react-router'
import { Botao, Cabecalho } from '../components/ui'
import { useAuth } from '../contexts/auth'
import * as api from '../services/api'
import type { Mensagem, Perfil } from '../types'
import { formatarHora } from '../utils/formatar'

export function Chat() {
  const { matchId = '' } = useParams()
  const { usuario } = useAuth()
  const [outro, setOutro] = useState<Perfil | null>(null)
  const [mensagens, setMensagens] = useState<Mensagem[]>([])
  const [texto, setTexto] = useState('')
  const fim = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!usuario) return
    api.listarMatches(usuario.id).then((lista) => {
      setOutro(lista.find((i) => i.match.id === matchId)?.outro ?? null)
    })
    api.listarMensagens(matchId).then(setMensagens)
  }, [usuario, matchId])

  useEffect(() => {
    fim.current?.scrollIntoView({ behavior: 'smooth' })
  }, [mensagens])

  async function enviar(e: FormEvent) {
    e.preventDefault()
    if (!usuario || !texto.trim()) return
    const msg = await api.enviarMensagem(matchId, usuario.id, texto.trim())
    setMensagens((m) => [...m, msg])
    setTexto('')
  }

  return (
    <div className="flex h-full flex-col">
      <Cabecalho titulo={outro?.nome ?? ''}>
        <Link to="/matches" aria-label="Voltar" className="text-xl">
          ←
        </Link>
      </Cabecalho>

      <div className="flex-1 space-y-2 overflow-y-auto p-4">
        {mensagens.map((m) => {
          const minha = m.autorId === usuario?.id
          return (
            <div
              key={m.id}
              className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                minha ? 'ml-auto bg-brand-600 text-white' : 'bg-slate-100'
              }`}
            >
              <p>{m.texto}</p>
              <p className={`text-right text-[10px] ${minha ? 'text-brand-100' : 'text-slate-400'}`}>
                {formatarHora(m.enviadaEm)}
              </p>
            </div>
          )
        })}
        <div ref={fim} />
      </div>

      <form onSubmit={enviar} className="flex gap-2 border-t border-slate-100 p-3">
        <input
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          placeholder="Escreva uma mensagem…"
          className="flex-1 rounded-full border border-slate-300 px-4 outline-none focus:border-brand-500"
        />
        <Botao type="submit" className="rounded-full">
          Enviar
        </Botao>
      </form>
    </div>
  )
}
