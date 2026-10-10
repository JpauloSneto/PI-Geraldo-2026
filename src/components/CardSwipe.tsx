import { useRef, useState, type PointerEvent, type ReactNode } from 'react'
import type { Acao } from '../types'

const LIMITE = 120 // px arrastados para confirmar o swipe

interface Props {
  children: ReactNode
  onSwipe: (acao: Acao) => void
}

/** Card arrastável: direita = like, esquerda = pass. */
export function CardSwipe({ children, onSwipe }: Props) {
  const inicio = useRef<number | null>(null)
  const [dx, setDx] = useState(0)
  const [arrastando, setArrastando] = useState(false)
  const [saindo, setSaindo] = useState<Acao | null>(null)

  function soltar() {
    if (inicio.current === null) return
    inicio.current = null
    setArrastando(false)
    if (Math.abs(dx) > LIMITE) {
      const acao: Acao = dx > 0 ? 'like' : 'pass'
      setSaindo(acao)
      setTimeout(() => onSwipe(acao), 200)
    } else {
      setDx(0)
    }
  }

  const x = saindo ? (saindo === 'like' ? 600 : -600) : dx

  return (
    <div
      className="relative h-full touch-none select-none"
      style={{
        transform: `translateX(${x}px) rotate(${x / 20}deg)`,
        transition: !arrastando ? 'transform 0.2s ease-out' : 'none',
      }}
      onPointerDown={(e: PointerEvent) => {
        inicio.current = e.clientX
        setArrastando(true)
        e.currentTarget.setPointerCapture(e.pointerId)
      }}
      onPointerMove={(e: PointerEvent) => {
        if (inicio.current !== null) setDx(e.clientX - inicio.current)
      }}
      onPointerUp={soltar}
      onPointerCancel={soltar}
    >
      {children}
      {dx > 40 && (
        <span className="absolute top-6 left-6 -rotate-12 rounded-lg border-4 border-emerald-500 px-3 py-1 text-2xl font-black text-emerald-500">
          LIKE
        </span>
      )}
      {dx < -40 && (
        <span className="absolute top-6 right-6 rotate-12 rounded-lg border-4 border-rose-500 px-3 py-1 text-2xl font-black text-rose-500">
          PASSO
        </span>
      )}
    </div>
  )
}
