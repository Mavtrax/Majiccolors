import { useEffect, useRef } from 'react'

const COLORS = ['#ff6b00', '#00d4ff', '#ff2d78', '#b44fff', '#f5c400', '#1e90ff', '#39ff14']
const MAX_PARTICLES = 300

const isTouchDevice = () =>
  typeof window !== 'undefined' &&
  (navigator.maxTouchPoints > 0 || 'ontouchstart' in window)

interface Particle {
  x: number; y: number
  vx: number; vy: number
  r: number; alpha: number
  color: string; decay: number
}

export default function SprayCursor() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const isTouch = isTouchDevice()

  useEffect(() => {
    if (isTouch) return
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')!

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    const particles: Particle[] = []
    let colorIdx = 0
    let moveCount = 0
    let paused = false

    // Pause quand l'onglet est caché
    const onVisibility = () => { paused = document.hidden }
    document.addEventListener('visibilitychange', onVisibility)

    const onMove = (e: MouseEvent) => {
      moveCount++
      if (moveCount % 2 !== 0) return

      const color = COLORS[Math.floor(colorIdx / 8) % COLORS.length]
      colorIdx++

      const count = 5 + Math.floor(Math.random() * 4)
      for (let i = 0; i < count; i++) {
        if (particles.length >= MAX_PARTICLES) break
        const angle = Math.random() * Math.PI * 2
        const speed = Math.random() * 2.5 + 0.3
        particles.push({
          x: e.clientX + (Math.random() - 0.5) * 10,
          y: e.clientY + (Math.random() - 0.5) * 10,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 0.5,
          r: Math.random() * 2.8 + 0.4,
          alpha: 0.6 + Math.random() * 0.4,
          color,
          decay: 0.025 + Math.random() * 0.02,
        })
      }
    }
    window.addEventListener('mousemove', onMove)

    let rafId: number
    const tick = () => {
      if (!paused) {
        ctx.clearRect(0, 0, canvas.width, canvas.height)

        for (let i = particles.length - 1; i >= 0; i--) {
          const p = particles[i]
          p.x += p.vx
          p.y += p.vy
          p.vy += 0.06
          p.vx *= 0.98
          p.alpha -= p.decay

          if (p.alpha <= 0) { particles.splice(i, 1); continue }

          const hex = Math.floor(p.alpha * 255).toString(16).padStart(2, '0')
          ctx.beginPath()
          ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
          ctx.fillStyle = p.color + hex
          ctx.fill()
        }
      }

      rafId = requestAnimationFrame(tick)
    }
    tick()

    return () => {
      cancelAnimationFrame(rafId)
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', onMove)
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [isTouch])

  if (isTouch) return null

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed', top: 0, left: 0,
        width: '100%', height: '100%',
        pointerEvents: 'none', zIndex: 9,
      }}
      aria-hidden="true"
    />
  )
}
