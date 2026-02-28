// src/components/ui/DateRangePicker.tsx
'use client'

import { useState, useMemo } from 'react'
import { ChevronLeft, ChevronRight, ChevronDown, Calendar, X, Check } from 'lucide-react'
import { Button } from './Button'
import { Icon } from './Icon'
import { Modal } from './Modal'

interface DateRangePickerProps {
  label?: string
  startDate: string
  endDate: string
  onStartChange: (date: string) => void
  onEndChange: (date: string) => void
  required?: boolean
  disabled?: boolean
  error?: string
  singleDate?: boolean
  singleDateTitle?: string
}

const MONTHS = [
  'Janeiro','Fevereiro','Março','Abril','Maio','Junho',
  'Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'
]
const WEEKDAYS = ['Dom','Seg','Ter','Qua','Qui','Sex','Sáb']

function toISO(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`
}

function parseISO(str: string) {
  return str ? new Date(str + 'T00:00:00') : null
}

function formatDisplay(str: string) {
  if (!str) return ''
  const d = parseISO(str)!
  return `${String(d.getDate()).padStart(2,'0')}/${String(d.getMonth()+1).padStart(2,'0')}/${d.getFullYear()}`
}

export function DateRangePicker({
  label,
  startDate,
  endDate,
  onStartChange,
  onEndChange,
  required,
  disabled,
  error,
  singleDate = false,
  singleDateTitle = 'Selecionar Data',
}: DateRangePickerProps) {
  const [open, setOpen]       = useState(false)
  const [hovered, setHovered] = useState<string | null>(null)
  const [yearPicker, setYearPicker] = useState(false)
  const [currentMonth, setCurrentMonth] = useState(() => {
    if (startDate) return new Date(startDate + 'T00:00:00')
    return new Date()
  })

  const days = useMemo(() => {
    const year  = currentMonth.getFullYear()
    const month = currentMonth.getMonth()
    const firstDow    = new Date(year, month, 1).getDay()
    const daysInMonth = new Date(year, month + 1, 0).getDate()
    const prevDays    = new Date(year, month, 0).getDate()
    const result: { iso: string; day: number; current: boolean }[] = []

    for (let i = firstDow - 1; i >= 0; i--)
      result.push({ iso: toISO(new Date(year, month - 1, prevDays - i)), day: prevDays - i, current: false })
    for (let d = 1; d <= daysInMonth; d++)
      result.push({ iso: toISO(new Date(year, month, d)), day: d, current: true })
    const remaining = 42 - result.length
    for (let d = 1; d <= remaining; d++)
      result.push({ iso: toISO(new Date(year, month + 1, d)), day: d, current: false })

    return result
  }, [currentMonth])

  const handleDayClick = (iso: string) => {
    if (singleDate) {
      onStartChange(iso === startDate ? '' : iso)
      if (iso !== startDate) setOpen(false)
      return
    }
    if (!startDate || (startDate && endDate)) {
      onStartChange(iso); onEndChange(''); return
    }
    if (iso < startDate)        onStartChange(iso)
    else if (iso === startDate) onStartChange('')
    else                        onEndChange(iso)
  }

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation()
    onStartChange(''); onEndChange('')
  }

  const isInRange = (iso: string) => {
    if (singleDate) return false
    const ref = hovered || endDate
    if (!startDate || !ref) return false
    const lo = startDate < ref ? startDate : ref
    const hi = startDate < ref ? ref : startDate
    return iso > lo && iso < hi
  }

  const isStart = (iso: string) => iso === startDate
  const isEnd   = (iso: string) => iso === endDate
  const isToday = (iso: string) => iso === toISO(new Date())

  const currentYear = currentMonth.getFullYear()
  const yearList = Array.from({ length: 100 }, (_, i) => currentYear + 10 - i)

  const CalNav = (
    <div className="flex items-center justify-between pb-2">
      {!yearPicker && (
        <Icon icon={ChevronLeft} size={16} className="text-gray-600 p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
          onClick={() => setCurrentMonth(p => new Date(p.getFullYear(), p.getMonth() - 1, 1))} />
      )}
      <button
        type="button"
        onClick={() => setYearPicker(v => !v)}
        className="flex-1 text-sm font-semibold text-gray-900 hover:text-blue-600 transition-colors text-center"
      >
        {MONTHS[currentMonth.getMonth()]} {currentYear}
        <ChevronDown size={12} className={`inline ml-1 transition-transform ${yearPicker ? 'rotate-180' : ''}`} />
      </button>
      {!yearPicker && (
        <Icon icon={ChevronRight} size={16} className="text-gray-600 p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
          onClick={() => setCurrentMonth(p => new Date(p.getFullYear(), p.getMonth() + 1, 1))} />
      )}
    </div>
  )

  const YearPicker = yearPicker ? (
    <div className="grid grid-cols-4 gap-1 max-h-48 overflow-y-auto py-1 mb-2">
      {yearList.map(y => (
        <button
          key={y}
          type="button"
          onClick={() => {
            setCurrentMonth(p => new Date(y, p.getMonth(), 1))
            setYearPicker(false)
          }}
          className={[
            'py-1.5 rounded-lg text-sm font-medium transition-colors',
            y === currentYear
              ? 'bg-blue-500 text-white'
              : 'text-gray-700 hover:bg-blue-50 hover:text-blue-600',
          ].join(' ')}
        >
          {y}
        </button>
      ))}
    </div>
  ) : null

  const CalGrid = (
    <>
      <div className="grid grid-cols-7">
        {WEEKDAYS.map(d => (
          <div key={d} className="text-center text-xs font-semibold text-gray-400 py-1">{d}</div>
        ))}
      </div>
      <div className="grid grid-cols-7">
        {days.map((d, i) => {
          const sel      = isStart(d.iso) || isEnd(d.iso)
          const range    = isInRange(d.iso)
          const today    = isToday(d.iso)
          const isStartD = isStart(d.iso)
          const isEndD   = isEnd(d.iso)
          return (
            <div key={i} className={[
              'relative flex items-center justify-center h-9',
              range ? 'bg-blue-50' : '',
              isStartD && endDate ? 'rounded-l-full' : '',
              isEndD ? 'rounded-r-full' : '',
              (!isStartD && !isEndD && range)
                ? (i % 7 === 0 ? 'rounded-l-full' : i % 7 === 6 ? 'rounded-r-full' : '') : '',
            ].join(' ')}>
              <button
                type="button"
                onClick={() => handleDayClick(d.iso)}
                onMouseEnter={() => !singleDate && startDate && !endDate && setHovered(d.iso)}
                onMouseLeave={() => setHovered(null)}
                className={[
                  'w-9 h-9 rounded-full text-sm font-medium transition-all relative z-10',
                  !d.current ? 'text-gray-300' : '',
                  sel ? 'bg-blue-500 text-white font-bold shadow-md hover:bg-blue-600'
                    : d.current ? 'text-gray-800 hover:bg-blue-100 hover:text-blue-700'
                    : 'hover:bg-gray-50',
                  today && !sel ? 'ring-2 ring-blue-400 ring-offset-1' : '',
                ].join(' ')}
              >
                {d.day}
                {today && !sel && (
                  <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-blue-500" />
                )}
              </button>
            </div>
          )
        })}
      </div>
    </>
  )

  // ── Modal: modo data única ─────────────────────────────────
  const singleHeader = (
    <div className="flex items-center justify-between px-5 py-4">
      <div>
        <h3 className="text-base font-semibold text-gray-900">{singleDateTitle}</h3>
        <p className="text-xs text-gray-400 mt-0.5">
          {startDate ? formatDisplay(startDate) : 'Selecione uma data'}
        </p>
      </div>
      <Icon icon={X} size={16} className="text-gray-400 p-1.5 rounded-lg hover:bg-gray-100 transition-colors" onClick={() => setOpen(false)} />
    </div>
  )

  const singleFooter = (
    <div className="flex items-center justify-between gap-3">
      <Button variant="ghost" size="sm" onClick={() => { onStartChange(''); onEndChange('') }}>Limpar</Button>
      <Button variant="primary" size="sm" icon={Check} iconPosition="left"
        disabled={!startDate}
        onClick={() => setOpen(false)}>
        Confirmar
      </Button>
    </div>
  )

  // ── Modal: modo range ──────────────────────────────────────
  const step = !startDate ? 'inicio' : !endDate ? 'termino' : 'pronto'

  const rangeHeader = (
    <div>
      <div className="flex items-center justify-between px-5 py-4">
        <div>
          <h3 className="text-base font-semibold text-gray-900">Período do Campeonato</h3>
          <p className="text-xs text-gray-400 mt-0.5">
            {step === 'inicio'  && 'Selecione a data de início'}
            {step === 'termino' && 'Agora selecione a data de término'}
            {step === 'pronto'  && `${formatDisplay(startDate)} → ${formatDisplay(endDate)}`}
          </p>
        </div>
        <Icon icon={X} size={16} className="text-gray-400 p-1.5 rounded-lg hover:bg-gray-100 transition-colors" onClick={() => setOpen(false)} />
      </div>
      <div className="flex items-center gap-2 px-5 py-3 bg-gray-50 border-t border-gray-100">
        <div className={['flex-1 px-3 py-1.5 rounded-lg text-xs font-medium text-center border transition-all',
          step === 'inicio' ? 'border-blue-400 bg-blue-50 text-blue-700 ring-2 ring-blue-100'
            : startDate ? 'border-blue-200 bg-blue-50 text-blue-700'
            : 'border-gray-200 bg-white text-gray-400'].join(' ')}>
          {startDate ? formatDisplay(startDate) : 'Início'}
        </div>
        <Icon icon={ChevronRight} size={16} className="text-gray-300 shrink-0" />
        <div className={['flex-1 px-3 py-1.5 rounded-lg text-xs font-medium text-center border transition-all',
          step === 'termino' ? 'border-blue-400 bg-blue-50 text-blue-700 ring-2 ring-blue-100'
            : endDate ? 'border-blue-200 bg-blue-50 text-blue-700'
            : 'border-gray-200 bg-white text-gray-400'].join(' ')}>
          {endDate ? formatDisplay(endDate) : 'Término'}
        </div>
      </div>
    </div>
  )

  const rangeFooter = (
    <div className="flex items-center justify-between gap-3">
      <Button variant="ghost" size="sm" onClick={() => { onStartChange(''); onEndChange('') }}>Limpar</Button>
      <Button variant="primary" size="sm" icon={Check} iconPosition="left"
        disabled={!startDate || !endDate}
        onClick={() => { if (startDate && endDate) setOpen(false) }}>
        Confirmar
      </Button>
    </div>
  )

  // ── Trigger ───────────────────────────────────────────────
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      <div
        role="button"
        tabIndex={disabled ? -1 : 0}
        onClick={() => !disabled && setOpen(true)}
        onKeyDown={(e) => e.key === 'Enter' && !disabled && setOpen(true)}
        className={[
          'w-full flex items-center gap-2 px-4 py-2 text-sm',
          'border rounded-lg outline-none transition cursor-pointer bg-white',
          error
            ? 'border-red-500'
            : 'border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent',
          disabled ? 'bg-gray-100 cursor-not-allowed opacity-60' : '',
        ].join(' ')}
      >
        <Icon icon={Calendar} size={16} className="text-gray-400 shrink-0" />

        {singleDate ? (
          <span className={startDate ? 'text-gray-900 flex-1' : 'text-gray-500 flex-1'}>
            {startDate ? formatDisplay(startDate) : 'dd/mm/aaaa'}
          </span>
        ) : (
          <>
            <span className={startDate ? 'text-gray-900' : 'text-gray-500'}>
              {startDate ? formatDisplay(startDate) : 'Data de início'}
            </span>
            <span className="text-gray-300">→</span>
            <span className={endDate ? 'text-gray-900' : 'text-gray-500'}>
              {endDate ? formatDisplay(endDate) : 'Data de término'}
            </span>
          </>
        )}

        {(startDate || endDate) && !disabled && (
          <Icon icon={X} size={16} className="ml-auto text-gray-300 hover:text-gray-500 transition-colors" onClick={handleClear} />
        )}
      </div>

      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}

      {/* ← mobileCenter garante centralização em sm/mobile */}
      <Modal
        isOpen={open}
        onClose={() => setOpen(false)}
        size="sm"
        mobileCenter
        header={singleDate ? singleHeader : rangeHeader}
        footer={singleDate ? singleFooter : rangeFooter}
      >
        {CalNav}
        {YearPicker}
        {!yearPicker && CalGrid}
      </Modal>
    </div>
  )
}