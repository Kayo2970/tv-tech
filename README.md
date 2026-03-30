# Display Tech Breakdown (Fundamental Level)

An interactive technical breakdown of display hardware, inspired by high-fidelity educational visualizations. This tool explores the fundamental physics and component architecture of screen technologies from CRT to future MicroLED.

## Enhanced Features (V3)

- **Technical Schematic UI**: A high-tech "HUD" (Heads-Up Display) aesthetic featuring blueprint grids, data readouts, and monospace typography.
- **Expanded LCD Physics**: Deep-dive into specific LCD sub-types (**TN**, **IPS**, **VA**) with distinct crystal rotation physics and viewing angle characteristics.
- **Fundamental Principles**: Each technology includes a breakdown of its core physical principle (e.g., *Thermionic Emission*, *Vertical Alignment*, *Electroluminescence*).
- **Physics-Based Angle Shifting**: Real-time simulation of contrast and color degradation. LCD-based screens wash out based on their panel type, while self-emissive screens maintain perfect images.
- **3D Exploded Schematic**: Inspect the internal architecture layer-by-layer with a native 16:9 widescreen aspect ratio.
- **Microscope Magnification (30,000x)**: Inspect subpixel arrangements including TRIAD, STRIPE, DIAMOND, and WRGB patterns.
- **Integrated Light-Path Simulation**: Visualizes how light waves travel through polarizers and color filters.

## Hardware Breakdown Included

- **Legacy**: CRT (Cathode Ray Tube), Plasma PDP.
- **LCD Variations**: TN (Twisted Nematic), IPS (In-Plane Switching), VA (Vertical Alignment).
- **Advanced LCD**: QLED (Quantum Dot), Mini-LED (FALD).
- **Self-Emissive**: OLED (Organic LED), QD-OLED, MicroLED.

## Tech Stack

- **React 19**
- **TypeScript**
- **Vite**
- **Vanilla CSS (3D Transforms & Physics-based Filters)**

## Getting Started

1. `npm install`
2. `npm run dev`
