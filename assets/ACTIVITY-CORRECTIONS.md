# Activity reference corrections

The hoop and player are reconstructed with the built-in image-generation tool from tightly cropped reference inputs. They remain restorations rather than original source photographs. The heading uses the exact original basketball artwork through an SVG viewport; the generated ball alternative is retained but is not used.

Selected image paths: `activity-hoop-reference-edit.png`, `activity-player-reference-edit.png`. Reference artwork: `reference-activity.png`, viewport `796 155 70 50`.

## Implementation and validation

- Rebuilt the decorative chart curve and faded highlight; its numerical activity values remain available as real text. The decorative illustration is hidden from assistive technology.
- Distributed the metric columns across the dashboard, redrew the reference-style icons, and adjusted the heading and category-row spacing. DM Sans is retained throughout.
- Removed the portrait's dark oval and broad gradient. White captions use a narrow dark glyph outline for contrast.
- Kept white lettering on the two small orange badges, with a darker orange background to meet AA. White on `#cf3f00`: 4.81:1; secondary gray `#70727b` on white: 4.79:1; white captions against the `#454545` outline: 9.59:1.
- Browser checks at 320, 390, 560, 768, 900, 1051, 1100, 1440, and 1920px: no horizontal overflow, dashboard fits its image, metric columns do not overlap, images decode. Both detail dialogs open by keyboard, close with Escape, and return focus. No browser errors.
- Desktop and mobile review screenshots: `activity-corrected-1440.png`, `activity-corrected-1100.png`, `activity-corrected-390.png`.

## activity-hoop-reference-edit.png

Input: `reference-activity-hoop.png`

Edit this exact reference crop. Remove only the white Activity statistics dashboard and reconstruct the obscured basketball-hoop photograph behind it. Preserve ALL visible photographic content faithfully: same camera framing, muted blue sky, the backboard angle and dimensions, left-side rim/net, dark diagonal support, sparse autumn branches and their placement. Do not invent a different basketball hoop photo. Preserve the deliberate soft optical focus. Output the complete photo without the white card or any text, in the same 528:612 portrait aspect ratio at about 1056x1224 pixels. Extend photograph into the tiny rounded-corner cutouts so output has square corners. This is faithful restoration of the input, not a new scene. No lettering, logos, dashboard, chart, numbers or UI.

## activity-player-reference-edit.png

Input: `reference-activity-mood.png`

Edit and faithfully restore this exact reference photograph. Remove only the overlaid 2025 label, central white View More pill, and lower COMMING SOON text; fill those areas with the underlying scene. Preserve the same adult man, face shape, short upright dark hair, expression looking right, basketball and fingers on the lower left, white tank top, black straps, white headphones, background architecture, muted colors, lighting and EXACT camera crop. Do not zoom out: the torso continues beyond bottom edge, waist and trousers must NOT be visible. Do not move or enlarge the basketball. Restore photographic detail at 1024x1024 while respecting original appearance, no new objects, no dramatic shadows. Fill the tiny rounded top corners with the continuous background, square output corners. No text, dates, numbers, UI, button, captions or watermark.

## activity-ball-reference-edit.png

Input: `reference-activity-ball.png`

Faithfully restore and enlarge this exact small basketball photograph to high resolution, maintaining its 70:50 aspect ratio. Preserve the exact orange-brown Wilson NCAA ball, frontal logo placement, nearly horizontal black seams, pale gray background with a thin tan court surface at bottom, the short shadow, same framing and relative ball scale. Do NOT redesign the ball or replace the background with a dark wall. Square output corners, fill outside the existing oval with matching pale gray background; the website will apply its own oval mask. Sharp natural photographic surface details without altering object shape. No added wording except existing Wilson and NCAA markings on the ball. Output about1008x720.
