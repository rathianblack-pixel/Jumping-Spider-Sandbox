# Jumper Terrarium v22 → v23 portrait placement fix

Replace these files in your existing v22 modular build:
- `js/portrait-v22.js`
- `css/portrait-v22.css`

Fixes:
- Selecting Decor or Live Food in portrait automatically closes the inventory sheet while keeping the selected item active.
- Portrait touch placement allows a small edge tolerance for perspective/crop rounding.
- The selected-jumper info card hides during placement so it cannot intercept taps.
- Mobile modals render above the thumb dock, including first-run Help.
- Portrait placement hints now say to tap the tank directly.
