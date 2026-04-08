import { useEffect, useRef } from 'react'

/**
 * Simulation d'eau height-field (algorithme classique).
 * Le canvas tourne à 1/3 de la résolution écran pour la perf,
 * puis est upscalé en CSS (interpolation bilinéaire = rendu doux).
 */
export default function WaterRipple() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')!

    const SCALE = 3          // résolution simulation = 1/3 de l'écran
    const DAMPING = 0.984    // amortissement des ondes
    let W = 0, H = 0
    let cur: Float32Array
    let prev: Float32Array
    let imgData: ImageData

    const resize = () => {
      W = Math.ceil(window.innerWidth / SCALE)
      H = Math.ceil(window.innerHeight / SCALE)
      canvas.width = W
      canvas.height = H
      cur = new Float32Array(W * H)
      prev = new Float32Array(W * H)
      imgData = ctx.createImageData(W, H)
    }
    resize()
    window.addEventListener('resize', resize)

    // Crée une goutte à la position écran (sx, sy)
    const splash = (sx: number, sy: number, radius: number, amp: number) => {
      const cx = (sx / window.innerWidth * W) | 0
      const cy = (sy / window.innerHeight * H) | 0
      for (let dy = -radius; dy <= radius; dy++) {
        for (let dx = -radius; dx <= radius; dx++) {
          if (dx * dx + dy * dy > radius * radius) continue
          const nx = cx + dx, ny = cy + dy
          if (nx > 0 && nx < W - 1 && ny > 0 && ny < H - 1) {
            cur[ny * W + nx] -= amp
          }
        }
      }
    }

    // Suivi souris
    let mx = -1, my = -1
    const onMove = (e: MouseEvent) => {
      const dx = e.clientX - mx
      const dy = e.clientY - my
      const speed = Math.sqrt(dx * dx + dy * dy)
      if (speed > 2) {
        splash(e.clientX, e.clientY, 2, Math.min(speed * 20, 400))
      }
      mx = e.clientX
      my = e.clientY
    }
    window.addEventListener('mousemove', onMove)

    let rafId: number

    const tick = () => {
      const d = imgData.data

      // ── Simulation ───────────────────────────────────────
      for (let y = 1; y < H - 1; y++) {
        for (let x = 1; x < W - 1; x++) {
          const i = y * W + x
          const v =
            (cur[(y - 1) * W + x] +
              cur[(y + 1) * W + x] +
              cur[y * W + x - 1] +
              cur[y * W + x + 1]) *
              0.5 -
            prev[i]
          prev[i] = v * DAMPING
        }
      }
      // swap buffers
      const tmp = cur; cur = prev; prev = tmp

      // ── Rendu — gradient = "reflets" eau ─────────────────
      for (let y = 1; y < H - 1; y++) {
        for (let x = 1; x < W - 1; x++) {
          const i = y * W + x
          // gradient de hauteur = normale de surface
          const gx = cur[y * W + x + 1] - cur[y * W + x - 1]
          const gy = cur[(y + 1) * W + x] - cur[(y - 1) * W + x]
          const mag = Math.sqrt(gx * gx + gy * gy)

          const p = i * 4
          // Teinte eau — légèrement bleutée/cyan avec variation selon gx
          d[p]     = 140 + gx * 0.4   // R
          d[p + 1] = 200               // G
          d[p + 2] = 255               // B
          d[p + 3] = Math.min(mag * 1.4, 200)  // alpha = intensité onde
        }
      }

      ctx.putImageData(imgData, 0, 0)
      rafId = requestAnimationFrame(tick)
    }
    tick()

    return () => {
      cancelAnimationFrame(rafId)
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', onMove)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 8,
        mixBlendMode: 'screen',   // s'additionne au fond sombre
        opacity: 0.25,
      }}
      aria-hidden="true"
    />
  )
}
