import { useState, type FormEvent } from 'react'
import { Avatar } from '../components/Avatar'
import { CardPerfil } from '../components/CardPerfil'
import { AreaTexto, Botao, Cabecalho, Campo } from '../components/ui'
import { useAuth } from '../contexts/auth'
import type { Perfil as TPerfil } from '../types'

const separar = (texto: string) =>
  texto
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)

export function Perfil() {
  const { usuario, atualizar, sair } = useAuth()
  const [editando, setEditando] = useState(false)

  if (!usuario) return null

  return (
    <div>
      <Cabecalho titulo="Meu perfil" />
      <div className="space-y-4 p-4">
        {editando ? (
          <FormularioPerfil
            perfil={usuario}
            onCancelar={() => setEditando(false)}
            onSalvar={async (p) => {
              await atualizar(p)
              setEditando(false)
            }}
          />
        ) : (
          <>
            {usuario.bio ? (
              <CardPerfil perfil={usuario} />
            ) : (
              <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-slate-300 p-6 text-center">
                <Avatar nome={usuario.nome} tamanho="lg" />
                <p className="font-semibold">{usuario.nome}</p>
                <p className="text-sm text-slate-500">Complete seu perfil para aparecer para outros usuários.</p>
              </div>
            )}
            <Botao className="w-full" onClick={() => setEditando(true)}>
              Editar perfil
            </Botao>
            <Botao variante="secundario" className="w-full" onClick={sair}>
              Sair
            </Botao>
          </>
        )}
      </div>
    </div>
  )
}

function FormularioPerfil({
  perfil,
  onSalvar,
  onCancelar,
}: {
  perfil: TPerfil
  onSalvar: (p: TPerfil) => Promise<void>
  onCancelar: () => void
}) {
  const [p, setP] = useState<TPerfil>(perfil)
  const [salvando, setSalvando] = useState(false)
  const mudar = (campos: Partial<TPerfil>) => setP((atual) => ({ ...atual, ...campos }) as TPerfil)

  async function enviar(e: FormEvent) {
    e.preventDefault()
    setSalvando(true)
    await onSalvar(p)
  }

  return (
    <form onSubmit={enviar} className="space-y-4">
      <Campo label="Nome" required value={p.nome} onChange={(e) => mudar({ nome: e.target.value })} />
      <Campo label="Cidade" value={p.cidade ?? ''} onChange={(e) => mudar({ cidade: e.target.value })} />
      <AreaTexto label="Bio" required value={p.bio} onChange={(e) => mudar({ bio: e.target.value })} />

      {p.papel === 'startup' && (
        <>
          <Campo label="Setor" value={p.setor} onChange={(e) => mudar({ setor: e.target.value })} />
          <label className="block space-y-1">
            <span className="text-sm font-medium text-slate-700">Estágio</span>
            <select
              value={p.estagio}
              onChange={(e) => mudar({ estagio: e.target.value as typeof p.estagio })}
              className="w-full rounded-lg border border-slate-300 px-3 py-2.5"
            >
              <option value="ideia">Ideia</option>
              <option value="mvp">MVP</option>
              <option value="tracao">Tração</option>
              <option value="escala">Escala</option>
            </select>
          </label>
          <Campo
            label="Captação pretendida (R$)"
            type="number"
            min={0}
            value={p.captacaoPretendida}
            onChange={(e) => mudar({ captacaoPretendida: Number(e.target.value) })}
          />
          <AreaTexto label="Pitch" value={p.pitch} onChange={(e) => mudar({ pitch: e.target.value })} />
        </>
      )}

      {p.papel === 'investidor' && (
        <>
          <Campo
            label="Setores de interesse (separados por vírgula)"
            defaultValue={p.setoresDeInteresse.join(', ')}
            onChange={(e) => mudar({ setoresDeInteresse: separar(e.target.value) })}
          />
          <div className="grid grid-cols-2 gap-3">
            <Campo
              label="Ticket mínimo (R$)"
              type="number"
              min={0}
              value={p.ticketMinimo}
              onChange={(e) => mudar({ ticketMinimo: Number(e.target.value) })}
            />
            <Campo
              label="Ticket máximo (R$)"
              type="number"
              min={0}
              value={p.ticketMaximo}
              onChange={(e) => mudar({ ticketMaximo: Number(e.target.value) })}
            />
          </div>
        </>
      )}

      {p.papel === 'mentor' && (
        <Campo
          label="Especialidades (separadas por vírgula)"
          defaultValue={p.especialidades.join(', ')}
          onChange={(e) => mudar({ especialidades: separar(e.target.value) })}
        />
      )}

      <div className="flex gap-2">
        <Botao type="button" variante="secundario" className="flex-1" onClick={onCancelar}>
          Cancelar
        </Botao>
        <Botao type="submit" className="flex-1" disabled={salvando}>
          Salvar
        </Botao>
      </div>
    </form>
  )
}
