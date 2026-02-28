// src/components/details/DetailCard.tsx
interface DetailCardProps {
  label: string
  children: React.ReactNode
  className?: string
  row?: boolean // layout horizontal (label + conteúdo lado a lado)
}

export function DetailCard({ label, children, className = '', row = false }: DetailCardProps) {
  return (
    <div className={`
      bg-white sm:bg-gray-50
      rounded-xl sm:rounded-2xl
      border border-gray-100
      p-2.5 sm:p-3
      ${row ? 'flex items-center justify-between' : 'flex flex-col'}
      ${className}
    `}>
      <span className="text-[9px] sm:text-[10px] font-semibold text-gray-400 uppercase tracking-widest">
        {label}
      </span>
      {children}
    </div>
  )
}