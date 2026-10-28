# Current events section

## Selected photograph

`events-tennis-rest.png` — 1186 × 1326 pixels, restored with the built-in image-generation tool using `reference-current-events.png`. It is a reconstruction of the reference photograph, not the original source asset. The page supplies the rounded corners and −5° rotation in CSS.

Prompt:

Edit target: supplied website reference. Extract and faithfully restore ONLY the tilted tennis photograph over the event list (roughly x663 y288 to x973 y630). Output only a high-resolution upright rectangular photograph with square corners, portrait aspect ratio 288:322, about1024px wide. Undo the slight counterclockwise rotation in the reference; the webpage will apply that tilt itself. Preserve the source composition: top-down close view of an adult athlete's two tan bare legs extending diagonally from dark navy shorts cropped at bottom-left toward white/light-gray athletic shoes with pale blue laces at upper-right. A dark tennis racket lies on the green court at left, its head near upper-left, handle reaching lower-left. Exactly two yellow-green tennis balls, one near racket head/right and one lower-left by the handle. Strong diagonal crisscross shadows from a tennis net across the green court and legs. Strong natural sunlight, deep green surface, warm skin, realistic shoes and racket strings. Match the source photograph's framing, leg angle, object placement, colors and perspective closely. Do not add people, hands, torsos, UI, text, labels, logos, black borders, orange background or website elements.

## Other artwork

The inline basketball uses the original reference artwork through an SVG viewport (`645 77 95 55` of `reference-current-events.png`). The leaf, arrows and tag icons are inline SVG. All text uses the existing local DM Sans font.

## Behavior

The header's Events link scrolls to this section. Hovering or focusing an event moves the orange highlight and shows its matching image. Youth Sports Camp uses `events-tennis-rest.png`; the other rows use their existing program photos. On desktop the preview follows the selected row vertically while remaining within the list. The image cannot intercept pointer events, and switching rows does not change their heights. Leaving the list restores Youth Sports Camp unless a row still has keyboard focus.

Images preload near the viewport; decoded image swaps ignore stale hover requests. Reduced-motion preferences disable preview movement and fades, including when the preference changes during a fade. Touch activation and clicks still open the overview dialog with the event name, descriptive copy, and program photo. No dates, prices or booking availability are asserted. Native dialog keyboard behavior, Escape, close buttons and backdrop dismissal are supported.

## Accessibility adaptations

The featured title remains at least 24px so white text on the reference orange meets the large-text contrast threshold. The smaller tag labels use darker orange backgrounds for normal-text contrast. At tablet and phone widths, the photograph moves above the list so it cannot obscure titles or controls. The content wrapper has a 1400px maximum; the black panel spans the available page width.

## Validation

- Browser widths: 320, 390, 560, 768, 850, 900, 1100, 1440 and 1920px. No horizontal overflow or image overlap with event titles, tags or arrows.
- All five event dialogs: correct title and decoded image; Enter opens, Escape closes and returns keyboard focus. Header Events anchor reaches `#current-events`. No browser errors.
- White featured title on `#ff4f00`: 3.30:1 at 24px or larger. White small tags on `#b83500`: 5.92:1. Other event text on black: 19.26:1.
- At the reference scale, the panel is approximately 741px tall versus 739px in the supplied screenshot; the featured row is 125px tall.
- Review captures: `events-preview-1100.png`, `events-preview-1440.png`, `events-preview-390.png`.
- Hover update: all five images and highlights verified by mouse and keyboard at 320, 390, 768, 900, 1100 and 1440px; list heights remain stable. Rapid switching selects the latest image, leaving restores the default, reduced-motion disables animation, and touch still opens the correct dialog. At smaller sizes non-camp active rows use darker orange to preserve contrast for their smaller title text. Hover capture: `events-hover-trainer-1440.png`.
