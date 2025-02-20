'use client'

import { useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react' // You can use any icon library

const BackButton = () => {
  const router = useRouter()

  return (
    <button
      onClick={() => router.back()}
      className="flex items-center gap-x-1 h-fit w-fit bg-slate-800 text-white hover:text-yellow px-2 py-1 rounded-2xl hover:bg-slate-900 transition-all relative bottom-2"
      aria-label="Go back to the previous page"
    >
      <ArrowLeft /> back
    </button>
  )
}

export default BackButton
