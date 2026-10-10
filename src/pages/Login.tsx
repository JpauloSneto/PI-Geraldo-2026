import { useState, type FormEvent } from 'react'
import { Link, Navigate } from 'react-router'
import { Botao, Campo } from '../components/ui'
import { useAuth } from '../contexts/auth'

export function Login() {
  const { usuario, entrar } = useAuth()
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [erro, setErro] = useState('')
  const [carregando, setCarregando] = useState(false)

  if (usuario) return <Navigate to="/" replace />

  async function enviar(e: FormEvent) {
    e.preventDefault()
    setErro('')
    setCarregando(true)
    try {
      await entrar(email, senha)
    } catch (err) {
      setErro((err as Error).message)
    } finally {
      setCarregando(false)
    }
  }

  return (
    <div className="mx-auto flex min-h-full max-w-md flex-col justify-center gap-8 p-6">
      <div className="text-center">
        <img src="/logo.svg" alt="" className="mx-auto mb-4 size-20" />
        <h1 className="text-3xl font-bold">Startup Connect</h1>
        <p className="text-slate-500">Onde startups encontram investidores e mentores.</p>
      </div>

      <form onSubmit={enviar} className="space-y-4">
        <Campo label="E-mail" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
        <Campo label="Senha" type="password" required value={senha} onChange={(e) => setSenha(e.target.value)} />
        {erro && <p className="text-sm text-rose-600">{erro}</p>}
        <Botao type="submit" className="w-full" disabled={carregando}>
          {carregando ? 'Entrando…' : 'Entrar'}
        </Botao>
      </form>

      <p className="text-center text-sm text-slate-600">
        Não tem conta?{' '}
        <Link to="/cadastro" className="font-semibold text-brand-600">
          Cadastre-se
        </Link>
      </p>

      {import.meta.env.DEV && (
        <p className="rounded-lg bg-amber-50 p-3 text-xs text-amber-800">
          Dados de teste (qualquer senha): <br />
          Startup: contato@agrosense.dev · Investidor: deals@sementecap.com · Mentor: juliana@mentor.dev
        </p>
      )}
    </div>
  )
}
