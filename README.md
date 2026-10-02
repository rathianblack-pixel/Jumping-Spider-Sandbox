# Jumper Terrarium v22 — Portrait Habitat Revamp

Run `index.html` from a normal web server (Netlify, GitHub Pages, `python -m http.server`, etc.). Keep the `css/` and `js/` folders beside it.

## v22 portrait/mobile changes
- Portrait-specific enclosure geometry for every habitat type. Tanks become narrower/taller on phones while keeping their species capacity and identity.
- Orientation remapping preserves normalized decor/animal placement. Returning to landscape restores the desktop habitat proportions.
- Autosaves remain in canonical desktop coordinates so rotating or opening the same save on desktop does not progressively distort layouts.
- Portrait camera fitting uses the narrow visible crop rather than squeezing the entire desktop scene into the phone width.
- Portrait canvas uses a centered, aspect-preserving crop rather than stretching the 16:9 renderer.
- Minimal mobile header: Coins / Tank / Day-Time.
- Five-button thumb dock: Build / Food / Jumpers / Observe / More.
- Build and Food use touch-friendly bottom sheets with vertical 2-column card grids.
- Build sheet has Decor / Plants / Substrate / Presets tabs.
- More sheet contains maintenance, cameras, time, sound, settings, help and habitat management.
- Selected-jumper info is a compact bottom card; tap it to expand/collapse.
- Tank picker and modals are redesigned for portrait touch use.
- Safe-area handling for notches and home indicators.

Desktop/landscape v21 behavior is intentionally preserved.
