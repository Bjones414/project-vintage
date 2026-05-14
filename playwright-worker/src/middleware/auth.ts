import type { Request, Response, NextFunction } from 'express'

const HEADER = 'x-worker-secret'

export function authMiddleware(req: Request, res: Response, next: NextFunction): void {
  const secret = process.env.PLAYWRIGHT_WORKER_SECRET
  if (!secret) {
    console.error('[auth] PLAYWRIGHT_WORKER_SECRET is not set — rejecting all requests')
    res.status(401).json({ error: 'Worker secret not configured' })
    return
  }

  const provided = req.headers[HEADER]
  if (!provided || provided !== secret) {
    res.status(401).json({ error: 'Unauthorized' })
    return
  }

  next()
}
