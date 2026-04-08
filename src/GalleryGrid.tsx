import { useEffect, useRef, useState } from 'react'

interface GalleryItem {
  src: string
  label: string
}

const GLOW_COLORS = [
  '#ff6b00', '#00d4ff', '#ff2d78',
  '#b44fff', '#f5c400', '#1e90ff',
  '#39ff14', '#ff6b00', '#00d4ff',
]

// Rotations de base déterministes par carte
const BASE_ROT = [-7, 4, -3, 8, -5, 6, -9, 3, -6]
// Décalages verticaux pour effet masonry
const TOP_OFF = ['0rem', '3rem', '6rem', '1rem', '4rem', '0.5rem', '5rem', '2rem', '1.5rem']

function GalleryCard({ item, index, onOpen }: { item: GalleryItem; index: number; onOpen: () => void }) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)
  const [tilt, setTilt] = useState({ x: 0, y: 0 })
  const [hovered, setHovered] = useState(false)

  const glow = GLOW_COLORS[index % GLOW_COLORS.length]
  const baseRot = BASE_ROT[index % BASE_ROT.length]
  const delay = index * 110

  useEffect(() => {
    const el = wrapRef.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect() } },
      { threshold: 0.08 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect()
    const x = ((e.clientX - r.left) / r.width - 0.5) * 2
    const y = ((e.clientY - r.top) / r.height - 0.5) * 2
    setTilt({ x: -y * 24, y: x * 24 })
  }

  return (
    <div
      ref={wrapRef}
      style={{ marginTop: TOP_OFF[index % TOP_OFF.length], perspective: '900px', cursor: 'pointer' }}
      onClick={onOpen}
      onMouseMove={onMouseMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => { setTilt({ x: 0, y: 0 }); setHovered(false) }}
    >
      {/* Entrée au scroll */}
      <div
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? 'translateY(0) scale(1)' : 'translateY(80px) scale(0.88)',
          transition: `opacity 1s ease ${delay}ms, transform 1s cubic-bezier(0.16,1,0.3,1) ${delay}ms`,
        }}
      >
        {/* Tilt 3D */}
        <div
          style={{
            transform: `rotateZ(${hovered ? 0 : baseRot}deg) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) translateZ(${hovered ? 36 : 0}px) scale(${hovered ? 1.03 : 1})`,
            transition: hovered
              ? 'transform 0.07s linear, box-shadow 0.25s ease'
              : 'transform 0.65s cubic-bezier(0.16,1,0.3,1), box-shadow 0.4s ease',
            borderRadius: '14px',
            overflow: 'hidden',
            boxShadow: hovered
              ? `0 30px 60px -10px ${glow}70, 0 0 0 1px ${glow}50, 0 0 40px ${glow}25`
              : '0 8px 28px rgba(0,0,0,0.55)',
            transformStyle: 'preserve-3d',
            position: 'relative',
          }}
        >
          {item.src
            ? <img src={item.src} alt={item.label} className="w-full aspect-[4/3] object-cover block" loading="lazy" />
            : <div className="w-full aspect-[4/3]" style={{ background: `linear-gradient(135deg, ${glow}, #111)` }} />
          }

          {/* Reflet brillant au hover */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(135deg, rgba(255,255,255,0.14) 0%, transparent 55%)',
              opacity: hovered ? 1 : 0,
              transition: 'opacity 0.3s ease',
              pointerEvents: 'none',
            }}
          />

          {/* Label */}
          <div
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              padding: '2rem 1rem 0.75rem',
              background: 'linear-gradient(to top, rgba(0,0,0,0.75) 0%, transparent 100%)',
              opacity: hovered ? 1 : 0,
              transform: hovered ? 'translateY(0)' : 'translateY(8px)',
              transition: 'opacity 0.3s ease, transform 0.3s ease',
              pointerEvents: 'none',
            }}
          >
            <p className="text-white text-sm font-body tracking-wide">{item.label}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function GalleryGrid({
  items,
  onOpen,
}: {
  items: GalleryItem[]
  onOpen: (i: number) => void
}) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 items-start">
      {items.map((item, i) => (
        <GalleryCard key={i} item={item} index={i} onOpen={() => onOpen(i)} />
      ))}
    </div>
  )
}
