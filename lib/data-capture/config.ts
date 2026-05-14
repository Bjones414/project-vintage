// DATA_CAPTURE_ENABLED=true enables listing_captures writes.
// Defaults to false (fail-safe: capture is opt-in at deploy time).
export const dataCaptureEnabled: boolean =
  process.env.DATA_CAPTURE_ENABLED === 'true'
