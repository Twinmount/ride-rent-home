'use client'

import { useState, useEffect, MutableRefObject } from 'react'

interface UseIntersectionObserverOptions {
  threshold?: number | number[]
  root?: Element | null
  rootMargin?: string
}

const useIntersectionObserver = (
  ref: MutableRefObject<Element | null>,
  options: UseIntersectionObserverOptions = { threshold: 0.1 }
): boolean => {
  const [isIntersecting, setIntersecting] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIntersecting(entry.isIntersecting),
      options
    )

    const current = ref.current
    if (current) {
      observer.observe(current)
    }

    return () => {
      if (current) {
        observer.unobserve(current)
      }
    }
  }, [ref, options])

  return isIntersecting
}

export default useIntersectionObserver
