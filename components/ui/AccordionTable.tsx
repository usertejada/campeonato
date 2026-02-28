// src/components/ui/AccordionTable.tsx
'use client'

import { useState, ReactNode } from 'react'
import { ChevronDown } from 'lucide-react'

// ── Types ─────────────────────────────────────────────────────

export interface AccordionColumn<T> {
  key: string
  header: string
  render: (item: T) => ReactNode
  /** Se true, aparece como coluna "resumo" visível no mobile (collapsed) */
  summary?: boolean
}

interface AccordionTableProps<T> {
  items: T[]
  columns: AccordionColumn<T>[]
  keyExtractor: (item: T) => string | number
  /** Largura das colunas no grid (desktop) ex: 'grid-cols-[2fr_1fr_80px]' */
  gridCols: string
  /** Conteúdo do header da tabela (desktop) — se omitido, gerado automaticamente */
  renderHeader?: () => ReactNode
  /** Slot extra no footer */
  footer?: ReactNode
  /** Slot no canto direito do footer */
  footerAction?: ReactNode
  emptyMessage?: string
}

// ── Component ─────────────────────────────────────────────────

export function AccordionTable<T>({
  items,
  columns,
  keyExtractor,
  gridCols,
  renderHeader,
  footer,
  footerAction,
  emptyMessage = 'Nenhum item encontrado.',
}: AccordionTableProps<T>) {
  const [openKeys, setOpenKeys] = useState<Set<string | number>>(new Set())

  const toggle = (key: string | number) => {
    setOpenKeys(prev => {
      const next = new Set(prev)
      next.has(key) ? next.delete(key) : next.add(key)
      return next
    })
  }

  const summaryColumns = columns.filter(c => c.summary)
  const detailColumns  = columns.filter(c => !c.summary)

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">

      {/* ── Desktop Header ─────────────────────────────────── */}
      <div className={`hidden md:grid ${gridCols} gap-2 px-4 py-3.5 bg-linear-to-r from-indigo-500 via-violet-500 to-purple-500`}>
        {renderHeader
          ? renderHeader()
          : columns.map(col => (
              <span
                key={col.key}
                className="text-[12px] font-extrabold tracking-widest whitespace-nowrap text-white/80 uppercase"
              >
                {col.header}
              </span>
            ))}
      </div>

      {/* ── Mobile Header ──────────────────────────────────── */}
      <div className="md:hidden px-4 py-3 bg-linear-to-r from-indigo-500 via-violet-500 to-purple-500">
        <span className="text-[11px] font-extrabold tracking-widest text-white/80 uppercase">
          {summaryColumns.map(c => c.header).join(' · ')}
        </span>
      </div>

      {/* ── Rows ───────────────────────────────────────────── */}
      <div className="divide-y divide-gray-100">
        {items.length === 0 && (
          <p className="px-4 py-6 text-center text-sm text-gray-400">{emptyMessage}</p>
        )}

        {items.map(item => {
          const key    = keyExtractor(item)
          const isOpen = openKeys.has(key)

          return (
            <div key={key}>

              {/* Desktop Row */}
              <div
                className={`hidden md:grid ${gridCols} gap-2 px-4 py-3 hover:bg-gray-50 transition-colors items-center`}
              >
                {columns.map(col => (
                  <div key={col.key}>{col.render(item)}</div>
                ))}
              </div>

              {/* Mobile Row */}
              <div className="md:hidden">
                {/* Summary (always visible) */}
                <button
                  onClick={() => toggle(key)}
                  className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    {summaryColumns.map(col => (
                      <div key={col.key} className="min-w-0">
                        {col.render(item)}
                      </div>
                    ))}
                  </div>
                  <ChevronDown
                    size={16}
                    className={`text-gray-400 shrink-0 ml-2 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                  />
                </button>

                {/* Detail (accordion) */}
                <div
                  className={`overflow-hidden transition-all duration-300 ease-in-out ${
                    isOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
                  }`}
                >
                  <div className="px-4 pb-3 grid grid-cols-2 gap-x-4 gap-y-2 bg-gray-50/60 border-t border-gray-100">
                    {detailColumns.map(col => (
                      <div key={col.key} className="flex flex-col gap-0.5">
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                          {col.header}
                        </span>
                        <div className="text-sm">{col.render(item)}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

            </div>
          )
        })}
      </div>

      {/* ── Footer ─────────────────────────────────────────── */}
      {(footer || footerAction) && (
        <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100 bg-gray-50/50">
          <div className="text-xs text-gray-500">{footer}</div>
          {footerAction && <div>{footerAction}</div>}
        </div>
      )}
    </div>
  )
}