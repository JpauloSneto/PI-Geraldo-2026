export type Papel = 'startup' | 'investidor' | 'mentor'

export interface Usuario {
  id: string
  nome: string
  email: string
  papel: Papel
  foto?: string
  bio: string
  cidade?: string
}

export type EstagioStartup = 'ideia' | 'mvp' | 'tracao' | 'escala'

export interface PerfilStartup extends Usuario {
  papel: 'startup'
  setor: string
  estagio: EstagioStartup
  captacaoPretendida: number
  pitch: string
}

export interface PerfilInvestidor extends Usuario {
  papel: 'investidor'
  setoresDeInteresse: string[]
  ticketMinimo: number
  ticketMaximo: number
}

export interface PerfilMentor extends Usuario {
  papel: 'mentor'
  especialidades: string[]
}

export type Perfil = PerfilStartup | PerfilInvestidor | PerfilMentor

export type Acao = 'like' | 'pass'

export interface Match {
  id: string
  usuarios: [string, string]
  criadoEm: string
}

export interface Mensagem {
  id: string
  matchId: string
  autorId: string
  texto: string
  enviadaEm: string
}

export type StatusMentoria = 'pendente' | 'aceita' | 'recusada' | 'concluida'

export interface SolicitacaoMentoria {
  id: string
  startupId: string
  mentorId: string
  assunto: string
  descricao: string
  status: StatusMentoria
  criadaEm: string
}

export interface DadosCadastro {
  nome: string
  email: string
  senha: string
  papel: Papel
}
