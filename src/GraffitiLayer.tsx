import { useEffect, useRef } from 'react'

const isTouchDevice = () =>
  typeof window !== 'undefined' &&
  (navigator.maxTouchPoints > 0 || 'ontouchstart' in window)

const ELEMENTS = [
  { id: 'crown',    in: 0.0,  out: 0.22 },
  { id: 'eagle',    in: 0.05, out: 0.27 },
  { id: 'arrow',    in: 0.15, out: 0.37 },
  { id: 'street',   in: 0.25, out: 0.47 },
  { id: 'mountain', in: 0.35, out: 0.57 },
  { id: 'art',      in: 0.45, out: 0.67 },
  { id: 'sunset',   in: 0.55, out: 0.77 },
  { id: 'majic',    in: 0.65, out: 0.87 },
  { id: 'colors',   in: 0.75, out: 0.95 },
  { id: 'n64',      in: 0.82, out: 1.00 },
]

export default function GraffitiLayer() {
  const isTouch = isTouchDevice()

  if (isTouch) return <GraffitiMobile />

  return <GraffitiDesktop />
}

function GraffitiDesktop() {
  const svgRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    const svg = svgRef.current
    if (!svg) return

    const paths = svg.querySelectorAll<SVGGeometryElement>('path[data-id]')
    paths.forEach(el => {
      const len = el.getTotalLength()
      el.style.setProperty('--path-len', String(len))
      el.style.strokeDasharray = String(len)
      el.style.strokeDashoffset = String(len)
    })

    const texts = svg.querySelectorAll<SVGTextElement>('text[data-id]')
    texts.forEach(el => {
      el.style.strokeDasharray = '3000'
      el.style.strokeDashoffset = '3000'
    })

    const drawn = new Set<string>()
    const erased = new Set<string>()

    const onScroll = () => {
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight
      const progress = maxScroll > 0 ? window.scrollY / maxScroll : 0

      ELEMENTS.forEach(({ id, in: trigIn, out: trigOut }) => {
        const el = svg.querySelector(`[data-id="${id}"]`) as SVGElement | null
        if (!el) return

        if (!drawn.has(id) && progress >= trigIn) {
          drawn.add(id)
          el.classList.add('graffiti-drawn')
        } else if (drawn.has(id) && !erased.has(id) && progress >= trigOut) {
          erased.add(id)
          el.classList.add('graffiti-erase')
        }
      })
    }

    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <svg
      ref={svgRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 5,
        overflow: 'visible',
      }}
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      {/* Crown — haut gauche */}
      <path
        data-id="crown"
        d="M 8,28 L 8,10 L 14,18 L 20,5 L 26,18 L 32,10 L 32,28 Z"
        fill="none"
        stroke="#f5c400"
        strokeWidth="0.35"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="graffiti-path"
        transform="translate(5, 12) rotate(-10)"
      />

      {/* Eagle — haut droit */}
      <path
        data-id="eagle"
        d="M 0,15 Q 10,2 22,10 Q 34,2 44,15 M 20,9 Q 22,20 24,9"
        fill="none"
        stroke="#b44fff"
        strokeWidth="0.35"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="graffiti-path"
        transform="translate(70, 5) rotate(6) scale(1.1)"
      />

      {/* Arrow — droite milieu */}
      <path
        data-id="arrow"
        d="M 0,8 L 30,8 M 22,2 L 32,8 L 22,14"
        fill="none"
        stroke="#ff2d78"
        strokeWidth="0.35"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="graffiti-path"
        transform="translate(78, 38) rotate(15)"
      />

      {/* Mountain — centre droit */}
      <path
        data-id="mountain"
        d="M 0,30 L 15,8 L 26,17 L 42,0 L 58,22 L 70,30"
        fill="none"
        stroke="#00d4ff"
        strokeWidth="0.35"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="graffiti-path"
        transform="translate(55, 48) rotate(-4) scale(0.7)"
      />

      {/* Sunset — bas gauche */}
      <path
        data-id="sunset"
        d="M 0,28 A 28,28 0 0 1 56,28 M 6,17 L 1,11 M 28,5 L 28,0 M 50,17 L 55,11 M 15,9 L 11,4 M 41,9 L 45,4"
        fill="none"
        stroke="#ff6b00"
        strokeWidth="0.35"
        strokeLinecap="round"
        className="graffiti-path"
        transform="translate(3, 62) rotate(4) scale(0.8)"
      />

      {/* STREET — gauche milieu */}
      <text
        data-id="street"
        x="4"
        y="46"
        fontFamily="'Bangers', cursive"
        fontSize="4.5"
        fill="none"
        stroke="#39ff14"
        strokeWidth="0.15"
        className="graffiti-text"
        transform="rotate(-14, 4, 46)"
      >
        STREET
      </text>

      {/* ART — bas droit */}
      <text
        data-id="art"
        x="72"
        y="72"
        fontFamily="'Bangers', cursive"
        fontSize="6"
        fill="none"
        stroke="#ff6b00"
        strokeWidth="0.15"
        className="graffiti-text"
        transform="rotate(9, 72, 72)"
      >
        ART
      </text>

      {/* MAJIC — bas gauche */}
      <text
        data-id="majic"
        x="3"
        y="78"
        fontFamily="'Bangers', cursive"
        fontSize="4"
        fill="none"
        stroke="#1e90ff"
        strokeWidth="0.15"
        className="graffiti-text"
        transform="rotate(-7, 3, 78)"
      >
        MAJIC
      </text>

      {/* 64 — droite milieu-bas */}
      <text
        data-id="n64"
        x="80"
        y="58"
        fontFamily="'Bangers', cursive"
        fontSize="8"
        fill="none"
        stroke="#b44fff"
        strokeWidth="0.35"
        className="graffiti-text"
        transform="rotate(12, 80, 58)"
      >
        64
      </text>

      {/* COLORS — bas centre */}
      <text
        data-id="colors"
        x="28"
        y="88"
        fontFamily="'Bangers', cursive"
        fontSize="5.5"
        fill="none"
        stroke="#00d4ff"
        strokeWidth="0.15"
        className="graffiti-text"
        transform="rotate(-5, 28, 88)"
      >
        COLORS
      </text>
    </svg>
  )
}

