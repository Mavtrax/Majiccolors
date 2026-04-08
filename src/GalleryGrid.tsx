import { useEffect, useRef, useState, useMemo } from 'react'

// ─── Constants ─────────────────────────────────────────────────────────────────
const N_ITEMS    = 9
const V_STEP     = 420                       // décalage vertical entre chaque image
const PAD_TOP    = 60
const TOTAL_H    = PAD_TOP + N_ITEMS * V_STEP + 100

const SVG_W      = 480
const CX         = SVG_W / 2
const AMPLITUDE  = 300
const N_SPHERES  = 52
const TURNS      = 4.5
const SCROLL_F   = 0.002
const AUTO_SPEED = 0.004

const CARD_W     = 560
const CARD_H     = 400

// Distance horizontale depuis le bord (alternée)
// pattern par index : far-left, close-right, close-left, far-right, far-left, close-right...
const H_POSITIONS = [
  { side: 'left',  left: '2%',                          right: undefined },         // 0 far-left
  { side: 'right', left: undefined,                     right: '2%'      },         // 1 far-right
  { side: 'left',  left: '18%',                         right: undefined },         // 2 close-left
  { side: 'right', left: undefined,                     right: '18%'     },         // 3 close-right
] as const


const COLOR_A = '#22D3EE'   // cyan
const COLOR_B = '#A855F7'   // violet
const COLOR_R = '#F97316'   // orange barreaux
const SPHERE_COLORS = [COLOR_A, COLOR_B, COLOR_R]

// ─── Particules étoiles (générées une seule fois) ────────────────────────────────
const STAR_COLORS = ['#A855F7', '#F97316', '#EAB308', '#22C55E']
// Les étoiles utilisent des coordonnées SVG absolues.
// Le SVG est centré (CX = 240). Pour couvrir ~1600px de large :
// x va de -800 à +1040 (soit CX ± 900px environ)
const STAR_SPREAD = 900   // px de chaque côté du centre SVG
const STARS = Array.from({ length: 55 }, (_, i) => {
  const a = i * 137.508
  const b = i * 97.3 + 13.7
  return {
    x:        CX + (Math.sin(a) * 2 - 1) * STAR_SPREAD,   // -900 → +900 autour du centre
    yPct:     (Math.cos(b) * 0.5 + 0.5),
    r:        1.2 + (i % 4) * 0.7,
    color:    STAR_COLORS[i % 4],
    duration: 1.5 + (i % 7) * 0.4,
    delay:    (i * 0.31) % 4,
  }
})

// ─── Hélice ──────────────────────────────────────────────────────────────────────
interface SphereData { xA: number; xB: number; y: number; sinVal: number }

function buildData(phase: number): SphereData[] {
  return Array.from({ length: N_SPHERES }, (_, i) => {
    const prog   = i / (N_SPHERES - 1)
    const t      = prog * TURNS * 2 * Math.PI
    const y      = prog * TOTAL_H
    const sinVal = Math.sin(t + phase)
    return { xA: CX + AMPLITUDE * sinVal, xB: CX + AMPLITUDE * Math.sin(t + phase + Math.PI), y, sinVal }
  })
}

// Y de l'image i
function imageY(i: number) { return PAD_TOP + i * V_STEP + CARD_H / 2 }

// ─── Couleur carte ────────────────────────────────────────────────────────────────
function lerpHex(a: string, b: string, t: number): string {
  const p = (h: string, s: number) => parseInt(h.slice(s, s + 2), 16)
  return `rgb(${Math.round(p(a,1)+(p(b,1)-p(a,1))*t)},${Math.round(p(a,3)+(p(b,3)-p(a,3))*t)},${Math.round(p(a,5)+(p(b,5)-p(a,5))*t)})`
}
function cardColor(i: number): string {
  const t = i / Math.max(N_ITEMS - 1, 1)
  if (t < 0.5) return lerpHex('#3B82F6', '#8B5CF6', t * 2)
  return lerpHex('#8B5CF6', '#F97316', (t - 0.5) * 2)
}

