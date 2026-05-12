// Generations that use the typography-only hero (State B) rather than a photo hero.
// Add an ID here when the available image is not suitable (wrong model, poor quality,
// or no generation-specific photo exists). The photo constant may still have an entry
// for these IDs — this list overrides it for the hero rendering decision.
export const GENERATIONS_WITHOUT_IMAGE: readonly string[] = [
  '982-cayman', // No dedicated Cayman-only shot; available image is a Boxster Spyder RS
]
