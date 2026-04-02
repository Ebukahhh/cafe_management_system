'use client'

import { useEffect, useState } from 'react'

type PrepTimerProps = {
  /** ISO timestamp when the order entered preparing (we use `updated_at` at transition). */
  startedAtIso: string
}

function formatElapsed(totalSeconds: number): string {
  const m = Math.floor(totalSeconds / 60)
  const s = totalSeconds % 60
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

export function PrepTimer({ startedAtIso }: PrepTimerProps) {
  const [now, setNow] = useState(() => Date.now())

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(id)
  }, [])

  const start = new Date(startedAtIso).getTime()
  const elapsedSec = Math.max(0, Math.floor((now - start) / 1000))
  const minutes = elapsedSec / 60

  let colorClass = 'text-primary'
  let warn: string | null = null
  if (minutes >= 20) {
    colorClass = 'text-red-400'
    warn = 'Taking longer than usual'
  } else if (minutes >= 10) {
    colorClass = 'text-amber-400'
  }

  return (
    <div className="flex flex-col items-end gap-0.5">
      <span className={`font-mono text-sm font-bold ${colorClass}`}>{formatElapsed(elapsedSec)}</span>
      {warn ? <span className="max-w-[140px] text-right text-[9px] font-medium text-red-400/90">{warn}</span> : null}
    </div>
  )
}
