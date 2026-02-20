// src/components/ui/PageHeader.tsx

interface PageHeaderProps {
  title: string
  subtitle?: string
  action?: React.ReactNode
  className?: string
}

export function PageHeader({ 
  title, 
  subtitle, 
  action,
  className = '' 
}: PageHeaderProps) {
  return (
    <div className={`mb-8 ${className}`}>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">{title}</h1>
        {action && (
          <div className="shrink-0">
            {action}
          </div>
        )}
      </div>
      {subtitle && (
        <p className="text-sm sm:text-base text-gray-600 mt-1">{subtitle}</p>
      )}
    </div>
  )
}