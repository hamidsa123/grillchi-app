'use client'
import { useEffect } from 'react'
import { useMenuStore } from '@/store/useMenuStore'
import Ic from './Ic'

export default function Toast() {
  const { toast, clearToast } = useMenuStore()
  useEffect(() => {
    if (!toast) return
    const t = setTimeout(clearToast, 1700)
    return () => clearTimeout(t)
  }, [toast, clearToast])

  if (!toast) return null
  return (
    <div style={{ position: 'fixed', bottom: 104, insetInline: 0, zIndex: 80, display: 'flex', justifyContent: 'center', pointerEvents: 'none' }}>
      <div className="toast-inner">
        <Ic name="check" size={17} sw={2.4} />
        {toast}
      </div>
    </div>
  )
}