function GraffitiMobile() {
  const svgRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    const svg = svgRef.current
    if (!svg) return

    const paths = svg.querySelectorAll<SVGGeometryElement>('path[data-id]')
    paths.forEach(el => {
      const len = el.getTotalLength()
      el.style.strokeDasharray = String(len)
      el.style.strokeDashoffset = String(len)
      setTimeout(() => el.classList.add('graffiti-drawn'), 600)
    })

    const texts = svg.querySelectorAll<SVGTextElement>('text[data-id]')
    texts.forEach(el => {
      el.style.strokeDasharray = '1500'
      el.style.strokeDashoffset = '1500'
      setTimeout(() => el.classList.add('graffiti-drawn'), 800)
    })
  }, [])

  return (
    <svg
      ref={svgRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 5,
        overflow: 'visible',
      }}
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <path
        data-id="crown"
        d="M 8,28 L 8,10 L 14,18 L 20,5 L 26,18 L 32,10 L 32,28 Z"
        fill="none"
        stroke="#f5c400"
        strokeWidth="0.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="graffiti-path"
        transform="translate(3, 8) rotate(-10)"
      />
      <path
        data-id="arrow"
        d="M 0,8 L 30,8 M 22,2 L 32,8 L 22,14"
        fill="none"
        stroke="#ff2d78"
        strokeWidth="0.8"
        strokeLinecap="round"
        className="graffiti-path"
        transform="translate(68, 12) rotate(10)"
      />
      <text
        data-id="street"
        x="4"
        y="85"
        fontFamily="'Bangers', cursive"
        fontSize="5"
        fill="none"
        stroke="#39ff14"
        strokeWidth="0.15"
        className="graffiti-text"
        transform="rotate(-12, 4, 85)"
      >
        STREET
      </text>
    </svg>
  )
}
