'use client'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Locale } from '@/types/menu.types'

interface MenuStore {
  branchId: string
  sheet: 'lang' | 'branch' | null
  toast: string | null
  setBranchId: (id: string) => void
  openSheet: (s: 'lang' | 'branch') => void
  closeSheet: () => void
  showToast: (msg: string) => void
  clearToast: () => void
}

export const useMenuStore = create<MenuStore>()(
  persist(
    (set) => ({
      branchId: 'velenjak',
      sheet: null,
      toast: null,
      setBranchId: (id) => set({ branchId: id }),
      openSheet: (s) => set({ sheet: s }),
      closeSheet: () => set({ sheet: null }),
      showToast: (msg) => set({ toast: msg }),
      clearToast: () => set({ toast: null }),
    }),
    {
      name: 'gc_store',
      partialize: (s) => ({ branchId: s.branchId }),
    }
  )
)
