interface Props {
  size?: number
}

export function PVMark({ size = 52 }: Props) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 52 52"
      fill="none"
      role="img"
      aria-label="Project Vintage"
    >
      <circle cx="26" cy="26" r="24" fill="none" stroke="currentColor" strokeWidth="0.6" />
      <circle cx="26" cy="26" r="18" fill="none" stroke="currentColor" strokeWidth="0.4" />
      <line x1="4" y1="26" x2="14" y2="26" stroke="currentColor" strokeWidth="0.6" />
      <line x1="38" y1="26" x2="48" y2="26" stroke="currentColor" strokeWidth="0.6" />
      <circle cx="26" cy="26" r="1.6" fill="currentColor" />
    </svg>
  )
}
