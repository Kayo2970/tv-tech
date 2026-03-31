# 📺 Display Tech Breakdown

> **Fundamental Level Physics & Component Architecture**  
> An interactive 3D web application for exploring every major display technology — from CRT to MicroLED — with real-time lighting simulation, exploded layer views, and subpixel microscopy.

---

## 🚀 Features

### 🔬 3D Exploded Layer View
- **Interactive 3D orbit** — drag to rotate, scroll-wheel / pinch to zoom
- Each layer of the display stack is rendered as an individual 3D plane with **floating labels**
- Layer labels use extruded text-shadow for depth perception
- **Layer Separation** slider to spread layers apart for detailed inspection
- **Align Center** button resets rotation without affecting zoom

### 🔭 Microscope Mode (30,000× Subpixel View)
- Switches to a magnified view of the subpixel matrix
- Shows **TRIAD**, **STRIPE**, **WRGB**, and **DIAMOND** pixel arrangements per technology
- Live video or test pattern plays behind the pixel grid overlay

### 💡 Lighting Environment Simulator
Real-world lighting scenarios that accurately affect how the display simulation renders:

| Preset | Scenario | Key Effects |
|--------|----------|-------------|
| 🎬 | **Dark Room** | Near-zero ambient, no glare, cinema-ideal |
| 🛋️ | **Living Room** | Warm ambient (~2800K), low glare |
| 💼 | **Office** | Cool fluorescent (~5500K), overhead direct light |
| 🌅 | **Golden Hour** | Warm directional sun, significant glare |
| 🌥️ | **Overcast** | Diffuse cool daylight, minimal direct |
| ☀️ | **Direct Sun** | Extreme ambient + glare — worst case scenario |

**PRO Mode** (⚙ PRO ▸ toggle) reveals manual calibration controls:
- **Ambient** — diffuse room illumination level
- **Direct Light** — point source intensity
- **Light Angle** — direction of the light source (0–360°)
- **Colour Temperature** — 2700K (warm amber) to 6500K (cool daylight)
- **Surface Glare** — specular screen reflection intensity

### 🖥️ Display Technologies Covered
10 technologies with detailed layer stacks, physics principles, pros & cons:

| Technology | Era | Key Principle |
|---|---|---|
| CRT | 1950s | Thermionic emission & phosphorescence |
| Plasma PDP | 2000s | Noble gas ionization → UV → visible |
| TN LCD | 1980s | 90° liquid crystal twist |
| IPS LCD | 1990s | In-plane crystal rotation |
| VA LCD | 1990s | Vertical alignment, high contrast |
| QLED | 2015 | Quantum dot photoluminescence |
| OLED | 2010s | Self-emissive organic compounds |
| Mini-LED | 2021 | Full-array local dimming |
| QD-OLED | 2022 | Blue OLED + QD color conversion |
| MicroLED | Future | Inorganic GaN chips, indestructible |

### 🎬 Calibration Source
Three input signals to test display rendering:
- **Video** — reference motion footage (streamed progressively from `public/`)
- **Chroma Test** — colour accuracy pattern
- **Luminance Test** — brightness/contrast pattern

---

## 🛠 Tech Stack
- **React 19** + **TypeScript** — component architecture
- **Vite 8** — blazing fast dev server with HMR
- **Pure CSS 3D transforms** — `perspective`, `preserve-3d`, `translateZ` for the exploded stack
- **ResizeObserver** — pixel-accurate stage measurement for correct 3D proportions
- **CSS custom properties** — real-time lighting overlay transitions
- **Progressive video streaming** — large assets served from `public/` (not bundled) for YouTube-style progressive playback

## 📁 Project Structure
```
tv-tech/
├── public/
│   ├── favicon.svg              # Custom TV icon (HUD aesthetic)
│   ├── icons.svg                # UI icon sprite
│   ├── reference-video.webm     # Reference video (streamed, ~100MB)
│   ├── IMG.jpg                  # Chroma test pattern
│   └── IMG 2.jpg                # Luminance test pattern
├── src/
│   ├── assets/                  # Original source assets (kept for archive)
│   ├── App.tsx                  # Main component (state, lighting model, 3D render)
│   ├── App.css                  # HUD theme, responsive layout, 3D styles
│   ├── index.css                # Global reset
│   └── main.tsx                 # React entry point
├── REFERENCE DOC/
│   ├── TV Technology Evolution and Drawbacks.pdf
│   └── yt video breef.pdf
├── index.html                   # Root HTML with SEO meta tags
├── ai_history.md                # AI-assisted development changelog
├── vite.config.ts               # Vite configuration
└── package.json
```

## 🏃 Running Locally
```bash
npm install
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) (default Vite port)

## 📐 Responsive Breakpoints
| Width | Layout |
|---|---|
| ≥ 1400px | Widescreen, 500px control panel |
| 1100–1399px | Desktop, 400px panel |
| 900–1099px | Laptop, 340px panel |
| < 900px | Tablet/phone, stacked layout |

---

## 📚 References
- *TV Technology Evolution and Drawbacks* — 21-page technical analysis (see `REFERENCE DOC/`)
- *YouTube Video Brief* — original project scope document (see `REFERENCE DOC/`)

## 📜 License
This project is for educational and portfolio purposes.
