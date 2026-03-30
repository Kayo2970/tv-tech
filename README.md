# 📺 TV Tech Explorer V2

An interactive, 3D educational simulator designed to demonstrate the evolution of display technologies. This tool allows students to "explode" different screen types to see their internal layers and zoom into the sub-pixel level to understand how light is formed.

## 🚀 Live Demo
Run the project locally to interact with the 3D models:
```bash
npm install
npm run dev
```

## 🛠 Features

### 1. Exploded 3D View
Drag and rotate the screen 360° to see the internal architecture:
*   **CRT (1950s):** Thick vacuum tubes, electron guns, and shadow masks.
*   **Plasma (2000s):** Gas discharge cells and phosphor coatings.
*   **LCD (1990s):** Backlight units, liquid crystal shutters, and polarizers.
*   **QLED (2015s):** Quantum Dot Enhancement Films (QDEF) for pure color.
*   **OLED (2010s):** Ultra-thin self-emissive organic layers.
*   **Mini-LED (2021):** Thousands of tiny LED zones for high-contrast local dimming.
*   **QD-OLED (2022):** Blue OLED emitters with Quantum Dot color converters for extreme purity.
*   **MicroLED (Future):** Inorganic tiny LED chips for extreme brightness and perfect blacks.

### 2. Microscope Mode (Sub-Pixel Zoom)
Toggle to see the actual arrangement of RGB lights:
*   **Enhanced Triad Pattern:** Realistic circular phosphor arrangement used in CRTs.
*   **Diamond PenTile:** Advanced sub-pixel layout found in high-end OLED and QD-OLED displays.
*   **RGB Stripe:** The standard vertical bar arrangement used in most LCD, QLED, and Mini-LED screens.
*   **Visual Fidelity:** Dynamic scanline animations and sub-pixel glow effects for a realistic microscopic experience.

### 3. Reference Video Simulation
Real-time visual filter simulation using high-quality 8K reference footage:
*   **Dynamic Filters:** Watch how content changes across technologies with simulated contrast, brightness, saturation, and blur.
*   **Comparison Tool:** See the "washy" blacks of standard LCD vs. the "infinite" contrast of OLED in a live video context.

### 4. Interactive Physics
*   **Layer Separation:** Use the slider to pull the components apart and identify each layer.
*   **Ambient Lighting:** Simulate a bright classroom vs. a dark home theater to see how glare affects different tech.
*   **Viewing Angles:** Rotate the stack to see how LCDs lose contrast compared to OLEDs.

## 🧰 Tech Stack
*   **React 19**
*   **TypeScript**
*   **Vite**
*   **yt-dlp & FFmpeg** (For high-quality reference asset extraction)
*   **CSS 3D Transforms** (No heavy 3D libraries, purely browser-native performance)

## 📖 Educational Use
This project was built to help students visualize the "invisible" layers inside the screens they use every day. It covers the transition from analog vacuum tubes to digital self-emissive inorganic pixels.

---
Created for educational demonstration. Licensed under MIT.
