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
*   **MicroLED (Future):** Inorganic tiny LED chips for extreme brightness.

### 2. Microscope Mode (Sub-Pixel Zoom)
Toggle to see the actual arrangement of RGB lights:
*   **Triad Pattern:** The circular phosphor arrangement used in CRTs.
*   **Diamond Pixel:** The modern sub-pixel layout found in high-end OLED smartphones.
*   **RGB Stripe:** The standard vertical bar arrangement used in most LCDs.

### 3. Interactive Physics
*   **Layer Separation:** Use the slider to pull the components apart and identify each layer.
*   **Ambient Lighting:** Simulate a bright classroom vs. a dark home theater to see how glare affects different tech.
*   **Viewing Angles:** Rotate the stack to see how LCDs lose contrast compared to OLEDs.

## 🧰 Tech Stack
*   **React 19**
*   **TypeScript**
*   **Vite**
*   **CSS 3D Transforms** (No heavy 3D libraries, purely browser-native performance)

## 📖 Educational Use
This project was built to help students visualize the "invisible" layers inside the screens they use every day. It covers the transition from analog vacuum tubes to digital self-emissive inorganic pixels.

---
Created for educational demonstration. Licensed under MIT.
