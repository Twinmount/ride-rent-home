'use client' // Error components must be Client Components

import { useEffect } from 'react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error)
  }, [error])

  return (
    <div className="w-full h-screen flex flex-col items-center pt-72 text-center">
      <h2 className="text-2xl font-semibold text-black">
        Something went wrong!
      </h2>
      <p className="text-sm text-red-500">{error.message}</p>
      <button
        className="bg-slate-900 px-2 py-1 rounded-xl text-white hover:bg-slate-950 mt-3"
        onClick={() => reset()}
      >
        Try again
      </button>
    </div>
  )
}
