export function AlphaBanner() {
  if (process.env.ALPHA_BANNER_ENABLED === 'false') return null

  return (
    <div className="border-b-[0.5px] border-border-default bg-bg-elevated px-8 py-[9px] text-center font-serif text-[13px] italic tracking-[0.01em] text-text-tertiary">
      <strong className="not-italic font-medium text-text-secondary">
        Project Vintage alpha.
      </strong>{' '}
      Invitation-only access while we tune the foundations.
    </div>
  )
}
