# Jumper Terrarium v28 — Universal Open Nature Displays

Run `index.html` from a normal web server (Netlify, GitHub Pages, `python -m http.server`, etc.). Keep the `css/` and `js/` folders beside it.

## v23 portrait/mobile changes
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


## v23 portrait placement fix
Selecting Decor or Live Food in portrait now closes the inventory sheet while keeping placement active, revealing the full enclosure. Portrait touch placement also tolerates small perspective/crop rounding at tank edges.


Update v24: Portrait/mobile rendering now defaults to a sharper internal resolution. On coarse-pointer devices, landscape uses at least Medium quality and portrait uses High quality for a much crisper enclosure view.


## v25 — Open Nature Display / surface navigation expansion
- New Open Nature Display enclosure: invisible containment, no visible/climbable glass.
- Ground, climb, perch and flight movement separated; non-climbing prey cannot attach to decor.
- Decor/perch surface routing for drinking, stalking, pouncing, carrying and retreats, with stuck-route recovery.
- Open-display mist settles on real decor/plant anchors instead of glass.
- Surface-following body orientation on climb/perch movement.
- Tiny live-food jumper awareness/reflex reduced while retaining the 50/50 committed pounce outcome.
- 19 new decor/plant pieces, 6 substrates and 6 feeder/ecology prey types.


## v26 — Open Display visibility correction
- Open Nature Display is now automatically added as an owned habitat in the first available shelf slot.
- On the first v26 launch the game switches to it once so the player sees the new open-air habitat immediately.
- It starts with Pale Beach Sand, a Grand Habitat Tree, roots, branches, rocks and plants already arranged.
- The Habitat Shelf preview for Open Nature Display contains no glass/frame graphics.
- Existing glass enclosures remain unchanged; only the dedicated Open Nature Display uses invisible containment/no climbable glass.


## v27 — Hunger-driven stalking
- Hunger now directly increases stalking approach speed.
- Full/content jumpers remain more measured; very hungry jumpers close distance much more aggressively.
- The hunger speed bonus fades out only in the narrow final pre-pounce zone.
- All jumpers still slow into a careful creep immediately before crouch/launch.
- Rear-approach speed bonuses remain compatible with the hunger curve.


## v28 — Universal Open Nature Displays + carried-meal fix
- Open display is no longer a separate enclosure type. Standard, Arboreal, Wide, Nano, Large Cube, Acrylic, Panoramic and Jar all keep their current dimensions/capacities but render with no visible glass and no climbable boundary.
- Invisible containment still keeps flyers and walkers inside.
- Existing dedicated Open Nature Display saves are migrated: untouched auto-created displays are returned to a free slot; edited/occupied ones are preserved as Standard habitats instead of being deleted.
- Mist settles on decor/perches in every habitat.
- Wall routes/ambushes are rejected or converted to real substrate/decor routes in every habitat.
- Carry-route recovery no longer clears the hunt/meal reference. If a jumper cannot finish carrying prey to a perch, it feeds at its current supported position instead.
- Held prey ownership/attachment is guarded through carry/feed states so meals cannot silently disappear.
- Finished meals leave remains on the actual decor/support surface where feeding occurred.
