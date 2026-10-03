# Jumper Terrarium v31 — Physical Habitat Architecture

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


## v29 — Exact decor thumbnails + rotation repair
- Decor and plant inventory thumbnails now use the real habitat renderer instead of the old simplified icon path.
- Thumbnail proportions, procedural details, textures, plant silhouettes and lighting come from the same draw functions used in the tank.
- Rotation now applies to all decor and plants, not just platform-type decor.
- Rotated footprints, placement bounds, plant visuals, flat-decor textures, perch anchors and physical navigation anchors stay synchronized.
- Placement rotation resets when a new item is selected and the selected desktop thumbnail updates to show the current orientation.
- Portrait/mobile uses the same corrected placement logic and Rotate button.


## v30 — Habitat-aware hunting intelligence
Jumpers now build tactical approach routes through real decor and plant surfaces. They can chain supported jumps between nearby perches/platforms, use elevation and cover, route around blocked direct approaches, predict moving prey, and select a final launch perch that improves the pounce angle. Existing hunger-speed and final pre-pounce slowdown remain intact.

## v31 — Physical habitat architecture + natural presentation
- Decor and plant traversal is constrained to authored visible geometry. Platform decor exposes exact box sides/tops; plant traversal uses visible trunks, branches, stems, fronds and leaves rather than oversized invisible walk meshes. Invalid climb/perch positions are snapped back to the nearest real support or safely returned to a physical floor/platform.
- Jumper pose now follows the exact support normal. Front/back/side surfaces produce dorsal, ventral/belly and side views correctly; reverse camera swaps them naturally. Climbing prey uses the same support orientation, with a distinct ventral render instead of reusing the dorsal view.
- High hunters get a bounded downward-pounce range advantage. Target commitment is steadier around prey clusters, and an elevated hunter with a failed route actively chooses a lower supported launch point rather than pacing indecisively.
- Pre-molt is now an immediate priority: hunting/attention is cancelled, a high sheltered retreat is scored from real habitat surfaces, and the jumper heads there directly before premolt/molt.
- Springtails now actively seek feeder remains, including remains on elevated decor. They route floor → climb → supported top/perch, feed there, and remove the remains after cleanup.
- Creative stacking: suitable decor/plants can be placed on sufficiently large platform decor. The child inherits the real support height, renders at that height, contributes real navigation surfaces, respects sibling overlap, and persists through save/load.
- Landscape Iso / Observer / Reverse cameras now frame visible habitat content much more tightly instead of dedicating most of the frame to the old room background. Portrait camera fitting remains controlled by the portrait system.
- The old house/desk presentation is replaced with selectable blurred natural backgrounds per habitat: Ancient Tree Hollow, Mossy Forest Floor, Sunlit Meadow, Rainforest Canopy, Twilight Woodland, Moss Stone Garden and Fallen Log Interior.
- Continuous rain ambience is removed. Existing quiet cricket chirps/fly buzz remain, birds are disabled, and sparse close wing/scuttle sounds add unobtrusive critter ambience.
- Existing v28 meal-carry protection, v29 exact thumbnails/rotation, v30 habitat-aware hunt routing, universal open-display containment and portrait/mobile HD behavior remain intact.

