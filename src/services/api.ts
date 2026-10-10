/**
 * Camada de acesso a dados.
 *
 * Enquanto o back-end não está pronto, todas as funções usam os dados de
 * `src/mocks`. Quando a API existir, basta trocar a implementação de cada
 * função por uma chamada `http(...)` mantendo as mesmas assinaturas — as
 * páginas não precisam mudar.
 */
import * as db from '../mocks/data'
import type {
  Acao,
  DadosCadastro,
  Match,
  Mensagem,
  Perfil,
  PerfilMentor,
  SolicitacaoMentoria,
} from '../types'

export const API_URL = import.meta.env.VITE_API_URL ?? ''

// Helper para quando a API real estiver disponível.
export async function http<T>(path: string, init?: RequestInit): Promise<T> {
  const token = localStorage.getItem('token')
  const res = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...init?.headers,
    },
  })
  if (!res.ok) throw new Error(`Erro ${res.status} em ${path}`)
  return res.json() as Promise<T>
}

const esperar = (ms = 300) => new Promise((r) => setTimeout(r, ms))
const novoId = () => crypto.randomUUID()

// ---------- Autenticação ----------

export async function login(email: string, senha: string): Promise<Perfil> {
  await esperar()
  const perfil = db.perfis.find((p) => p.email === email)
  if (!perfil || !senha) throw new Error('E-mail ou senha inválidos')
  return perfil
}

export async function cadastrar(dados: DadosCadastro): Promise<Perfil> {
  await esperar()
  if (db.perfis.some((p) => p.email === dados.email)) {
    throw new Error('Este e-mail já está cadastrado')
  }
  const base = { id: novoId(), nome: dados.nome, email: dados.email, bio: '' }
  let perfil: Perfil
  switch (dados.papel) {
    case 'startup':
      perfil = { ...base, papel: 'startup', setor: '', estagio: 'ideia', captacaoPretendida: 0, pitch: '' }
      break
    case 'investidor':
      perfil = { ...base, papel: 'investidor', setoresDeInteresse: [], ticketMinimo: 0, ticketMaximo: 0 }
      break
    case 'mentor':
      perfil = { ...base, papel: 'mentor', especialidades: [] }
      break
  }
  db.perfis.push(perfil)
  return perfil
}

export async function buscarPerfil(id: string): Promise<Perfil | undefined> {
  await esperar(100)
  return db.perfis.find((p) => p.id === id)
}

export async function atualizarPerfil(perfil: Perfil): Promise<Perfil> {
  await esperar()
  const i = db.perfis.findIndex((p) => p.id === perfil.id)
  if (i >= 0) db.perfis[i] = perfil
  return perfil
}

// ---------- Feed / swipe ----------

/** Startups veem investidores e vice-versa. */
export async function buscarFeed(usuario: Perfil): Promise<Perfil[]> {
  await esperar()
  const alvo = usuario.papel === 'startup' ? 'investidor' : 'startup'
  const jaAvaliados = new Set(db.likes.filter(([de]) => de === usuario.id).map(([, para]) => para))
  return db.perfis.filter((p) => p.papel === alvo && !jaAvaliados.has(p.id))
}

/** Registra like/pass. Retorna o match criado quando o like é recíproco. */
export async function avaliar(usuarioId: string, alvoId: string, acao: Acao): Promise<Match | null> {
  await esperar(150)
  db.likes.push([usuarioId, alvoId]) // pass também entra para não reaparecer no feed
  if (acao === 'pass') return null
  const reciproco = db.likes.some(([de, para]) => de === alvoId && para === usuarioId)
  if (!reciproco) return null
  const match: Match = { id: novoId(), usuarios: [usuarioId, alvoId], criadoEm: new Date().toISOString() }
  db.matches.push(match)
  return match
}

// ---------- Matches / chat ----------

export async function listarMatches(usuarioId: string): Promise<Array<{ match: Match; outro: Perfil }>> {
  await esperar()
  return db.matches
    .filter((m) => m.usuarios.includes(usuarioId))
    .map((match) => {
      const outroId = match.usuarios.find((id) => id !== usuarioId)!
      return { match, outro: db.perfis.find((p) => p.id === outroId)! }
    })
}

export async function listarMensagens(matchId: string): Promise<Mensagem[]> {
  await esperar(100)
  return db.mensagens.filter((m) => m.matchId === matchId)
}

export async function enviarMensagem(matchId: string, autorId: string, texto: string): Promise<Mensagem> {
  await esperar(100)
  const msg: Mensagem = { id: novoId(), matchId, autorId, texto, enviadaEm: new Date().toISOString() }
  db.mensagens.push(msg)
  return msg
}

// ---------- Mentoria ----------

export async function listarMentores(): Promise<PerfilMentor[]> {
  await esperar()
  return db.perfis.filter((p): p is PerfilMentor => p.papel === 'mentor')
}

export async function listarSolicitacoes(usuario: Perfil): Promise<SolicitacaoMentoria[]> {
  await esperar()
  const campo = usuario.papel === 'mentor' ? 'mentorId' : 'startupId'
  return db.solicitacoesMentoria.filter((s) => s[campo] === usuario.id)
}

export async function solicitarMentoria(
  dados: Pick<SolicitacaoMentoria, 'startupId' | 'mentorId' | 'assunto' | 'descricao'>,
): Promise<SolicitacaoMentoria> {
  await esperar()
  const s: SolicitacaoMentoria = { ...dados, id: novoId(), status: 'pendente', criadaEm: new Date().toISOString() }
  db.solicitacoesMentoria.push(s)
  return s
}

export async function responderSolicitacao(
  id: string,
  status: 'aceita' | 'recusada',
): Promise<SolicitacaoMentoria> {
  await esperar()
  const s = db.solicitacoesMentoria.find((x) => x.id === id)
  if (!s) throw new Error('Solicitação não encontrada')
  s.status = status
  return { ...s }
}
