# GraffitiLayer Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Ajouter une couche SVG graffiti full-page sur Majic Colors — mots et formes qui se dessinent au scroll via stroke-dashoffset.

**Architecture:** SVG `position: fixed` couvrant le viewport (z-index 5). Les éléments se révèlent en fonction du scroll progress (scrollY / maxScroll), chacun ayant un seuil de déclenchement entre 0 et 1. Animation via stroke-dashoffset CSS transition. Mobile : 5 éléments max.

**Tech Stack:** React, TypeScript, SVG, CSS transitions, scroll event listener

---

### Task 1 : GraffitiLayer.tsx — structure de base + scroll reveal

**Files:**
- Create: `src/GraffitiLayer.tsx`

**Step 1 : Créer le composant avec le mécanisme de scroll**

```tsx
import { useEffect, useRef } from 'react'

const isTouchDevice = () =>
  typeof window !== 'undefined' &&
  (navigator.maxTouchPoints > 0 || 'ontouchstart' in window)

// Seuils de déclenchement (0 = début page, 1 = bas de page)
const TRIGGERS: Record<string, number> = {
  crown:    0.0,
  eagle:    0.05,
  arrow:    0.15,
  street:   0.25,
  mountain: 0.35,
  art:      0.45,
  sunset:   0.55,
  majic:    0.65,
  colors:   0.75,
  n64:      0.82,
}

export default function GraffitiLayer() {
  const svgRef = useRef<SVGSVGElement>(null)
  const isTouch = isTouchDevice()

  useEffect(() => {
    const svg = svgRef.current
    if (!svg) return

    // Init stroke-dashoffset sur les paths géométriques
    const paths = svg.querySelectorAll<SVGGeometryElement>('path[data-id], polyline[data-id]')
    paths.forEach(el => {
      const len = el.getTotalLength()
      el.style.strokeDasharray = String(len)
      el.style.strokeDashoffset = String(len)
    })

    // SVG <text> : valeur fixe grande (getTotalLength non dispo sur text)
    const texts = svg.querySelectorAll<SVGTextElement>('text[data-id]')
    texts.forEach(el => {
      el.style.strokeDasharray = '3000'
      el.style.strokeDashoffset = '3000'
    })

    const revealed = new Set<string>()

    const onScroll = () => {
      const scrolled = window.scrollY
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight
      const progress = maxScroll > 0 ? scrolled / maxScroll : 0

      Object.entries(TRIGGERS).forEach(([id, threshold]) => {
        if (!revealed.has(id) && progress >= threshold) {
          revealed.add(id)
          const el = svg.querySelector(`[data-id="${id}"]`) as SVGElement | null
          if (el) el.classList.add('graffiti-drawn')
        }
      })
    }

    // Déclencher immédiatement pour les éléments visibles au chargement
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  if (isTouch) {
    // Version mobile allégée — rendu séparé
    return <GraffitiMobile />
  }

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
      {/* Shapes */}
      {/* Crown */}
      <path
        data-id="crown"
        d="M 8,28 L 8,10 L 14,18 L 20,5 L 26,18 L 32,10 L 32,28 Z"
        fill="none"
        stroke="#f5c400"
        strokeWidth="0.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="graffiti-path"
        transform="translate(5, 12) rotate(-10)"
      />

      {/* Eagle */}
      <path
        data-id="eagle"
        d="M 0,15 Q 10,2 22,10 Q 34,2 44,15 M 20,9 Q 22,20 24,9"
        fill="none"
        stroke="#b44fff"
        strokeWidth="0.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="graffiti-path"
        transform="translate(70, 5) rotate(6) scale(1.1)"
      />

      {/* Arrow */}
      <path
        data-id="arrow"
        d="M 0,8 L 30,8 M 22,2 L 32,8 L 22,14"
        fill="none"
        stroke="#ff2d78"
        strokeWidth="0.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="graffiti-path"
        transform="translate(78, 38) rotate(15)"
      />

      {/* Mountain */}
      <path
        data-id="mountain"
        d="M 0,30 L 15,8 L 26,17 L 42,0 L 58,22 L 70,30"
        fill="none"
        stroke="#00d4ff"
        strokeWidth="0.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="graffiti-path"
        transform="translate(55, 48) rotate(-4) scale(0.7)"
      />

      {/* Sunset */}
      <path
        data-id="sunset"
        d="M 0,28 A 28,28 0 0 1 56,28 M 6,17 L 1,11 M 28,5 L 28,0 M 50,17 L 55,11 M 15,9 L 11,4 M 41,9 L 45,4"
        fill="none"
        stroke="#ff6b00"
        strokeWidth="0.6"
        strokeLinecap="round"
        className="graffiti-path"
        transform="translate(3, 62) rotate(4) scale(0.8)"
      />

      {/* Words */}
      <text
        data-id="street"
        x="4"
        y="46"
        fontFamily="'Bebas Neue', sans-serif"
        fontSize="4.5"
        fill="none"
        stroke="#39ff14"
        strokeWidth="0.25"
        className="graffiti-text"
        transform="rotate(-14, 4, 46)"
      >
        STREET
      </text>

      <text
        data-id="art"
        x="72"
        y="72"
        fontFamily="'Bebas Neue', sans-serif"
        fontSize="6"
        fill="none"
        stroke="#ff6b00"
        strokeWidth="0.3"
        className="graffiti-text"
        transform="rotate(9, 72, 72)"
      >
        ART
      </text>

      <text
        data-id="majic"
        x="3"
        y="78"
        fontFamily="'Bebas Neue', sans-serif"
        fontSize="4"
        fill="none"
        stroke="#1e90ff"
        strokeWidth="0.22"
        className="graffiti-text"
        transform="rotate(-7, 3, 78)"
      >
        MAJIC
      </text>

      <text
        data-id="n64"
        x="80"
        y="58"
        fontFamily="'Bebas Neue', sans-serif"
        fontSize="8"
        fill="none"
        stroke="#b44fff"
        strokeWidth="0.35"
        className="graffiti-text"
        transform="rotate(12, 80, 58)"
      >
        64
      </text>

      <text
        data-id="colors"
        x="28"
        y="88"
        fontFamily="'Bebas Neue', sans-serif"
        fontSize="5.5"
        fill="none"
        stroke="#00d4ff"
        strokeWidth="0.28"
        className="graffiti-text"
        transform="rotate(-5, 28, 88)"
      >
        COLORS
      </text>
    </svg>
  )
}

// Version mobile : 3 shapes + 2 mots, pas de scroll listener (perf)
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
      // Déclenche après un court délai (éléments hero visibles d'emblée)
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
        fontFamily="'Bebas Neue', sans-serif"
        fontSize="5"
        fill="none"
        stroke="#39ff14"
        strokeWidth="0.3"
        className="graffiti-text"
        transform="rotate(-12, 4, 85)"
      >
        STREET
      </text>
    </svg>
  )
}
```

