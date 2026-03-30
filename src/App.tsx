import React, { useState, useRef } from 'react';
import './App.css';
import refVideo from './assets/reference-video.webm';

// Added specific LCD sub-types (TN, IPS, VA) as discussed in the technical breakdown video
type DisplayTech = 'CRT' | 'PLASMA' | 'TN_LCD' | 'IPS_LCD' | 'VA_LCD' | 'QLED' | 'OLED' | 'MiniLED' | 'QD_OLED' | 'MicroLED';

interface Layer {
  name: string;
  description: string;
  color: string;
  thickness: number;
}

// Configuration for each display technology
interface TechDetails {
  id: DisplayTech;
  name: string;
  year: string;
  principles: string; // Fundamental physical principle (e.g., Electroluminescence)
  layers: Layer[];
  pixelPattern: 'TRIAD' | 'STRIPE' | 'DIAMOND' | 'WRGB';
  pros: string[];
  cons: string[];
  // angleShift: Coefficient simulating how much color/contrast degrades at off-angles.
  angleShift: number; 
  filters: {
    contrast: number;
    brightness: number;
    saturate: number;
    blur: number;
    sepia: number;
  };
}

const TECH_DETAILS: Record<DisplayTech, TechDetails> = {
  CRT: {
    id: 'CRT',
    name: 'Cathode Ray Tube',
    year: '1950s',
    principles: 'Thermionic emission & Phosphorescence',
    pixelPattern: 'TRIAD',
    layers: [
      { name: 'Electron Guns', description: 'R/G/B cathode emitters', color: 'rgba(100, 100, 255, 0.3)', thickness: 50 },
      { name: 'Vacuum Tube', description: 'Focusing electromagnetic field', color: 'rgba(200, 200, 200, 0.1)', thickness: 40 },
      { name: 'Shadow Mask', description: 'Physical aperture for beam alignment', color: '#333', thickness: 5 },
      { name: 'Phosphor Layer', description: 'Kinetic-to-light energy conversion', color: 'rgba(0, 255, 0, 0.5)', thickness: 10 },
      { name: 'Leaded Glass', description: 'X-ray shielding & viewing surface', color: 'rgba(255, 255, 255, 0.2)', thickness: 20 },
    ],
    pros: ['Zero Motion Blur', 'Perfect Black Levels'],
    cons: ['Extreme Weight', 'Analog Scanlines'],
    angleShift: 0.1,
    filters: { contrast: 1.4, brightness: 0.8, saturate: 1.2, blur: 2, sepia: 0.2 }
  },
  TN_LCD: {
    id: 'TN_LCD',
    name: 'Twisted Nematic LCD',
    year: '1980s',
    principles: 'Liquid crystal twisting (90°) via electrical potential',
    pixelPattern: 'STRIPE',
    layers: [
      { name: 'Backlight', description: 'Uniform CCFL source', color: '#fff', thickness: 20 },
      { name: 'Horiz. Polarizer', description: 'Filters light to horizontal wave', color: '#444', thickness: 5 },
      { name: 'TN Liquid Crystals', description: 'Fastest response, narrowest twist', color: 'rgba(200, 255, 255, 0.1)', thickness: 15 },
      { name: 'Vert. Polarizer', description: 'Light blocking/passing stage', color: '#444', thickness: 5 },
      { name: 'Color Filter', description: 'Subpixel dye matrix', color: 'linear-gradient(90deg, #f00, #0f0, #00f)', thickness: 5 },
    ],
    pros: ['Ultra-fast Response', 'Low Cost'],
    cons: ['Poor Viewing Angles', 'Weak Contrast'],
    angleShift: 2.0,
    filters: { contrast: 0.7, brightness: 1.3, saturate: 0.7, blur: 0, sepia: 0 }
  },
  IPS_LCD: {
    id: 'IPS_LCD',
    name: 'In-Plane Switching LCD',
    year: '1990s',
    principles: 'Parallel crystal rotation for improved off-axis visibility',
    pixelPattern: 'STRIPE',
    layers: [
      { name: 'W-LED Backlight', description: 'High brightness source', color: '#fff', thickness: 20 },
      { name: 'Dual Polarizers', description: 'Phase-corrected light control', color: '#444', thickness: 5 },
      { name: 'IPS Crystals', description: 'Lateral rotation (In-Plane)', color: 'rgba(200, 200, 255, 0.2)', thickness: 15 },
      { name: 'Color Filter', description: 'High-purity RGB mask', color: 'linear-gradient(90deg, #f00, #0f0, #00f)', thickness: 5 },
    ],
    pros: ['Superb Viewing Angles', 'Color Accuracy'],
    cons: ['IPS Glow', 'Slower Black-to-Black'],
    angleShift: 0.4,
    filters: { contrast: 0.9, brightness: 1.1, saturate: 1.1, blur: 0, sepia: 0 }
  },
  VA_LCD: {
    id: 'VA_LCD',
    name: 'Vertical Alignment LCD',
    year: '1990s',
    principles: 'Vertical crystal orientation for superior light blocking',
    pixelPattern: 'STRIPE',
    layers: [
      { name: 'Backlight', description: 'Full-Array LED source', color: '#fff', thickness: 20 },
      { name: 'Vertical Polarizer', description: 'Optimized for blocking', color: '#444', thickness: 5 },
      { name: 'VA Crystals', description: 'Perpendicular alignment to substrate', color: 'rgba(255, 255, 200, 0.1)', thickness: 15 },
      { name: 'Color Filter', description: 'Subpixel dye matrix', color: 'linear-gradient(90deg, #f00, #0f0, #00f)', thickness: 5 },
    ],
    pros: ['Deep Blacks (3000:1+)', 'High Contrast'],
    cons: ['Black Smearing', 'Gamma Shift'],
    angleShift: 1.2,
    filters: { contrast: 1.3, brightness: 0.9, saturate: 1.0, blur: 0, sepia: 0 }
  },
  QLED: {
    id: 'QLED',
    name: 'Quantum Dot LCD',
    year: '2015s',
    principles: 'Photo-luminescent nanocrystals (QD) for pure color',
    pixelPattern: 'STRIPE',
    layers: [
      { name: 'Blue LED Backlight', description: 'High energy photon source', color: '#00f', thickness: 20 },
      { name: 'Quantum Dot Film', description: 'Pure Red/Green re-emission', color: 'rgba(255, 0, 255, 0.3)', thickness: 10 },
      { name: 'VA/IPS LCD Stack', description: 'Polarized light modulator', color: 'rgba(255, 255, 255, 0.2)', thickness: 30 },
      { name: 'Moth-eye Coating', description: 'Nano-structured anti-reflection', color: 'rgba(255, 255, 255, 0.1)', thickness: 5 },
    ],
    pros: ['Extreme Peak Brightness', 'Wide Color Gamut'],
    cons: ['Blooming/Halos', 'Backlight dependent'],
    angleShift: 1.4,
    filters: { contrast: 1.1, brightness: 1.3, saturate: 1.5, blur: 0, sepia: 0 }
  },
  OLED: {
    id: 'OLED',
    name: 'Organic LED',
    year: '2010s',
    principles: 'Self-emissive carbon compounds (Electroluminescence)',
    pixelPattern: 'WRGB',
    layers: [
      { name: 'TFT Backplane', description: 'Active-Matrix pixel logic', color: '#111', thickness: 10 },
      { name: 'Organic Emitters', description: 'Direct light generation (no backlight)', color: 'rgba(0, 255, 100, 0.4)', thickness: 15 },
      { name: 'Color Filter (WRGB)', description: 'White OLED + R/G/B pass-through', color: 'rgba(255, 255, 255, 0.1)', thickness: 10 },
      { name: 'Circular Polarizer', description: 'Ambient light suppression', color: 'rgba(0, 0, 0, 0.3)', thickness: 5 },
    ],
    pros: ['Infinite Contrast', 'Instant Pixel Response'],
    cons: ['Permanent Burn-in', 'Organic Degradation'],
    angleShift: 0.05,
    filters: { contrast: 1.5, brightness: 1.0, saturate: 1.2, blur: 0, sepia: 0 }
  },
  MiniLED: {
    id: 'MiniLED',
    name: 'Mini-LED LCD',
    year: '2021',
    principles: 'FALD (Full Array Local Dimming) via micro-LED zones',
    pixelPattern: 'STRIPE',
    layers: [
      { name: 'Mini-LED Matrix', description: 'Thousands of dimmable zones', color: '#fff', thickness: 20 },
      { name: 'Diffuser Sheet', description: 'Light homogenization layer', color: 'rgba(255, 255, 255, 0.5)', thickness: 10 },
      { name: 'Quantum Dot Film', description: 'Spectral enhancement', color: 'rgba(255, 0, 255, 0.2)', thickness: 10 },
      { name: 'VA Panel', description: 'High-contrast light valve', color: 'rgba(255, 255, 255, 0.1)', thickness: 25 },
    ],
    pros: ['OLED-like Blacks', '1000+ nits HDR'],
    cons: ['Zone transition visible', 'Thicker profile'],
    angleShift: 1.5,
    filters: { contrast: 1.3, brightness: 1.4, saturate: 1.3, blur: 0, sepia: 0 }
  },
  QD_OLED: {
    id: 'QD_OLED',
    name: 'Quantum Dot OLED',
    year: '2022',
    principles: 'Blue OLED stack + Quantum Dot color conversion',
    pixelPattern: 'DIAMOND',
    layers: [
      { name: 'Blue OLED Stack', description: 'High-efficiency base emission', color: 'rgba(0, 100, 255, 0.5)', thickness: 15 },
      { name: 'QD Color Converters', description: 'Zero dye-loss conversion', color: 'linear-gradient(90deg, #f00, #0f0)', thickness: 10 },
      { name: 'Glass Encapsulation', description: 'Environmental barrier', color: 'rgba(255, 255, 255, 0.1)', thickness: 5 },
    ],
    pros: ['Purest Colors', 'Widest Viewing Angles'],
    cons: ['Reflective in light', 'Expensive'],
    angleShift: 0.02,
    filters: { contrast: 1.5, brightness: 1.1, saturate: 1.8, blur: 0, sepia: 0 }
  },
  MicroLED: {
    id: 'MicroLED',
    name: 'MicroLED',
    year: 'Future',
    principles: 'Inorganic tiny LED chips (Self-emissive)',
    pixelPattern: 'STRIPE',
    layers: [
      { name: 'CMOS Backplane', description: 'High-speed control circuit', color: '#000', thickness: 15 },
      { name: 'RGB MicroLEDs', description: 'Sub-100um inorganic chips', color: '#fff', thickness: 10 },
      { name: 'Sapphire Glass', description: 'Military-grade protection', color: 'rgba(255, 255, 255, 0.1)', thickness: 10 },
    ],
    pros: ['10,000+ Nits', 'Lifelong durability'],
    cons: ['Manufacturing yield issue', 'Modular seams'],
    angleShift: 0.01,
    filters: { contrast: 1.6, brightness: 1.5, saturate: 1.3, blur: 0, sepia: 0 }
  },
  PLASMA: {
    id: 'PLASMA',
    name: 'Plasma PDP',
    year: '2000s',
    principles: 'Ionized noble gas discharge producing UV',
    pixelPattern: 'STRIPE',
    layers: [
      { name: 'Rear Glass', description: 'Substrate', color: '#222', thickness: 10 },
      { name: 'Noble Gas Cells', description: 'Xenon/Neon plasma discharge', color: 'rgba(100, 200, 255, 0.4)', thickness: 20 },
      { name: 'Phosphor coating', description: 'UV-to-Visible conversion', color: 'rgba(255, 255, 255, 0.5)', thickness: 5 },
      { name: 'Front Glass', description: 'Viewing surface', color: 'rgba(255, 255, 255, 0.2)', thickness: 10 },
    ],
    pros: ['Great Motion Handling', 'Natural Colors'],
    cons: ['Heavy Power Draw', 'Altitude sensitive'],
    angleShift: 0.1,
    filters: { contrast: 1.3, brightness: 0.9, saturate: 1.3, blur: 0.5, sepia: 0 }
  }
};

