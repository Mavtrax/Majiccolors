import { useEffect, useRef } from 'react'

const DRIPS = [
  { x: 8,  h: 55, color: '#ff6b00', delay: 0    },
  { x: 18, h: 38, color: '#00d4ff', delay: 0.2  },
  { x: 29, h: 70, color: '#ff2d78', delay: 0.1  },
  { x: 41, h: 45, color: '#b44fff', delay: 0.35 },
  { x: 53, h: 62, color: '#f5c400', delay: 0.05 },
  { x: 64, h: 40, color: '#1e90ff', delay: 0.25 },
  { x: 76, h: 58, color: '#39ff14', delay: 0.15 },
  { x: 87, h: 35, color: '#ff6b00', delay: 0.3  },
  { x: 94, h: 50, color: '#ff2d78', delay: 0.08 },
]

export default function PaintDrip({ sectionId }: { sectionId: string }) {
  const wrapRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const wrap = wrapRef.current
    if (!wrap) return

    const target = document.getElementById(sectionId)
    if (!target) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          wrap.classList.add('drips-active')
          observer.disconnect()
        }
      },
      { threshold: 0.15 }
    )
    observer.observe(target)
    return () => observer.disconnect()
  }, [sectionId])

  return (
    <div
      ref={wrapRef}
      className="drip-container"
      aria-hidden="true"
      style={{ position: 'relative', height: '80px', pointerEvents: 'none', overflow: 'visible' }}
    >
      {DRIPS.map((d, i) => (
        <div
          key={i}
          className="drip"
          style={{
            left: `${d.x}%`,
            height: `${d.h}px`,
            background: d.color,
            animationDelay: `${d.delay}s`,
          }}
        />
      ))}
    </div>
  )
}
