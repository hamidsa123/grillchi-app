const ICONS: Record<string, string> = {
  chevron: '<polyline points="9 6 15 12 9 18"/>',
  chevronDown: '<polyline points="6 9 12 15 18 9"/>',
  back: '<polyline points="15 18 9 12 15 6"/>',
  plus: '<line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>',
  minus: '<line x1="5" y1="12" x2="19" y2="12"/>',
  globe: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/>',
  pin: '<path d="M12 21s-7-6-7-11a7 7 0 0 1 14 0c0 5-7 11-7 11Z"/><circle cx="12" cy="10" r="2.5"/>',
  flame: '<path d="M12 3c1 3-1 4-1 6 0 1 1 2 1 2s2-1 2-3c2 2 3 4 3 6a5 5 0 0 1-10 0c0-3 2-5 3-7 0-1 1-2 2-4Z"/>',
  search: '<circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16.5" y2="16.5"/>',
  home: '<path d="M3 11l9-7 9 7"/><path d="M5 10v10h14V10"/>',
  star: '<path d="M12 3l2.6 5.6L21 9.3l-4.5 4.2 1.1 6.2L12 16.8 6.4 19.7l1.1-6.2L3 9.3l6.4-.7Z"/>',
  grid: '<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/>',
  clock: '<circle cx="12" cy="12" r="9"/><polyline points="12 7 12 12 16 14"/>',
  bolt: '<path d="M13 2L4 14h7l-1 8 9-12h-7l1-8Z"/>',
  pepper: '<path d="M10 6c0-2 2-3 4-2 2 1 1 3 0 3M10 6c-3 1-5 5-5 9a4 4 0 0 0 8 0c0-4-2-7-3-9Z"/>',
  leaf: '<path d="M5 19c0-8 6-14 14-14 0 8-6 14-14 14Z"/><path d="M5 19c3-4 7-7 11-9"/>',
  check: '<polyline points="4 12 9 17 20 6"/>',
  close: '<line x1="6" y1="6" x2="18" y2="18"/><line x1="18" y1="6" x2="6" y2="18"/>',
  arrow: '<line x1="5" y1="12" x2="19" y2="12"/><polyline points="13 6 19 12 13 18"/>',
  heart: '<path d="M12 20s-7-4.5-9.5-9C1 8 2.5 4.5 6 4.5c2 0 3 1.2 3.8 2.3C10.6 5.7 11.6 4.5 13.6 4.5 17.1 4.5 18.6 8 18 11c-1.5 4-6 9-6 9Z"/>',
  bag: '<path d="M6 8h12l-1 12H7L6 8Z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/>',
  utensils: '<path d="M7 3v8M5 3v5a2 2 0 0 0 4 0V3M7 11v10M16 3c-2 0-3 3-3 6s1 4 3 4v8"/>',
  menu: '<line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>',
  image: '<rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/>',
  trash: '<path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6"/>',
  edit: '<path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5Z"/>',
  logout: '<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/>',
  dashboard: '<rect x="3" y="3" width="7" height="4" rx="1"/><rect x="14" y="3" width="7" height="4" rx="1"/><rect x="14" y="11" width="7" height="10" rx="1"/><rect x="3" y="11" width="7" height="10" rx="1"/>',
}

interface Props {
  name: string
  size?: number
  sw?: number
  style?: React.CSSProperties
  className?: string
}

export default function Ic({ name, size = 24, sw = 1.8, style, className }: Props) {
  return (
    <svg
      width={size} height={size} viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth={sw}
      strokeLinecap="round" strokeLinejoin="round"
      style={style} className={className}
      dangerouslySetInnerHTML={{ __html: ICONS[name] || '' }}
    />
  )
}