// ─── Gradients sphère 3D ─────────────────────────────────────────────────────────

// ─── Types ────────────────────────────────────────────────────────────────────────
interface GalleryItem { src: string; label: string }
interface Props       { items: GalleryItem[]; onOpen: (i: number) => void }

// ─── Composant ────────────────────────────────────────────────────────────────────
export default function GalleryGrid({ items, onOpen }: Props) {
  const [phase,      setPhase     ] = useState(0)
  const [visible,    setVisible   ] = useState<boolean[]>(() => new Array(items.length).fill(false))
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null)
  const cardRefs  = useRef<(HTMLDivElement | null)[]>([])
  const autoPhase = useRef(0)
  const scrollOff = useRef(0)

  useEffect(() => {
    let rafId: number
    const loop = () => {
      autoPhase.current += AUTO_SPEED
      setPhase(autoPhase.current + scrollOff.current)
      rafId = requestAnimationFrame(loop)
    }
    rafId = requestAnimationFrame(loop)
    const onScroll = () => { scrollOff.current = window.scrollY * SCROLL_F }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => { cancelAnimationFrame(rafId); window.removeEventListener('scroll', onScroll) }
  }, [])

  useEffect(() => {
    const obs: IntersectionObserver[] = []
    cardRefs.current.forEach((el, i) => {
      if (!el) return
      const o = new IntersectionObserver(([e]) => {
        if (e.isIntersecting) { setVisible(p => { const n=[...p]; n[i]=true; return n }); o.disconnect() }
      }, { threshold: 0.08 })
      o.observe(el); obs.push(o)
    })
    return () => obs.forEach(o => o.disconnect())
  }, [items.length])

  const data = useMemo(() => buildData(phase), [phase])



  return (
    <div className="relative" style={{ height: TOTAL_H, width: '100%' }}>

      {/* ── SVG hélice ── */}
      <svg
        width={SVG_W} height={TOTAL_H} overflow="visible"
        style={{ position: 'absolute', left: '50%', top: 0, transform: 'translateX(-50%)', pointerEvents: 'none', zIndex: 0 }}
      >
        {/* ── Étoiles clignotantes ── */}
        {STARS.map((s, i) => (
          <circle
            key={`star-${i}`}
            cx={s.x}
            cy={s.yPct * TOTAL_H}
            r={s.r}
            fill={s.color}
            style={{
              animation: `twinkle ${s.duration}s ease-in-out ${s.delay}s infinite`,
              transformOrigin: `${s.x}px ${s.yPct * TOTAL_H}px`,
            }}
          />
        ))}

        <defs>
          {/* Glow large brin A (cyan) */}
          <filter id="glow-a" x="-150%" y="-5%" width="400%" height="110%">
            <feGaussianBlur stdDeviation="8" result="b1"/>
            <feGaussianBlur stdDeviation="3" result="b2" in="SourceGraphic"/>
            <feMerge><feMergeNode in="b1"/><feMergeNode in="b2"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
          {/* Glow large brin B (violet) */}
          <filter id="glow-b" x="-150%" y="-5%" width="400%" height="110%">
            <feGaussianBlur stdDeviation="8" result="b1"/>
            <feGaussianBlur stdDeviation="3" result="b2" in="SourceGraphic"/>
            <feMerge><feMergeNode in="b1"/><feMergeNode in="b2"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
          {/* Glow barreaux (orange) */}
          <filter id="glow-r" x="-80%" y="-300%" width="260%" height="700%">
            <feGaussianBlur stdDeviation="4" result="b"/>
            <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
          {/* Halo très large (ambiance) */}
          <filter id="halo" x="-300%" y="-5%" width="700%" height="110%">
            <feGaussianBlur stdDeviation="18"/>
          </filter>
          {/* Glow point intersection */}
          <filter id="glow-dot" x="-300%" y="-300%" width="700%" height="700%">
            <feGaussianBlur stdDeviation="5" result="b"/>
            <feMerge><feMergeNode in="b"/><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
        </defs>

        {/* ── Halos ambiants (couche la plus basse) ── */}
        {data.slice(0, -1).map((d, i) => {
          const n = data[i + 1]
          return (
            <g key={`halo-${i}`}>
              <line x1={d.xA} y1={d.y} x2={n.xA} y2={n.y} stroke={COLOR_A} strokeWidth="18" strokeLinecap="round" opacity="0.07" filter="url(#halo)"/>
              <line x1={d.xB} y1={d.y} x2={n.xB} y2={n.y} stroke={COLOR_B} strokeWidth="18" strokeLinecap="round" opacity="0.07" filter="url(#halo)"/>
            </g>
          )
        })}

        {/* ── Barreaux transversaux néon (orange) — rendus avant les brins ── */}
        {data.map((d, i) => {
          const front = d.sinVal > 0
          return (
            <g key={`rg-${i}`} opacity={front ? 1 : 0.3} filter="url(#glow-r)">
              {/* Glow large */}
              <line x1={d.xA} y1={d.y} x2={d.xB} y2={d.y} stroke={COLOR_R} strokeWidth="6" strokeLinecap="round" strokeOpacity="0.35"/>
              {/* Core */}
              <line x1={d.xA} y1={d.y} x2={d.xB} y2={d.y} stroke={COLOR_R} strokeWidth="2" strokeLinecap="round"/>
              {/* Reflet blanc centre */}
              <line x1={(d.xA+d.xB)/2-8} y1={d.y} x2={(d.xA+d.xB)/2+8} y2={d.y} stroke="white" strokeWidth="0.8" strokeLinecap="round" strokeOpacity="0.6"/>
            </g>
          )
        })}

        {/* ── Brin B (violet) — derrière ── */}
        {data.slice(0, -1).map((d, i) => {
          const n  = data[i + 1]
          const dB = -(d.sinVal + n.sinVal) / 2
          const op = dB > 0 ? 1 : 0.25
          return (
            <g key={`bB-${i}`} opacity={op} filter="url(#glow-b)">
              <line x1={d.xB} y1={d.y} x2={n.xB} y2={n.y} stroke={COLOR_B} strokeWidth="8"  strokeLinecap="round" strokeOpacity="0.3"/>
              <line x1={d.xB} y1={d.y} x2={n.xB} y2={n.y} stroke={COLOR_B} strokeWidth="3"  strokeLinecap="round"/>
              <line x1={d.xB} y1={d.y} x2={n.xB} y2={n.y} stroke="white"   strokeWidth="0.8" strokeLinecap="round" strokeOpacity="0.4"/>
            </g>
          )
        })}

        {/* ── Brin A (cyan) — devant ── */}
        {data.slice(0, -1).map((d, i) => {
          const n  = data[i + 1]
          const dA = (d.sinVal + n.sinVal) / 2
          const op = dA > 0 ? 1 : 0.25
          return (
            <g key={`bA-${i}`} opacity={op} filter="url(#glow-a)">
              <line x1={d.xA} y1={d.y} x2={n.xA} y2={n.y} stroke={COLOR_A} strokeWidth="8"  strokeLinecap="round" strokeOpacity="0.3"/>
              <line x1={d.xA} y1={d.y} x2={n.xA} y2={n.y} stroke={COLOR_A} strokeWidth="3"  strokeLinecap="round"/>
              <line x1={d.xA} y1={d.y} x2={n.xA} y2={n.y} stroke="white"   strokeWidth="0.8" strokeLinecap="round" strokeOpacity="0.5"/>
            </g>
          )
        })}

        {/* ── Points lumineux aux nœuds ── */}
        {data.map((d, i) => (
          <g key={`dot-${i}`} filter="url(#glow-dot)">
            <circle cx={d.xA} cy={d.y} r="5" fill={COLOR_A} opacity={d.sinVal > 0 ? 1 : 0.3}/>
            <circle cx={d.xA} cy={d.y} r="2.5" fill="white"  opacity={d.sinVal > 0 ? 0.9 : 0.2}/>
            <circle cx={d.xB} cy={d.y} r="5" fill={COLOR_B} opacity={d.sinVal <= 0 ? 1 : 0.3}/>
            <circle cx={d.xB} cy={d.y} r="2.5" fill="white"  opacity={d.sinVal <= 0 ? 0.9 : 0.2}/>
          </g>
        ))}

        {/* Lignes connexion vers chaque image */}
        {Array.from({ length: N_ITEMS }, (_, i) => {
          const y     = imageY(i)
          const color = SPHERE_COLORS[i % 3]
          const pos   = H_POSITIONS[i % 4]
          const x2    = pos.side === 'left' ? -700 : SVG_W + 700
          return (
            <line key={`conn-${i}`}
              x1={CX} y1={y} x2={x2} y2={y}
              stroke={color} strokeWidth="1" strokeOpacity="0.2"
              strokeDasharray="6 6" strokeLinecap="round" />
          )
        })}
      </svg>

      {/* ── Cartes images alternées ── */}
      {items.map((item, i) => {
        const pos     = H_POSITIONS[i % 4]
        const isLeft  = pos.side === 'left'
        const y       = imageY(i)
        const top     = y - CARD_H / 2
        const color   = cardColor(i)
        const isHov   = hoveredIdx === i
        const entered = visible[i]

        return (
          <div
            key={i}
            ref={el => { cardRefs.current[i] = el }}
            onClick={() => onOpen(i)}
            onMouseEnter={() => setHoveredIdx(i)}
            onMouseLeave={() => setHoveredIdx(null)}
            style={{
              position: 'absolute',
              top,
              left:  pos.left,
              right: pos.right,
              width:  CARD_W,
              height: CARD_H,
              opacity: entered ? 1 : 0,
              transform: !entered
                ? `translateX(${isLeft ? -50 : 50}px) scale(0.9)`
                : isHov ? 'scale(1.85)' : undefined,
              animation: entered && !isHov
                ? `levitate ${3.5 + (i % 5) * 0.35}s ease-in-out ${i * 0.25}s infinite`
                : 'none',
              transition: !entered
                ? `opacity 0.8s ease ${i * 80}ms, transform 0.5s cubic-bezier(0.16,1,0.3,1)`
                : isHov
                  ? 'transform 0.4s cubic-bezier(0.34,1.4,0.64,1), box-shadow 0.3s ease'
                  : 'transform 0.4s ease, box-shadow 0.3s ease',
              zIndex:       isHov ? 50 : 2,
              cursor:       'pointer',
              borderRadius: 12,
              overflow:     'hidden',
              boxShadow:    isHov
                ? `0 0 32px 8px ${color}55, 0 20px 60px rgba(0,0,0,0.9), inset 0 0 0 1px ${color}80`
                : `0 8px 32px rgba(0,0,0,0.65), inset 0 0 0 1px rgba(255,255,255,0.07)`,
              transformOrigin: isLeft ? 'left center' : 'right center',
            }}
          >
            {item.src
              ? <img src={item.src} alt={item.label} loading="lazy" className="w-full h-full object-cover" />
              : <div className="w-full h-full" style={{ background: `linear-gradient(135deg, ${color}, #0a0a1a)` }} />
            }
            <div className="absolute bottom-0 left-0 right-0 px-3 py-2 pointer-events-none"
              style={{ opacity: isHov ? 1 : 0, transition: 'opacity 0.25s', background: 'linear-gradient(to top, rgba(0,0,0,0.85), transparent)' }}>
              <p className="text-white text-xs font-medium tracking-wide">{item.label}</p>
            </div>
          </div>
        )
      })}
    </div>
  )
}
