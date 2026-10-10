import { useEffect, useState } from 'react'
import { Navigate, useNavigate } from 'react-router'
import { CardPerfil } from '../components/CardPerfil'
import { CardSwipe } from '../components/CardSwipe'
import { Botao, Cabecalho } from '../components/ui'
import { useAuth } from '../contexts/auth'
import * as api from '../services/api'
import type { Acao, Perfil } from '../types'

export function Descobrir() {
  const { usuario } = useAuth()
  const navigate = useNavigate()
  const [fila, setFila] = useState<Perfil[] | null>(null)
  const [novoMatch, setNovoMatch] = useState<Perfil | null>(null)

  useEffect(() => {
    if (usuario && usuario.papel !== 'mentor') api.buscarFeed(usuario).then(setFila)
  }, [usuario])

  if (!usuario) return null
  if (usuario.papel === 'mentor') return <Navigate to="/mentorias" replace />

  async function avaliar(acao: Acao) {
    if (!usuario || !fila?.length) return
    const [atual, ...resto] = fila
    setFila(resto)
    const match = await api.avaliar(usuario.id, atual.id, acao)
    if (match) setNovoMatch(atual)
  }

  const atual = fila?.[0]

  return (
    <div className="flex h-full flex-col">
      <Cabecalho titulo={usuario.papel === 'startup' ? 'Investidores' : 'Startups'} />

      <div className="relative flex-1 p-4">
        {fila === null && <p className="text-center text-slate-500">Carregando…</p>}
        {fila?.length === 0 && (
          <div className="grid h-full place-items-center text-center text-slate-500">
            <p>
              Você já viu todos os perfis por enquanto. <br /> Volte mais tarde!
            </p>
          </div>
        )}
        {atual && (
          <CardSwipe key={atual.id} onSwipe={avaliar}>
            <CardPerfil perfil={atual} />
          </CardSwipe>
        )}
      </div>

      {atual && (
        <div className="flex justify-center gap-8 pb-4">
          <button
            onClick={() => avaliar('pass')}
            aria-label="Passar"
            className="grid size-16 place-items-center rounded-full border-2 border-rose-200 bg-white text-2xl shadow transition hover:scale-105"
          >
            ✕
          </button>
          <button
            onClick={() => avaliar('like')}
            aria-label="Curtir"
            className="grid size-16 place-items-center rounded-full border-2 border-emerald-200 bg-white text-2xl shadow transition hover:scale-105"
          >
            💚
          </button>
        </div>
      )}

      {novoMatch && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-brand-700/90 p-6 text-center text-white">
          <div className="space-y-4">
            <p className="text-4xl font-black">É um match! 🎉</p>
            <p>Você e {novoMatch.nome} demonstraram interesse um no outro.</p>
            <div className="flex justify-center gap-3">
              <Botao variante="secundario" onClick={() => setNovoMatch(null)}>
                Continuar
              </Botao>
              <Botao variante="destaque" onClick={() => navigate('/matches')}>
                Ver matches
              </Botao>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
