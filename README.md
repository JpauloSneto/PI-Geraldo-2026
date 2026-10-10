# Startup Connect — Front-end (PWA)

Plataforma no estilo "Tinder" para conectar **startups** e **investidores**, com **mentores** que atendem solicitações de mentoria das startups.

Stack: React 19 + TypeScript + Vite, React Router, Tailwind CSS v4 e `vite-plugin-pwa`.

## Rodando

```bash
npm install
npm run dev       # desenvolvimento (http://localhost:5173)
npm run build     # build de produção em dist/
npm run preview   # serve o build (teste a instalação do PWA aqui)
npm run lint
```

Contas de teste (qualquer senha):

| Perfil     | E-mail                |
| ---------- | --------------------- |
| Startup    | contato@agrosense.dev |
| Investidor | deals@sementecap.com  |
| Mentor     | juliana@mentor.dev    |

## Estrutura

```
src/
  components/   componentes reutilizáveis (layout, cards, botões, aviso de atualização do PWA)
  contexts/     autenticação (AuthProvider + hook useAuth)
  mocks/        dados falsos usados enquanto o back-end não está pronto
  pages/        uma página por rota
  services/     api.ts — ÚNICO ponto de acesso a dados
  types/        tipos do domínio (Perfil, Match, SolicitacaoMentoria…)
  utils/        formatação de moeda/datas
  routes.tsx    definição das rotas
```

## Integração com o back-end

Todas as páginas falam apenas com `src/services/api.ts`. Hoje as funções leem/escrevem nos mocks
(em memória — os dados voltam ao original ao recarregar). Para integrar:

1. Copie `.env.example` para `.env` e preencha `VITE_API_URL`.
2. Troque o corpo de cada função em `api.ts` por uma chamada ao helper `http()`, mantendo a mesma assinatura.

## PWA

- Manifest, service worker e ícones são gerados pelo `vite-plugin-pwa` (configuração em `vite.config.ts`).
- Os ícones são gerados automaticamente a partir de `public/logo.svg` — troque esse arquivo para mudar o ícone do app.
- Quando uma nova versão é publicada, o app mostra um aviso "Nova versão disponível".