const App: React.FC = () => {
  const [tech, setTech] = useState<DisplayTech>('IPS_LCD');
  const [rotation, setRotation] = useState({ x: -15, y: -30 });
  const [exploded, setExploded] = useState(0.5);
  const [ambientLight, setAmbientLight] = useState(0.1);
  const [isMicroscope, setIsMicroscope] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const lastTouchRef = useRef<{ x: number; y: number } | null>(null);

  const currentTech = TECH_DETAILS[tech];

  const getAngleOffset = () => {
    const deviation = Math.sqrt(Math.pow(rotation.x, 2) + Math.pow(rotation.y, 2));
    return Math.min(deviation / 90, 1) * currentTech.angleShift;
  };

  const angleOffset = getAngleOffset();

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setRotation(prev => ({
      x: prev.x - e.movementY * 0.5,
      y: prev.y + e.movementX * 0.5
    }));
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    const touch = e.touches[0];
    lastTouchRef.current = { x: touch.clientX, y: touch.clientY };
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || !lastTouchRef.current) return;
    const touch = e.touches[0];
    const dx = touch.clientX - lastTouchRef.current.x;
    const dy = touch.clientY - lastTouchRef.current.y;
    setRotation(prev => ({
      x: prev.x - dy * 0.5,
      y: prev.y + dx * 0.5
    }));
    lastTouchRef.current = { x: touch.clientX, y: touch.clientY };
  };

  return (
    <div 
      className="app-root tech-schematic" 
      style={{ '--ambient': ambientLight, backgroundColor: `rgba(0,0,0, ${1 - ambientLight})` } as any}
      onMouseMove={handleMouseMove}
      onMouseUp={() => setIsDragging(false)}
      onMouseLeave={() => setIsDragging(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={() => setIsDragging(false)}
    >
      <div className="blueprint-grid"></div>
      <div className="ambient-overlay" style={{ opacity: ambientLight }}></div>

      <header className="main-header">
        <div className="logo">DISPLAY_TECH_BREAKDOWN</div>
        <div className="subtitle">Fundamental Level Physics & Component Architecture</div>
      </header>

      <main className="main-layout">
        <section className="stage-area">
          <div className="view-toggle">
            <button onClick={() => setIsMicroscope(false)} className={!isMicroscope ? 'active' : ''}>Exploded View</button>
            <button onClick={() => setIsMicroscope(true)} className={isMicroscope ? 'active' : ''}>Microscope (Subpixels)</button>
          </div>

          <div className="interaction-canvas" onMouseDown={() => setIsDragging(true)}>
            {isMicroscope ? (
              <div className="microscope-view">
                <video src={refVideo} autoPlay loop muted className="microscope-bg-video"
                  style={{
                    filter: `contrast(${currentTech.filters.contrast}) brightness(${currentTech.filters.brightness}) saturate(${currentTech.filters.saturate}) blur(${currentTech.filters.blur}px) sepia(${currentTech.filters.sepia})`
                  }}
                />
                <div className={`pixel-grid ${currentTech.pixelPattern}`}>
                  {[...Array(30)].map((_, i) => (
                    <div key={i} className="pixel-unit">
                      <div className="sub R"></div>
                      <div className="sub G"></div>
                      {currentTech.pixelPattern === 'DIAMOND' && <div className="sub G G2"></div>}
                      <div className="sub B"></div>
                      {currentTech.pixelPattern === 'WRGB' && <div className="sub W"></div>}
                    </div>
                  ))}
                </div>
                <div className="zoom-overlay">30,000x MAGNIFICATION</div>
              </div>
            ) : (
              <div className="exploded-stack" style={{ transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)` }}>
                {currentTech.layers.map((layer, idx) => (
                  <div key={idx} className="layer-plane"
                    style={{
                      transform: `translateZ(${idx * 150 * exploded}px)`,
                      background: layer.color,
                      border: `1px solid rgba(0, 242, 255, ${0.1 + (idx * 0.1)})`
                    }}
                  >
                    {idx === currentTech.layers.length - 1 && (
                      <video src={refVideo} autoPlay loop muted className="layer-video"
                        style={{
                          filter: `contrast(${currentTech.filters.contrast - (angleOffset * 0.5)}) brightness(${currentTech.filters.brightness + (angleOffset * 0.3)}) saturate(${currentTech.filters.saturate - angleOffset})`,
                          opacity: 1 - (angleOffset * 0.2)
                        }}
                      />
                    )}
                    <div className="layer-label">
                      <div className="idx">0{idx + 1}</div>
                      <h3>{layer.name}</h3>
                      <p>{layer.description}</p>
                    </div>
                  </div>
                ))}
                <div className="light-path" style={{ height: `${currentTech.layers.length * 150 * exploded}px` }}></div>
              </div>
            )}
          </div>
          
          <div className="drag-hint">DRAG TO INSPECT INTERNAL ARCHITECTURE</div>
          <div className="filter-stats-stage">
            <span className="tech-id">{currentTech.id}</span>
            {angleOffset > 0.1 && <span className="angle-warning"> [ANGLE_OFFSET_ACTIVE]</span>}
          </div>
        </section>

        <aside className="control-panel hud-panel">
          <section className="tech-selector">
            <label className="hud-label">CORE ARCHITECTURE</label>
            <div className="tech-grid">
              {(Object.keys(TECH_DETAILS) as DisplayTech[]).map(t => (
                <button key={t} className={tech === t ? 'active' : ''} onClick={() => setTech(t)}>{t.replace('_', ' ')}</button>
              ))}
            </div>
          </section>

          <section className="info-box schematic-info">
            <div className="header-row">
              <h2>{currentTech.name}</h2>
              <span className="year-badge">{currentTech.year}</span>
            </div>
            <div className="principle-box">
              <span className="label">FUNDAMENTAL PRINCIPLE</span>
              <p>{currentTech.principles}</p>
            </div>
            <div className="pros-cons">
              <div className="col">
                <span className="label">CHARACTERISTICS</span>
                <ul>{currentTech.pros.map(p => <li key={p}>{p}</li>)}</ul>
              </div>
              <div className="col">
                <span className="label">DRAWBACKS</span>
                <ul>{currentTech.cons.map(c => <li key={c}>{c}</li>)}</ul>
              </div>
            </div>
          </section>

          <section className="sliders hud-sliders">
            <div className="slider-group">
              <div className="slider-header">
                <label>LAYER SEPARATION</label>
                <span className="value">{(exploded * 100).toFixed(0)}%</span>
              </div>
              <input type="range" min="0" max="1.5" step="0.01" value={exploded} onChange={e => setExploded(Number(e.target.value))} />
            </div>
            
            <div className="slider-group">
              <div className="slider-header">
                <label>AMBIENT INTENSITY</label>
                <span className="value">{(ambientLight * 100).toFixed(0)}%</span>
              </div>
              <input type="range" min="0" max="1" step="0.01" value={ambientLight} onChange={e => setAmbientLight(Number(e.target.value))} />
            </div>
          </section>

          <div className="physics-note">
            * SCHEMATIC DATA: Simulating light modulations, polarization filters, and atomic-level emission characteristics based on fundamental hardware principles.
          </div>
        </aside>
      </main>
    </div>
  );
};

export default App;
