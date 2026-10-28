# Page motion and fixed header

Each section has an independent GSAP enhancement module. Entrance sequences play once and resolve to the existing reference layout. Content and controls retain their native behavior when motion dependencies are absent or reduced motion is requested.

- Hero: existing entrance and ball interaction, unchanged in the remaining-section pass.
- Benefits: staged reveals and interruptible native-details accordion transitions.
- Programs: manual directional transitions, synchronized counter and rapid-input handling.
- Activity: photo/dashboard entrances and a one-time decorative chart draw; numeric values remain available throughout.
- Current Events: row/content reveals and a small preview tilt, preserving image loading, position and dialogs. Keyboard focus takes priority over a stationary pointer during focus-induced scrolling.
- Testimonials: synchronized quote/count/rating/author changes, manual controls and visibly labeled demo reviews.
- Footer: seven clipped strips reveal the original wordmark without changing its shaping; an orange sweep finishes the entrance. A cursor-local orange highlight appears on desktop. The dotted back-to-top icon has bounded hover/focus movement and retains native smooth scrolling.

`header.js` measures the fixed header and observes the hero boundary. It is transparent at the very top, blue frosted glass after scrolling within the hero, and white frosted glass with dark navigation once it passes the hero. Custom wellness and Get in touch appear in the sticky blue header while scrolling through the hero, then leave with that blue state. The original labels remain in the hero for the top state and no-JS fallback. The header shell applies a 26px backdrop blur so passing page details soften behind its translucent tint. CSS scroll padding offsets anchor targets by the measured header height plus 18px. Solid color fallbacks support browsers without backdrop filtering; the default no-JS header remains legible. Reduced motion removes the crossfade. Header states, labels, blur, anchor, colors and overflow were checked at all six widths.

Validation: 320, 390, 850, 1100, 1440 and 1920px; resting section dimensions compared with the pre-motion baseline; horizontal overflow, header state/anchor offsets, activity and event dialogs, keyboard previews, testimonial wrap/rapid input/demo labels, runtime reduced-motion changes, footer placeholder dialogs, resources, download and return-to-top. Additional footer checks cover reveal completion, pointer highlight, smooth scrolling/focus and repeated reduced-motion teardown. No browser script errors reported.

Preview assets: `header-glass-390.png`, `header-glass-1440.png`, `footer-ink-interaction.png`, and `motion-<section>-390.png` / `motion-<section>-1440.png`.
