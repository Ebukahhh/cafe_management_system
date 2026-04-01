/** Initials for avatar fallback, e.g. "Abena Mensah" → "AM" */
export function initialsFromName(name: string | null | undefined): string {
  const n = name?.trim()
  if (!n) return '?'
  const parts = n.split(/\s+/).filter(Boolean)
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

export function formatUsd(n: number): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n)
}
