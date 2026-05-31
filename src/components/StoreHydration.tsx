'use client'
import { useEffect } from 'react'
import { useMenuStore } from '@/store/useMenuStore'

export default function StoreHydration() {
  useEffect(() => {
    useMenuStore.persist.rehydrate()
  }, [])
  return null
}
