export function computeInitials(
  firstName: string | null,
  lastName: string | null,
  email: string | null,
): string {
  if (firstName && lastName) return (firstName[0] + lastName[0]).toUpperCase()
  if (firstName) return firstName[0].toUpperCase()
  if (email) return email[0].toUpperCase()
  return '?'
}
