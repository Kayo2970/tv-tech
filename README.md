# Screen Tech Explorer V2

An interactive 3D and microscope-level simulation of various display technologies throughout history, from CRT to MicroLED.

## Features

- **3D Exploded View**: Rotate and explode the physical layer stack of different TV technologies.
- **Natural 16:9 Widescreen**: The interactive stack uses a native widescreen aspect ratio, perfectly reflecting the shape of real televisions.
- **Physics-Based Angle Shifting**: Realistic simulation of contrast and color degradation when viewing LCD-based screens from off-center. OLED and CRT maintain perfect images, just like in real life.
- **Microscope Mode**: Zoom 30,000x to see the actual subpixel arrangements (Triad, Stripe, Diamond, WRGB).
- **Integrated Video Simulation**: Watch a reference video play directly on the front glass of the 3D model, affected by real-time technology-specific filters.
- **Real-time Filters**: Simulate contrast, brightness, saturation, and blur characteristics for each technology.
- **Ambient Lighting Simulation**: Adjust room lighting to see how different screens handle reflections and black levels.
- **Fully Responsive**: Optimized for all screen sizes and aspect ratios, with special cinematic scaling for 16:9 monitors.

## Display Technologies Included

- **CRT (Cathode Ray Tube)**: The classic heavy tube with phosphor glow and electron guns.
- **Plasma**: Gas-discharge cells with natural motion and high contrast.
- **LCD (Liquid Crystal Display)**: The thin-film transistor standard with backlighting.
- **QLED**: Quantum Dot enhanced LCD for vibrant colors.
- **OLED**: Self-emissive organic pixels with infinite contrast.
- **Mini-LED**: High-zone local dimming for superior HDR.
- **QD-OLED**: The pinnacle of color purity and contrast.
- **MicroLED**: The future of display tech with no compromises.

## Tech Stack

- **React 19**
- **TypeScript**
- **Vite**
- **Vanilla CSS (3D Transforms & Filters)**

## Getting Started

1. `npm install`
2. `npm run dev`
