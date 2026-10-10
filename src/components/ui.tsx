import type { ButtonHTMLAttributes, InputHTMLAttributes, ReactNode, TextareaHTMLAttributes } from 'react'

const variantes = {
  primario: 'bg-brand-600 text-white hover:bg-brand-700',
  secundario: 'border border-slate-300 bg-white text-slate-700 hover:bg-slate-50',
  destaque: 'bg-accent-500 text-white hover:bg-amber-600',
}

export function Botao({
  variante = 'primario',
  className = '',
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variante?: keyof typeof variantes }) {
  return (
    <button
      className={`rounded-lg px-4 py-2.5 font-medium transition disabled:opacity-50 ${variantes[variante]} ${className}`}
      {...props}
    />
  )
}

const campoClasses =
  'w-full rounded-lg border border-slate-300 px-3 py-2.5 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100'

export function Campo({ label, ...props }: InputHTMLAttributes<HTMLInputElement> & { label: string }) {
  return (
    <label className="block space-y-1">
      <span className="text-sm font-medium text-slate-700">{label}</span>
      <input className={campoClasses} {...props} />
    </label>
  )
}

export function AreaTexto({ label, ...props }: TextareaHTMLAttributes<HTMLTextAreaElement> & { label: string }) {
  return (
    <label className="block space-y-1">
      <span className="text-sm font-medium text-slate-700">{label}</span>
      <textarea className={campoClasses} rows={3} {...props} />
    </label>
  )
}

export function Cabecalho({ titulo, children }: { titulo: string; children?: ReactNode }) {
  return (
    <header className="sticky top-0 z-10 flex items-center gap-3 border-b border-slate-100 bg-white/90 px-4 py-3 backdrop-blur">
      {children}
      <h1 className="text-lg font-bold">{titulo}</h1>
    </header>
  )
}

export function Tag({ children }: { children: ReactNode }) {
  return <span className="rounded-full bg-brand-50 px-2.5 py-0.5 text-xs font-medium text-brand-700">{children}</span>
}

