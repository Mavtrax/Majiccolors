# Design — GraffitiLayer (2026-04-28)

## Objectif
Ajouter une couche d'animations street art / graffiti sur tout le site Majic Colors : mots et formes qui se dessinent progressivement au scroll, style tag/marqueur.

## Architecture
- Nouveau composant `src/GraffitiLayer.tsx`
- Couche SVG pleine page en `fixed`, z-index entre LiquidBackground (-1) et le contenu (10)
- Intégré dans `App.tsx` au même niveau que `WaterRipple` et le grain

## Éléments

### Mots (stroke SVG, style tag)
`MAJIC` · `COLORS` · `STREET` · `ART` · `64`

### Formes (icônes graffiti)
Crown · Flèche · Aigle · Montagne · Sunset

## Couleurs
Palette existante du site : #ff6b00, #00d4ff, #ff2d78, #b44fff, #f5c400, #1e90ff, #39ff14
- Opacité au repos : ~0.15
- Opacité au scroll (viewport) : ~0.35

## Disposition
- Positionnement en % hard-codé (stable entre rechargements)
- Rotations variées (-25° à +25°)
- 15-20 éléments desktop, 6-8 mobile

## Mécanique d'animation
1. `IntersectionObserver` sur chaque élément SVG
2. Classe `is-drawn` ajoutée quand l'élément entre dans le viewport
3. `stroke-dasharray` + `stroke-dashoffset` → transition CSS ~1.2s ease-out
4. `fill: none` — contour uniquement, style marqueur/tag
5. Une fois dessiné, l'élément reste visible

## Mobile
- 6-8 éléments max
- `stroke-width` réduit
- Animations plus courtes (0.8s)
