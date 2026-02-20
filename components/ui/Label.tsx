// src/components/ui/Label.tsx

interface LabelProps {
  text: string
  required?: boolean
  hint?: string
  error?: string
  className?: string
}

export function Label({ text, required, hint, error, className = '' }: LabelProps) {
  return (
    <div className={`flex flex-col gap-0.5 ${className}`}>
      <label className="block text-sm font-medium text-gray-700">
        {text}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      {hint && !error  && <p className="text-xs text-gray-400">{hint}</p>}
      {error           && <p className="text-xs text-red-500">{error}</p>}
    </div>
  )
}