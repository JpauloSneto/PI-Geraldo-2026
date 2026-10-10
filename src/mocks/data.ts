import type { Match, Mensagem, Perfil, SolicitacaoMentoria } from '../types'

export const perfis: Perfil[] = [
  {
    id: 's1',
    nome: 'AgroSense',
    email: 'contato@agrosense.dev',
    papel: 'startup',
    bio: 'Sensores IoT de baixo custo para pequenos produtores rurais.',
    cidade: 'Goiânia, GO',
    setor: 'AgTech',
    estagio: 'mvp',
    captacaoPretendida: 500_000,
    pitch: 'Reduzimos em 30% o desperdício de água na irrigação.',
  },
  {
    id: 's2',
    nome: 'MedFila',
    email: 'oi@medfila.app',
    papel: 'startup',
    bio: 'Agendamento inteligente para clínicas populares.',
    cidade: 'Recife, PE',
    setor: 'HealthTech',
    estagio: 'tracao',
    captacaoPretendida: 1_200_000,
    pitch: '40 clínicas ativas e crescimento de 15% ao mês.',
  },
  {
    id: 's3',
    nome: 'EduPlay',
    email: 'time@eduplay.com.br',
    papel: 'startup',
    bio: 'Gamificação do reforço escolar para o ensino fundamental.',
    cidade: 'São Paulo, SP',
    setor: 'EdTech',
    estagio: 'ideia',
    captacaoPretendida: 150_000,
    pitch: 'Piloto com 3 escolas municipais em andamento.',
  },
  {
    id: 'i1',
    nome: 'Carla Mendes',
    email: 'carla@anjos.vc',
    papel: 'investidor',
    bio: 'Investidora-anjo com foco em impacto social.',
    cidade: 'Belo Horizonte, MG',
    setoresDeInteresse: ['HealthTech', 'EdTech'],
    ticketMinimo: 50_000,
    ticketMaximo: 300_000,
  },
  {
    id: 'i2',
    nome: 'Semente Capital',
    email: 'deals@sementecap.com',
    papel: 'investidor',
    bio: 'Fundo pre-seed para startups do agro e clima.',
    cidade: 'Campinas, SP',
    setoresDeInteresse: ['AgTech', 'CleanTech'],
    ticketMinimo: 200_000,
    ticketMaximo: 1_000_000,
  },
  {
    id: 'm1',
    nome: 'Rafael Costa',
    email: 'rafael@mentor.dev',
    papel: 'mentor',
    bio: 'Ex-CTO, ajuda startups a escalar produto e time.',
    cidade: 'Florianópolis, SC',
    especialidades: ['Produto', 'Tecnologia', 'Contratação'],
  },
  {
    id: 'm2',
    nome: 'Juliana Prado',
    email: 'juliana@mentor.dev',
    papel: 'mentor',
    bio: 'Especialista em finanças e preparação para rodadas.',
    cidade: 'Rio de Janeiro, RJ',
    especialidades: ['Finanças', 'Valuation', 'Pitch'],
  },
]

export const matches: Match[] = [
  { id: 'mt1', usuarios: ['s2', 'i1'], criadoEm: '2026-10-01T14:00:00Z' },
]

export const mensagens: Mensagem[] = [
  {
    id: 'msg1',
    matchId: 'mt1',
    autorId: 'i1',
    texto: 'Olá! Gostei muito da tração de vocês. Podemos conversar?',
    enviadaEm: '2026-10-01T14:05:00Z',
  },
]

export const solicitacoesMentoria: SolicitacaoMentoria[] = [
  {
    id: 'sm1',
    startupId: 's1',
    mentorId: 'm2',
    assunto: 'Preparação para pitch',
    descricao: 'Queremos revisar nosso deck antes de falar com fundos.',
    status: 'pendente',
    criadaEm: '2026-10-05T10:00:00Z',
  },
]

// Likes já dados (quem curtiu -> quem). Usado para simular matches recíprocos.
export const likes: Array<[string, string]> = [
  ['i2', 's1'],
  ['i1', 's3'],
]
