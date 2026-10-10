const cores = ['bg-brand-500', 'bg-emerald-500', 'bg-rose-500', 'bg-amber-500', 'bg-sky-500', 'bg-violet-500']

interface Props {
  nome: string
  foto?: string
  tamanho?: 'sm' | 'md' | 'lg'
}

const tamanhos = { sm: 'size-10 text-sm', md: 'size-14 text-lg', lg: 'size-24 text-3xl' }

export function Avatar({ nome, foto, tamanho = 'md' }: Props) {
  const classes = `${tamanhos[tamanho]} shrink-0 rounded-full`
  if (foto) return <img src={foto} alt={nome} className={`${classes} object-cover`} />

  const iniciais = nome
    .split(' ')
    .slice(0, 2)
    .map((p) => p[0])
    .join('')
    .toUpperCase()
  const cor = cores[[...nome].reduce((s, c) => s + c.charCodeAt(0), 0) % cores.length]

  return (
    <div className={`${classes} ${cor} grid place-items-center font-semibold text-white`} aria-hidden>
      {iniciais}
    </div>
  )
}
