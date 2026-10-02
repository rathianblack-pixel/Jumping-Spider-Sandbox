# Jumper Terrarium v20 — Living Terrarium update

Entry point: `index.html`. Upload the **entire extracted folder** to Netlify/GitHub Pages; do not upload only `index.html`.

## v20 highlights
- **Physical locomotion:** route travel now drives the leg phase from actual distance moved; jump launches/landings compress the body, spiders probe surface transitions, wall turns lean subtly, and nearby flexible decor reacts to movement.
- **Smarter hunting:** jumpers predict moving prey, choose direct/intercept/rear/high-angle approaches, remember failed attack positions and can wait near repeatedly used prey routes.
- **Lifecycle:** persistent age, molt count and life phase (sling → juvenile → sub-adult → young adult → adult/older adult). Life stage affects movement and is saved per individual.
- **Reactive habitat:** foliage/branches receive damped movement impulses from jumpers and faster prey.
- **Observation Mode:** 📹 Observe / `O` follows the most interesting animal behavior with a minimal wildlife-style HUD.
- **Species identity:** species now differ more strongly in wall use, height preference, plant interest, direct-vs-rear hunting, activity and display tendency.
- **Expanded prey ecology:** Springtail Colony, Dwarf Isopods, Waxworms and Darkling Beetles. Springtails are cleanup fauna and are not hunted; isopods favor moisture/cover; waxworms burrow; beetles become more active at night.
- **Depth pass:** tighter contact shadows, wall-contact shadows and subtle foreground lighting improve grounding.
- **Mobile pass:** compact top bar with Tank selector, five primary bottom actions, a More controls sheet, 2-column/3-column inventory grid, larger touch targets, safe-area handling and touch-friendly placement.

## Regression fixes retained
- Live Food/Decor/Plants card clicks are no longer swallowed by drag-to-scroll.
- Spider-vs-spider pounces do not call normal prey-dodge code.
- Rear-approach stalking speed and smooth wall-local stalking from v19 remain intact.
- Habitat switching recovery and offscreen fixed-step simulation remain intact.

## Source layout
- `js/core.js` — math, pixel buffer, projection primitives
- `js/species.js` — base jumping-spider species data
- `js/decor.js` — decor/substrate definitions
- `js/tank.js` — surfaces, navigation, world state and jump ranges
- `js/prey.js` — base prey catalog and AI
- `js/spider.js` — base jumper AI
- `js/creature-render.js` — spider/prey pixel-art rendering
- `js/environment-render.js` — terrarium/environment rendering
- `js/audio.js` — procedural audio
- `js/ui.js` — inventory, placement and panels
- `js/postfx.js` — compositor and WebGL fallback
- `js/ecosystem.js` — personality, memory, silk, cannibalism and awareness
- `js/loop.js` — guarded animation loop
- `js/habitats.js` — enclosure types, presets and persistence
- `js/camera.js` — Observer/Follow/Reverse cameras
- `js/stability.js` — state recovery and drawer navigation
- `js/tank-selector.js` — compact Tank picker
- `js/species-behavior-v20.js` — species behavioral identities
- `js/lifecycle-v20.js` — aging/lifecycle layer
- `js/hunting-v20.js` — predictive/adaptive hunt planning
- `js/locomotion-v20.js` — physical movement polish
- `js/prey-ecology-v20.js` — added fauna and ecological behavior
- `js/reactive-decor-v20.js` — habitat movement reactions
- `js/depth-v20.js` — contact/depth lighting pass
- `js/observation-v20.js` — wildlife Observation Mode
- `js/mobile-v20.js` — mobile controls
- `js/boot.js` — starts the loop / debug state
