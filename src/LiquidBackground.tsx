import { useEffect, useRef } from 'react'

export default function LiquidBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resize = () => {
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
    }
    resize()
    window.addEventListener('resize', resize)

    const isTouch = navigator.maxTouchPoints > 0 || 'ontouchstart' in window

    const allBlobs = [
      { cx: 0.35, cy: 0.4,  r: 0.38, color: '#ff6b00', ax: 0.28, ay: 0.22, fx: 0.07,  fy: 0.05,  phase: 0    },
      { cx: 0.65, cy: 0.55, r: 0.34, color: '#00d4ff', ax: 0.25, ay: 0.28, fx: 0.05,  fy: 0.08,  phase: 1.2  },
      { cx: 0.5,  cy: 0.25, r: 0.30, color: '#ff2d78', ax: 0.22, ay: 0.20, fx: 0.09,  fy: 0.06,  phase: 2.4  },
      { cx: 0.25, cy: 0.65, r: 0.28, color: '#b44fff', ax: 0.20, ay: 0.25, fx: 0.06,  fy: 0.09,  phase: 3.6  },
      { cx: 0.75, cy: 0.3,  r: 0.25, color: '#f5c400', ax: 0.18, ay: 0.22, fx: 0.08,  fy: 0.07,  phase: 4.8  },
      { cx: 0.55, cy: 0.7,  r: 0.32, color: '#1e90ff', ax: 0.26, ay: 0.20, fx: 0.055, fy: 0.075, phase: 0.8  },
      { cx: 0.2,  cy: 0.45, r: 0.27, color: '#39ff14', ax: 0.22, ay: 0.26, fx: 0.075, fy: 0.055, phase: 2.0  },
    ]
    const blobs = isTouch ? allBlobs.slice(0, 3) : allBlobs

    let animId: number
    let t = 0
    let frameCount = 0
    let paused = false

    // Pause quand l'onglet est caché
    const onVisibility = () => { paused = document.hidden }
    document.addEventListener('visibilitychange', onVisibility)

    const draw = () => {
      animId = requestAnimationFrame(draw)
      if (paused) return

      // 30fps — on saute 1 frame sur 2
      frameCount++
      if (frameCount % 2 !== 0) return

      const w = canvas.width
      const h = canvas.height

      ctx.clearRect(0, 0, w, h)

      blobs.forEach(b => {
        const x = (b.cx + Math.sin(t * b.fx + b.phase) * b.ax + Math.sin(t * b.fx * 1.7 + b.phase + 1) * b.ax * 0.3) * w
        const y = (b.cy + Math.cos(t * b.fy + b.phase) * b.ay + Math.cos(t * b.fy * 2.1 + b.phase + 2) * b.ay * 0.25) * h
        const r = (b.r + Math.sin(t * 0.04 + b.phase) * 0.04) * Math.min(w, h)

        const grad = ctx.createRadialGradient(x, y, 0, x, y, r)
        grad.addColorStop(0,    b.color + 'dd')
        grad.addColorStop(0.4,  b.color + '88')
        grad.addColorStop(0.75, b.color + '33')
        grad.addColorStop(1,    b.color + '00')

        ctx.beginPath()
        ctx.arc(x, y, r, 0, Math.PI * 2)
        ctx.fillStyle = grad
        ctx.fill()
      })

      t += 0.036
    }

    draw()

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', resize)
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{ filter: 'blur(45px) saturate(1.6)', opacity: 0.65 }}
      aria-hidden="true"
    />
  )
}
