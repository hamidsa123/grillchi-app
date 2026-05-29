'use client'
import { useEffect } from 'react'

interface Props { onClose: () => void; children: React.ReactNode }

export default function Sheet({ onClose, children }: Props) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [onClose])

  return (
    <div className="sheet-wrap" onClick={onClose}>
      <div className="sheet-panel" onClick={e => e.stopPropagation()}>
        <div className="sheet-grip" />
        {children}
      </div>
    </div>
  )
}
