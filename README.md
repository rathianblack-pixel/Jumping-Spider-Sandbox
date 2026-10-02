# Jumper Terrarium v18 — modular build

Entry point: `index.html`. Upload the entire folder (or the ZIP contents) to Netlify/GitHub Pages; do not upload only `index.html`.

## Source layout
- `js/core.js` — math, pixel buffer, projection primitives
- `js/species.js` — jumping-spider species data
- `js/decor.js` — base decor/substrate definitions
- `js/tank.js` — tank surfaces, navigation, world state, jump ranges
- `js/prey.js` — prey catalog, construction and prey AI
- `js/spider.js` — jumper construction, hunting and base spider AI
- `js/creature-render.js` — spider/prey pixel-art rendering
- `js/environment-render.js` — terrarium/decor/environment renderer
- `js/audio.js` — procedural audio
- `js/ui.js` — inventory, placement, controls and panels
- `js/postfx.js` — HD-2D compositor / WebGL fallback
- `js/ecosystem.js` — personality, memory, silk, cannibalism, awareness
- `js/loop.js` — guarded main animation loop
- `js/habitats.js` — enclosure types, presets, habitat persistence
- `js/camera.js` — Observer/Follow/Reverse camera system
- `js/stability.js` — habitat-state recovery and drawer navigation
- `js/tank-selector.js` — compact Tank picker
- `js/boot.js` — starts the animation loop and exposes debug state

## v18 fix
The inventory shelf no longer calls `setPointerCapture()` on every mouse-down. Pointer capture begins only after a real horizontal drag (>5 px), so clicking Live Food/Decor/Plants cards reliably selects them.

## v18 bug fixes
- Live Food/Decor/Plants cards remain normal clicks unless the mouse actually moves far enough to start a shelf drag. This fixes prey cards failing to enter placement mode.
- Cannibal pounces no longer call the ordinary `preyDodge()` routine on another owned jumper. Spider-vs-spider avoidance happens before commitment through the awareness/threat system; after a stronger jumper commits, the pounce can actually launch instead of being reset by an exception.
