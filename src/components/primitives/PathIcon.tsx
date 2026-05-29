interface Props { d: string; size?: number; sw?: number }

export default function PathIcon({ d, size = 22, sw = 1.7 }: Props) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"
      dangerouslySetInnerHTML={{ __html: d }} />
  )
}
