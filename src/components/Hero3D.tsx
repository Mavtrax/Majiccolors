import { Suspense, useRef, useLayoutEffect, useState, useEffect } from 'react'
import { Canvas, useFrame, useLoader } from '@react-three/fiber'
import { Text3D, Float, Bounds, useBounds, Environment, Lightformer } from '@react-three/drei'
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import { TextureLoader, SRGBColorSpace, Vector3 } from 'three'
import type { Group, Mesh } from 'three'

const FONT = '/fonts/titanone.typeface.json'

const LETTERS = ['M', 'A', 'T', 'W', 'O']

// Un screen différent par lettre. Pour changer un tag : remplace le chemin.
const TAGS = [
  "/Capture d'écran 2026-03-08 152003.png", // M
  "/Capture d'écran 2026-03-08 152015.png", // A
  "/Capture d'écran 2026-03-08 152051.png", // T
  "/Capture d'écran 2026-07-08 105203.png", // W
  "/Capture d'écran 2026-03-08 152234.png", // O
].map(encodeURI)

const GAP = 0.28 // espace entre les lettres

interface LetterProps {
  char: string
  tag: string
  meshRef: (m: Mesh | null) => void
}

function Letter({ char, tag, meshRef }: LetterProps) {
  const tex = useLoader(TextureLoader, tag)
  tex.colorSpace = SRGBColorSpace

  return (
    <Text3D
      ref={meshRef}
      font={FONT}
      size={2}
      height={0.5}
      curveSegments={10}
      bevelEnabled
      bevelThickness={0.04}
      bevelSize={0.03}
      bevelSegments={3}
    >
      {char}
      {/* material-0 = face : le tag (mat, couleurs franches, pas d'auto-glow) */}
      <meshStandardMaterial
        attach="material-0"
        map={tex}
        roughness={0.8}
        metalness={0}
        toneMapped={false}
      />
      {/* material-1 = relief : chrome / métal argent */}
      <meshStandardMaterial
        attach="material-1"
        color="#d6d6d6"
        metalness={1}
        roughness={0.18}
      />
    </Text3D>
  )
}

interface WordProps {
  reducedMotion: boolean
}

function Word({ reducedMotion }: WordProps) {
  const group = useRef<Group>(null)
  const meshes = useRef<(Mesh | null)[]>([])
  const bounds = useBounds()

  useLayoutEffect(() => {
    let x = 0
    const tmp = new Vector3()

    // 1) mesurer, remapper les UV (le tag couvre chaque lettre), positionner à la suite
    meshes.current.forEach((m) => {
      if (!m) return
      const geo = m.geometry
      geo.computeBoundingBox()
      const bb = geo.boundingBox
      if (!bb) return
      tmp.subVectors(bb.max, bb.min)

      const pos = geo.attributes.position
      const uv = geo.attributes.uv
      for (let i = 0; i < uv.count; i++) {
        uv.setXY(i, (pos.getX(i) - bb.min.x) / tmp.x, (pos.getY(i) - bb.min.y) / tmp.y)
      }
      uv.needsUpdate = true

      m.position.x = x - bb.min.x
      x += tmp.x + GAP
    })

    // 2) recentrer les lettres autour de 0 (pour une rotation propre)
    const totalW = x - GAP
    meshes.current.forEach((m) => {
      if (m) m.position.x -= totalW / 2
    })

    // 3) recadrer la caméra sur le mot complet
    bounds.refresh().clip().fit()
  }, [bounds])

  useFrame((state) => {
    if (!group.current || reducedMotion) return
    const targetY = state.pointer.x * 0.3
    const targetX = -state.pointer.y * 0.18
    group.current.rotation.y += (targetY - group.current.rotation.y) * 0.05
    group.current.rotation.x += (targetX - group.current.rotation.x) * 0.05
  })

  return (
    <group ref={group}>
      {LETTERS.map((c, i) => (
        <Letter
          key={c + i}
          char={c}
          tag={TAGS[i]}
          meshRef={(m) => {
            meshes.current[i] = m
          }}
        />
      ))}
    </group>
  )
}

export default function Hero3D() {
  const reducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches

  // Le rendu 3D ne tourne QUE quand le hero est visible et l'onglet actif.
  const wrapRef = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(true)

  useEffect(() => {
    const el = wrapRef.current
    if (!el) return
    let onScreen = true
    const sync = () => setActive(onScreen && !document.hidden)
    const io = new IntersectionObserver(
      ([e]) => { onScreen = e.isIntersecting; sync() },
      { threshold: 0.05 }
    )
    io.observe(el)
    document.addEventListener('visibilitychange', sync)
    return () => {
      io.disconnect()
      document.removeEventListener('visibilitychange', sync)
    }
  }, [])

  return (
    <div ref={wrapRef} className="w-full h-[44vh] min-h-[300px] md:h-[56vh]">
      <Canvas
        frameloop={active ? 'always' : 'never'}
        dpr={[1, 1.5]}
        camera={{ position: [0, 0, 9], fov: 42 }}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={0.85} />
        <directionalLight position={[0, 3, 6]} intensity={0.6} color="#ffffff" />

        {/* Reflets pour le chrome (procédural, aucun fichier externe) */}
        <Environment resolution={128} frames={1}>
          <Lightformer intensity={1.4} position={[0, 2, 4]} scale={[7, 3, 1]} color="#ffffff" />
          <Lightformer intensity={1.6} position={[-5, 1, 2]} scale={[3, 4, 1]} color="#00d4ff" />
          <Lightformer intensity={1.6} position={[5, -1, 2]} scale={[3, 4, 1]} color="#ff2d78" />
          <Lightformer intensity={1.1} position={[0, -3, 2]} scale={[7, 2, 1]} color="#ff6b00" />
        </Environment>

        <Suspense fallback={null}>
          <Bounds fit clip observe margin={0.5}>
            <Float
              speed={reducedMotion ? 0 : 1.4}
              rotationIntensity={reducedMotion ? 0 : 0.12}
              floatIntensity={reducedMotion ? 0 : 0.4}
            >
              <Word reducedMotion={reducedMotion} />
            </Float>
          </Bounds>
        </Suspense>

        {/* Halo néon */}
        <EffectComposer>
          <Bloom
            intensity={0.6}
            luminanceThreshold={0.85}
            luminanceSmoothing={0.4}
            radius={0.5}
            mipmapBlur
          />
        </EffectComposer>
      </Canvas>
    </div>
  )
}
