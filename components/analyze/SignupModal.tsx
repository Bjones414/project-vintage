'use client'

import { useEffect } from 'react'

type Props = {
  isOpen: boolean
  onClose: () => void
}

export function SignupModal({ isOpen, onClose }: Props) {
  useEffect(() => {
    if (!isOpen) return
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="signup-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
    >
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
        aria-hidden="true"
      />
      <div className="relative w-full max-w-md rounded-xl bg-white p-8 shadow-xl">
        <button
          type="button"
          onClick={onClose}
          aria-label="Close dialog"
          className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
        >
          &#x2715;
        </button>
        <h2 id="signup-modal-title" className="text-xl font-bold text-gray-900">
          Create a free account
        </h2>
        <p className="mt-2 text-sm text-gray-500">
          Save analyses and watch listings. No card required.
        </p>
        <div className="mt-6 flex flex-col gap-3">
          <a
            href="/signup"
            className="block rounded-md bg-gray-900 px-4 py-3 text-center text-sm font-semibold text-white hover:bg-gray-700"
          >
            Create free account
          </a>
          <a
            href="/login"
            className="block rounded-md border border-gray-300 px-4 py-3 text-center text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Sign in
          </a>
        </div>
      </div>
    </div>
  )
}
