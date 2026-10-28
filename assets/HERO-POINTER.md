# Cursor-linked ball and shadow

The original court image contains a baked-in shadow. Desktop users with a fine pointer and no reduced-motion preference now receive a clean court image and a separate soft SVG shadow. Mobile, touch and reduced-motion views retain the original photograph.

The ball is acquired by moving onto it, or by pressing and dragging it. Once acquired, cursor displacement maps one-to-one to ball displacement across the entire hero, preserving the original grip offset. There is no short travel limit or whole-page cursor mapping. The ball and shadow use the same eased position. Leaving the hero, releasing a drag, keyboard focus, scrolling and tab visibility changes return the position to rest. Entrance and scroll transforms remain on separate layers.

The interactive ball is an analytic WebGL2 sphere, with a procedural pebbled leather texture and spherical grooves. Quaternion rotation changes the surface around both axes while the light remains fixed. Rendering stops when rotation settles. The original photographic ball is retained for mobile, touch, reduced motion and unavailable/lost WebGL contexts. No new external rendering dependency is required.

Material refinement: a 2048×1024 packed texture stores irregular rounded pebble height, roughness variation and subtle leather color variation. Surface normals include both leather relief and recessed seam profiles. Broad rough specular lighting replaces the initial uniform shine. This is a procedural 3D material, not a photographic scan. Preview: `ball-material-1440.png`. Material rendering, full-distance movement, shadow synchronization and reduced-motion fallback were checked at 1100px and 1440px.

Verified at 851, 1100, 1440 and 1920px: full-distance tracking, sphere surface changes, shadow synchronization, local acquisition, drag capture/release, keyboard focus, reduced-motion toggling, mobile resize, touch and unavailable-WebGL fallback. Preview: `hero-3d-full-travel.png`.

## Image asset

- Saved asset: `hero-court-clean.png`
- Edit source: `hero-court-v2.png`
- Tool: built-in image generation, edit mode.
- Generated source: `C:/Users/Sam/.codex/generated_images/01a1746c-d750-7570-bbd2-70c72f4d6aca/exec-62fa63e6-f684-496c-8b18-7442c27844fe.png`
- The source asset was preserved. The new photo reconstructs the formerly shadowed texture; it is not a pixel-identical restoration.

## Final prompt

Edit target: the attached blue sports-court photograph. Remove ONLY the large dark elongated ball shadow that extends from the upper left toward the lower right center. Fill that area with naturally sunlit blue court texture matching the surrounding surface. Preserve the exact camera, framing, dimensions/aspect ratio, detailed gritty texture, cyan-blue hue and diagonal orange court line location, angle, thickness and texture. Keep natural subtle surface lighting variation but NO cast object shadows anywhere. No balls, objects, text, logos or new court markings. This is a clean background plate for animating a separate ball and shadow on a website; exact composition preservation is essential.
