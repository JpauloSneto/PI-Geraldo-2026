import { useState, type FormEvent } from 'react'
import { Link, Navigate } from 'react-router'
import { Botao, Campo } from '../components/ui'
import { useAuth } from '../contexts/auth'
import type { Papel } from '../types'

const papeis: Array<{ valor: Papel; titulo: string; descricao: string; icone: string }> = [
  { valor: 'startup', titulo: 'Startup', descricao: 'Busco investimento e mentoria', icone: '🚀' },
  { valor: 'investidor', titulo: 'Investidor', descricao: 'Quero investir em startups', icone: '💰' },
  { valor: 'mentor', titulo: 'Mentor', descricao: 'Quero ajudar startups', icone: '🎓' },
]

export function Cadastro() {
  const { usuario, cadastrar } = useAuth()
  const [papel, setPapel] = useState<Papel | null>(null)
  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [erro, setErro] = useState('')
  const [carregando, setCarregando] = useState(false)

  if (usuario) return <Navigate to="/perfil" replace />

  async function enviar(e: FormEvent) {
    e.preventDefault()
    if (!papel) return
    setErro('')
    setCarregando(true)
    try {
      await cadastrar({ nome, email, senha, papel })
    } catch (err) {
      setErro((err as Error).message)
    } finally {
      setCarregando(false)
    }
  }

  return (
    <div className="mx-auto flex min-h-full max-w-md flex-col justify-center gap-6 p-6">
      <h1 className="text-2xl font-bold">Criar conta</h1>

      {!papel ? (
        <div className="space-y-3">
          <p className="text-slate-600">Como você quer usar a plataforma?</p>
          {papeis.map((p) => (
            <button
              key={p.valor}
              onClick={() => setPapel(p.valor)}
              className="flex w-full items-center gap-4 rounded-xl border border-slate-200 p-4 text-left transition hover:border-brand-500 hover:bg-brand-50"
            >
              <span className="text-3xl">{p.icone}</span>
              <span>
                <strong className="block">{p.titulo}</strong>
                <span className="text-sm text-slate-500">{p.descricao}</span>
              </span>
            </button>
          ))}
        </div>
      ) : (
        <form onSubmit={enviar} className="space-y-4">
          <button type="button" onClick={() => setPapel(null)} className="text-sm text-brand-600">
            ← Perfil: {papeis.find((p) => p.valor === papel)?.titulo} (alterar)
          </button>
          <Campo
            label={papel === 'startup' ? 'Nome da startup' : 'Nome'}
            required
            value={nome}
            onChange={(e) => setNome(e.target.value)}
          />
          <Campo label="E-mail" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
          <Campo
            label="Senha"
            type="password"
            required
            minLength={6}
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
          />
          {erro && <p className="text-sm text-rose-600">{erro}</p>}
          <Botao type="submit" className="w-full" disabled={carregando}>
            {carregando ? 'Criando…' : 'Criar conta'}
          </Botao>
        </form>
      )}

      <p className="text-center text-sm text-slate-600">
        Já tem conta?{' '}
        <Link to="/login" className="font-semibold text-brand-600">
          Entrar
        </Link>
      </p>
    </div>
  )
}
