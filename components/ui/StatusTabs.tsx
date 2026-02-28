// src/components/ui/StatusTabs.tsx
'use client'

export interface StatusTab {
  label: string
  value: string
}

interface StatusTabsProps {
  tabs:     StatusTab[]
  value:    string
  onChange: (value: string) => void
}

export function StatusTabs({ tabs, value, onChange }: StatusTabsProps) {
  return (
    <div className="flex gap-1 bg-gray-100 p-1 rounded-xl overflow-x-auto shrink-0">
      {tabs.map(tab => (
        <button
          key={tab.value}
          onClick={() => onChange(tab.value)}
          className={`px-3 py-1.5 text-xs font-semibold rounded-lg whitespace-nowrap transition-colors ${
            value === tab.value
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  )
}