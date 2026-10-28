# Motion dependencies

Locally served, pinned GSAP 3.14.2 and ScrollTrigger 3.14.2 distributions.

- Source: https://cdn.jsdelivr.net/npm/gsap@3.14.2/dist/gsap.min.js
- Source: https://cdn.jsdelivr.net/npm/gsap@3.14.2/dist/ScrollTrigger.min.js
- License: https://gsap.com/standard-license (copyright and license headers preserved)
- Documentation: https://gsap.com/docs/v3/GSAP/gsap.matchMedia()/ and https://gsap.com/docs/v3/Plugins/ScrollTrigger/

All page sections use these libraries for optional motion enhancement. The page remains visible without them, the Benefits accordion falls back to native details behavior, and the Programs and Testimonials carousels update immediately without their motion modules. Core site interactions are in a separate script. The fixed glass header uses native browser APIs independently of GSAP.
