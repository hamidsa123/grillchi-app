'use client'
import { useEffect, useRef, ElementType, ComponentPropsWithoutRef } from 'react'

type Props<T extends ElementType> = {
  as?: T
  delay?: number
  className?: string
  children: React.ReactNode
} & Omit<ComponentPropsWithoutRef<T>, 'as' | 'delay' | 'children' | 'className'>

export default function Reveal<T extends ElementType = 'div'>({
  as, delay = 0, className = '', children, ...rest
}: Props<T>) {
  const ref = useRef<HTMLElement>(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      (entries) => entries.forEach(e => { if (e.isIntersecting) { el.classList.add('in'); io.unobserve(el) } }),
      { threshold: 0.12, root: el.closest('.scroll-root') }
    )
    io.observe(el)
    const fb = setTimeout(() => el.classList.add('in'), 600)
    return () => { io.disconnect(); clearTimeout(fb) }
  }, [])

  const Tag = (as ?? 'div') as ElementType
  return (
    <Tag ref={ref} className={`reveal ${className}`} style={{ transitionDelay: `${delay}ms` }} {...rest}>
      {children}
    </Tag>
  )
}
