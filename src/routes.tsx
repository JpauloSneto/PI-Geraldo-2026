import { createBrowserRouter } from 'react-router'
import { AppLayout } from './components/AppLayout'
import { RotaProtegida } from './components/RotaProtegida'
import { Cadastro } from './pages/Cadastro'
import { Chat } from './pages/Chat'
import { Descobrir } from './pages/Descobrir'
import { Login } from './pages/Login'
import { Matches } from './pages/Matches'
import { Mentorias } from './pages/Mentorias'
import { NaoEncontrada } from './pages/NaoEncontrada'
import { Perfil } from './pages/Perfil'

export const router = createBrowserRouter([
  { path: '/login', element: <Login /> },
  { path: '/cadastro', element: <Cadastro /> },
  {
    element: <RotaProtegida />,
    children: [
      {
        element: <AppLayout />,
        children: [
          { index: true, element: <Descobrir /> },
          { path: 'matches', element: <Matches /> },
          { path: 'chat/:matchId', element: <Chat /> },
          { path: 'mentorias', element: <Mentorias /> },
          { path: 'perfil', element: <Perfil /> },
        ],
      },
    ],
  },
  { path: '*', element: <NaoEncontrada /> },
])