**Step 2 : Vérifier la compilation**
```bash
npm run dev
```
Attendu : pas d'erreur TypeScript. L'overlay SVG est visible dans DevTools (aucune forme visible encore).

---

### Task 2 : CSS transitions dans index.css

**Files:**
- Modify: `src/index.css`

**Step 1 : Ajouter à la fin du fichier**

```css
/* ─── Graffiti Layer ── */
.graffiti-path,
.graffiti-text {
  transition: stroke-dashoffset 1.6s cubic-bezier(0.4, 0, 0.2, 1),
              opacity 0.8s ease;
  opacity: 0;
}

.graffiti-path.graffiti-drawn {
  stroke-dashoffset: 0 !important;
  opacity: 0.28;
}

.graffiti-text.graffiti-drawn {
  stroke-dashoffset: 0 !important;
  opacity: 0.22;
}

@media (prefers-reduced-motion: reduce) {
  .graffiti-path,
  .graffiti-text {
    transition: opacity 0.3s ease;
  }
}
```

---

### Task 3 : Intégration dans App.tsx

**Files:**
- Modify: `src/App.tsx`

**Step 1 : Ajouter l'import**

```tsx
import GraffitiLayer from './GraffitiLayer'
```

**Step 2 : Ajouter le composant** juste après `<WaterRipple />`

```tsx
{/* Graffiti layer */}
<GraffitiLayer />
```

---

### Task 4 : Tuning visuel

Après avoir vu le résultat dans le navigateur :
- Ajuster `opacity` dans le CSS si trop visible / trop discret
- Ajuster les positions `transform="translate(...)"` si overlap avec le contenu
- Ajuster les `fontSize` des textes si trop gros / petits
- Tester sur mobile (DevTools 390px) et vérifier que GraffitiMobile s'affiche

Pas de commit tant que le résultat n'est pas validé visuellement.

---

### Task 5 : Commit

```bash
git add src/GraffitiLayer.tsx src/index.css src/App.tsx docs/
git commit -m "feat: couche graffiti SVG animée au scroll"
```
