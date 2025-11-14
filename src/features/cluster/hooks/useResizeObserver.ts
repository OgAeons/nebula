import { useEffect, useState } from 'react'

export function useResizeObserver(ref: React.RefObject<HTMLElement | null>) {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect
      setDimensions({ width, height })
    })

    observer.observe(el)
    return () => observer.disconnect()
  }, [ref])

  return dimensions
}
