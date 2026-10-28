# Testimonial and Single Session section

## Artwork

Selected file: `testimonial-single-session.png` (1268 × 1241 pixels). Restored with the built-in image-generation tool from `reference-single-session.png`. This is a reconstruction of the supplied reference photograph. All labels, pricing and controls are separate HTML.

Prompt:

Edit and faithfully restore the supplied reference photograph for a sports website. Remove ALL overlaid interface elements: both white label pills, date in upper right, Single Session title, subtitle, price pill, bottom FULL GAME caption, and white arrow button. Preserve the exact underlying image composition, camera perspective, color, subject placement and crop. A vivid cyan blue sky fills upper two thirds; one large lime-yellow tennis ball floats at upper-center-left, center at44% width and31% height, diameter20% width. A second slightly smaller lime ball is near42% width,66% height. A dark-skinned adult woman tennis player is centered behind the balls, wearing a yellow visor, sports sunglasses, long dark hair and a blue athletic top. Her head is near51% width,54% height. An enormous blue tennis racket with yellow strings dominates the lower foreground diagonally, rim curves up from lower left to middle-right; strong exaggerated close-camera perspective. Outdoor green court, trees and thin light poles in background, bright daylight. Output a high-resolution near-square image in535:527 aspect ratio, about1200px wide. Restore square corners by filling the tiny rounded corner areas with the continuous photo. Keep scene faithful; no new objects, words, logos, labels, UI, frames, button or watermark.

The heading's tennis artwork uses the original `reference-testimonial.png` through an SVG viewport (`229 50 94 68`). The pale registered-mark decoration, rating stars, badges and arrow icons are SVG/CSS.

## Content and behavior

The carousel contains the supplied Benedeta Chan review plus nineteen fictional demo reviews, as requested. It opens at `1/20`. The source quote, name, attribution, line breaks and 4.5 rating are preserved. Every added entry visibly shows “Demo review” and “Fictional customer”; its sample name, quote and rating are not presented as an actual customer endorsement.

Previous and next buttons cycle through all twenty entries and wrap at either end. Left/right arrow keys work while a navigation button has focus. Each change updates the quote, author, numeric rating, matching star fill, counter and screen-reader status. There is no autoplay. The previous review-detail dialog has been replaced by carousel navigation.

The Single Session arrow opens a detail dialog with the reference's $99/session price, beginner training description, Apr–May 2025 period, Professional Trainer and Merchandise labels. It does not submit a booking or payment.

## Accessibility

All text uses locally hosted DM Sans. Secondary text is darkened for contrast, while white text over the photo has a narrow dark outline rather than a broad image overlay. Both carousel buttons have accessible names and retain keyboard focus while reviews change. Decorative stars are hidden from assistive technology and the rating includes an accessible “out of 5 stars” label. Demo status is included in the live announcement. The session dialog supports keyboard operation, Escape, its close button and focus restoration.

## Verification

The section layout was checked at 320, 390, 430, 560, 768, 850, 900, 1100, 1440 and 1920px: no horizontal overflow; quote footer stays inside the card; rating and footer do not collide; date and badge labels do not overlap; session description stays above the price. Carousel checks cover every review at 320, 390, 1100 and 1440px, verifying demo labels, distinct names, star fills, counter updates, forward/backward wraparound, keyboard operation, source line-break restoration and content fit. No browser errors. Demo screenshots: `testimonial-demo-1440.png`, `testimonial-demo-390.png`.

At the reference scale, both cards are 535px wide and approximately 527px tall. Review screenshots: `testimonial-preview-1100.png`, `testimonial-preview-1440.png`, `testimonial-preview-390.png`.

After visual review, corrected the mobile session card's intrinsic aspect-ratio sizing and the heading's space at its desktop line break. Explicit card-within-container and button-within-card checks pass from 320px through desktop widths. Contrast: primary text on white 18.88:1; secondary text on white 7.90:1; white photo text against its dark outline 9.43:1; white arrow icon on orange 3.30:1.
