# AI Development History

## Optimization: Streaming Video Playback
**Date:** March 31, 2026

**Issue:**
The `reference-video.webm` file was ~100MB and being imported directly into the React component via Vite's asset bundling system (`import refVideo from './assets/reference-video.webm'`). This caused Vite to attempt to bundle and process the large video file, leading to memory problems and slow loads because the file wasn't being progressively streamed.

**Solution:**
1. **Asset Migration:** Copied `reference-video.webm`, `IMG.jpg`, and `IMG 2.jpg` from `src/assets/` to the `public/` directory. Files in `public/` are served as-is over HTTP without being bundled, allowing the browser to request byte-ranges and progressively stream the video.
2. **Path Updates:** Changed the import statements in `App.tsx` from relative imports to absolute public URLs (`/reference-video.webm`, etc.).
3. **Playback Optimization:**
   - Modified the `<video>` elements to include `preload="auto"` and `playsInline` attributes.
   - Replaced pure React `autoPlay` with programmatic playback. Attached a `useRef` to each video element.
   - Introduced a `tryPlay()` function wrapped in `useCallback` that explicitly calls `.play()` and safely catches potential `DOMException` errors (which happen when browsers block autoplay).
   - Added a `useEffect` hook to re-trigger `.play()` whenever the selected display technology or calibration media source changes, simulating a reliable "YouTube-style" buffer-and-play experience.

## Enhancements: Documentation Update
**Date:** March 31, 2026

- Thoroughly rewrote `README.md` to accurately reflect the current project structure, explicitly detailing the recent `public/` directory changes.
- Updated the comprehensive feature list detailing the 3D Exploded Layer View, Microscope Mode, Lighting Environment Simulator, and the 10 Display Technologies Covered.
- Created this `ai_history.md` file to catalog major developmental milestones.
