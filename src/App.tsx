import React, { useState, useRef, useEffect } from 'react';
import './App.css';
import refVideo from './assets/reference-video.webm';

type DisplayTech = 'CRT' | 'PLASMA' | 'LCD' | 'QLED' | 'OLED' | 'MiniLED' | 'QD_OLED' | 'MicroLED';

interface Layer {
  name: string;
  description: string;
  color: string;
  thickness: number;
}

interface TechDetails {
  id: DisplayTech;
  name: string;
  year: string;
  layers: Layer[];
  pixelPattern: 'TRIAD' | 'STRIPE' | 'DIAMOND' | 'WRGB';
  pros: string[];
  cons: string[];
  angleShift: number; // 0 (none) to 2 (extreme shift)
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
    pixelPattern: 'TRIAD',
    layers: [
      { name: 'Electron Guns', description: 'Fires RGB beams', color: 'rgba(100, 100, 255, 0.3)', thickness: 50 },
      { name: 'Vacuum Tube', description: 'Airless glass envelope', color: 'rgba(200, 200, 200, 0.1)', thickness: 40 },
      { name: 'Shadow Mask', description: 'Directs beams to phosphors', color: '#333', thickness: 5 },
      { name: 'Phosphor Layer', description: 'Glows when hit by electrons', color: 'rgba(0, 255, 0, 0.5)', thickness: 10 },
      { name: 'Front Glass', description: 'Thick protective glass', color: 'rgba(255, 255, 255, 0.2)', thickness: 20 },
    ],
    pros: ['Excellent Contrast', 'Zero Motion Blur'],
    cons: ['Huge & Heavy', 'Flicker', 'Radiation'],
    angleShift: 0.1,
    filters: { contrast: 1.4, brightness: 0.8, saturate: 1.2, blur: 2, sepia: 0.2 }
  },
  PLASMA: {
    id: 'PLASMA',
    name: 'Plasma Display Panel',
    year: '2000s',
    pixelPattern: 'STRIPE',
    layers: [
      { name: 'Rear Glass', description: 'Backing substrate', color: '#222', thickness: 10 },
      { name: 'Address Electrodes', description: 'Triggers specific cells', color: '#555', thickness: 5 },
      { name: 'Gas Cells', description: 'Noble gas (Xe/Ne) discharge', color: 'rgba(100, 200, 255, 0.4)', thickness: 20 },
      { name: 'Phosphor Coating', description: 'Converts UV to Visible Light', color: 'rgba(255, 255, 255, 0.5)', thickness: 5 },
      { name: 'Front Electrodes', description: 'Sustains discharge', color: 'rgba(200, 200, 200, 0.1)', thickness: 5 },
      { name: 'Front Glass', description: 'Viewing surface', color: 'rgba(255, 255, 255, 0.2)', thickness: 10 },
    ],
    pros: ['Great Contrast', 'Natural Motion'],
    cons: ['High Heat', 'Power Hungry', 'Burn-in'],
    angleShift: 0.1,
    filters: { contrast: 1.3, brightness: 0.9, saturate: 1.3, blur: 0.5, sepia: 0 }
  },
  LCD: {
    id: 'LCD',
    name: 'Liquid Crystal Display',
    year: '1990s',
    pixelPattern: 'STRIPE',
    layers: [
      { name: 'Backlight', description: 'White LEDs or CCFL', color: '#fff', thickness: 20 },
      { name: 'Rear Polarizer', description: 'Polarizes light vertically', color: '#444', thickness: 5 },
      { name: 'TFT Glass', description: 'Transistor control layer', color: 'rgba(100, 200, 255, 0.2)', thickness: 10 },
      { name: 'Liquid Crystals', description: 'Twists light based on voltage', color: 'rgba(255, 255, 255, 0.1)', thickness: 15 },
      { name: 'Color Filter', description: 'RGB RGB RGB Filters', color: 'linear-gradient(90deg, #f00, #0f0, #00f)', thickness: 5 },
      { name: 'Front Polarizer', description: 'Blocks or allows light', color: '#444', thickness: 5 },
    ],
    pros: ['Bright', 'Thin', 'Cheap'],
    cons: ['Grey Blacks', 'Backlight Bleed', 'Viewing Angle Shift'],
    angleShift: 1.8,
    filters: { contrast: 0.8, brightness: 1.2, saturate: 0.8, blur: 0, sepia: 0 }
  },
  QLED: {
    id: 'QLED',
    name: 'Quantum Dot LCD',
    year: '2015s',
    pixelPattern: 'STRIPE',
    layers: [
      { name: 'Blue LED Backlight', description: 'High energy blue light source', color: '#00f', thickness: 20 },
      { name: 'Quantum Dot Film', description: 'Converts blue to pure Red/Green', color: 'rgba(255, 0, 255, 0.3)', thickness: 10 },
      { name: 'LCD Stack', description: 'Polarizers & Liquid Crystals', color: 'rgba(255, 255, 255, 0.2)', thickness: 30 },
      { name: 'Anti-Reflective', description: 'Glossy or Matte finish', color: 'rgba(255, 255, 255, 0.1)', thickness: 5 },
    ],
    pros: ['Vibrant Colors', 'Insanely Bright'],
    cons: ['Still has blooming', 'Not true black'],
    angleShift: 1.4,
    filters: { contrast: 1.1, brightness: 1.3, saturate: 1.5, blur: 0, sepia: 0 }
  },
  OLED: {
    id: 'OLED',
    name: 'Organic LED',
    year: '2010s',
    pixelPattern: 'DIAMOND',
    layers: [
      { name: 'Substrate', description: 'Glass or Plastic base', color: '#111', thickness: 10 },
      { name: 'TFT Layer', description: 'Controls individual pixels', color: 'rgba(100, 200, 255, 0.1)', thickness: 5 },
      { name: 'Organic Emitters', description: 'Carbon-based light layers', color: 'rgba(0, 255, 100, 0.4)', thickness: 15 },
      { name: 'Encapsulation', description: 'Protects from oxygen/moisture', color: 'rgba(255, 255, 255, 0.1)', thickness: 10 },
    ],
    pros: ['Infinite Contrast', 'Instant Response', 'Ultra-Thin'],
    cons: ['Burn-in risk', 'Lower brightness', 'Organic decay'],
    angleShift: 0.05,
    filters: { contrast: 1.5, brightness: 1.0, saturate: 1.2, blur: 0, sepia: 0 }
  },
  MicroLED: {
    id: 'MicroLED',
    name: 'MicroLED',
    year: 'Future',
    pixelPattern: 'STRIPE',
    layers: [
      { name: 'Backplane', description: 'Massive control circuit', color: '#000', thickness: 15 },
      { name: 'Micro LEDs', description: 'Inorganic tiny RGB chips', color: '#fff', thickness: 10 },
      { name: 'Protective Seal', description: 'Highly durable cover', color: 'rgba(255, 255, 255, 0.1)', thickness: 10 },
    ],
    pros: ['Perfect Blacks', 'No Burn-in', '10,000+ nits'],
    cons: ['Extreme Cost', 'Impossible to mass produce'],
    angleShift: 0.05,
    filters: { contrast: 1.6, brightness: 1.5, saturate: 1.3, blur: 0, sepia: 0 }
  },
  MiniLED: {
    id: 'MiniLED',
    name: 'Mini-LED LCD',
    year: '2021',
    pixelPattern: 'STRIPE',
    layers: [
      { name: 'Mini-LED Backlight', description: 'Thousands of tiny LED zones', color: '#fff', thickness: 20 },
      { name: 'Quantum Dot Film', description: 'Enhances color purity', color: 'rgba(255, 0, 255, 0.2)', thickness: 10 },
      { name: 'LCD Stack', description: 'Standard liquid crystal control', color: 'rgba(255, 255, 255, 0.1)', thickness: 25 },
      { name: 'Front Polarizer', description: 'Final light filter', color: '#444', thickness: 5 },
    ],
    pros: ['High Brightness', 'Great Local Dimming', 'No Burn-in'],
    cons: ['Still has some blooming', 'Thicker than OLED'],
    angleShift: 1.5,
    filters: { contrast: 1.3, brightness: 1.4, saturate: 1.3, blur: 0, sepia: 0 }
  },
  QD_OLED: {
    id: 'QD_OLED',
    name: 'Quantum Dot OLED',
    year: '2022',
    pixelPattern: 'DIAMOND',
    layers: [
      { name: 'TFT Backplane', description: 'Control circuitry', color: '#111', thickness: 10 },
      { name: 'Blue OLED Emitters', description: 'Self-emissive blue light source', color: 'rgba(0, 100, 255, 0.5)', thickness: 15 },
      { name: 'QD Color Converters', description: 'Converts blue to pure Red/Green', color: 'linear-gradient(90deg, #f00, #0f0)', thickness: 10 },
      { name: 'Encapsulation', description: 'Protects from oxygen/moisture', color: 'rgba(255, 255, 255, 0.1)', thickness: 5 },
    ],
    pros: ['Best Color Purity', 'Infinite Contrast', 'Wide Viewing Angles'],
    cons: ['Burn-in risk', 'Expensive', 'Raised blacks in bright rooms'],
    angleShift: 0.02,
    filters: { contrast: 1.5, brightness: 1.1, saturate: 1.8, blur: 0, sepia: 0 }
  }
};

// Main Application Component: Manages the interactive display technology explorer
const App: React.FC = () => {
  // State for current selected technology (e.g., CRT, OLED)
  const [tech, setTech] = useState<DisplayTech>('LCD');
  
  // State for 3D rotation of the exploded stack
  const [rotation, setRotation] = useState({ x: -15, y: -30 });
  
  // State for the Z-axis separation between layers (0 to 1.5)
  const [exploded, setExploded] = useState(0.5);
  
  // State for ambient lighting intensity (0 to 1)
  const [ambientLight, setAmbientLight] = useState(0.1);
  
  // Toggle between 3D Exploded View and 2D Microscope Subpixel View
  const [isMicroscope, setIsMicroscope] = useState(false);
  
  // State to track if the user is currently dragging the 3D canvas
  const [isDragging, setIsDragging] = useState(false);
  const dragRef = useRef<HTMLDivElement>(null);

  // Retrieve details for the currently selected technology
  const currentTech = TECH_DETAILS[tech];

  // --- ANGLE SHIFT CALCULATION ---
  // Calculates how much the current viewing angle deviates from 0,0
  const getAngleOffset = () => {
    const deviation = Math.sqrt(Math.pow(rotation.x, 2) + Math.pow(rotation.y, 2));
    // Normalize deviation to a factor that affects filters
    return Math.min(deviation / 90, 1) * currentTech.angleShift;
  };

  const angleOffset = getAngleOffset();

  // Handles 3D rotation based on mouse movement when dragging
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setRotation(prev => ({
      x: prev.x - e.movementY * 0.5,
      y: prev.y + e.movementX * 0.5
    }));
  };

  return (
    <div 
      className="app-root" 
      style={{ 
        '--ambient': ambientLight,
        backgroundColor: `rgba(0,0,0, ${1 - ambientLight})`
      } as any}
      onMouseMove={handleMouseMove}
      onMouseUp={() => setIsDragging(false)}
      onMouseLeave={() => setIsDragging(false)}
    >
      {/* Visual overlay for ambient lighting simulation */}
      <div className="ambient-overlay" style={{ opacity: ambientLight }}></div>

      <header className="main-header">
        <div className="logo">SCREEN_TECH_EXPLORER_V2</div>
        <div className="subtitle">Detailed Component Architecture & Light Pathways</div>
      </header>

      <main className="main-layout">
        {/* The 3D Interaction Stage: Where the visual simulation happens */}
        <section className="stage-area">
          {/* View Toggles: Switch between macro and micro views */}
          <div className="view-toggle">
            <button onClick={() => setIsMicroscope(false)} className={!isMicroscope ? 'active' : ''}>Exploded View</button>
            <button onClick={() => setIsMicroscope(true)} className={isMicroscope ? 'active' : ''}>Microscope (Subpixels)</button>
          </div>

          <div 
            className="interaction-canvas"
            onMouseDown={() => setIsDragging(true)}
          >
            {isMicroscope ? (
              /* Microscope View: Shows the underlying subpixel structures */
              <div className="microscope-view">
                {/* Background video simulated through the pixel structure */}
                <video 
                  src={refVideo} 
                  autoPlay 
                  loop 
                  muted 
                  className="microscope-bg-video"
                  style={{
                    filter: `
                      contrast(${currentTech.filters.contrast}) 
                      brightness(${currentTech.filters.brightness}) 
                      saturate(${currentTech.filters.saturate}) 
                      blur(${currentTech.filters.blur}px)
                      sepia(${currentTech.filters.sepia})
                    `
                  }}
                />
                <div className={`pixel-grid ${currentTech.pixelPattern}`}>
                  {[...Array(30)].map((_, i) => (
                    <div key={i} className="pixel-unit">
                      {/* Dynamic subpixel rendering based on technology pattern */}
                      <div className="sub R"></div>
                      <div className="sub G"></div>
                      {currentTech.pixelPattern === 'DIAMOND' && <div className="sub G G2"></div>}
                      <div className="sub B"></div>
                      {currentTech.pixelPattern === 'WRGB' && <div className="sub W"></div>}
                    </div>
                  ))}
                </div>
                <div className="zoom-overlay">30,000x ZOOM</div>
              </div>
            ) : (
              /* Exploded View: 3D representation of the physical layer stack */
              <div 
                className="exploded-stack"
                style={{ 
                  transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`
                }}
              >
                {currentTech.layers.map((layer, idx) => (
                  <div 
                    key={idx}
                    className="layer-plane"
                    style={{
                      transform: `translateZ(${idx * 150 * exploded}px)`,
                      background: layer.color,
                      border: `2px solid rgba(255, 255, 255, ${0.1 + (idx * 0.1)})`
                    }}
                  >
                    {/* Integrated Reference Video on the top-most layer */}
                    {idx === currentTech.layers.length - 1 && (
                      <video 
                        src={refVideo} 
                        autoPlay 
                        loop 
                        muted 
                        className="layer-video"
                        style={{
                          filter: `
                            contrast(${currentTech.filters.contrast - (angleOffset * 0.5)}) 
                            brightness(${currentTech.filters.brightness + (angleOffset * 0.3)}) 
                            saturate(${currentTech.filters.saturate - angleOffset}) 
                            blur(${currentTech.filters.blur}px)
                            sepia(${currentTech.filters.sepia})
                          `,
                          opacity: 1 - (angleOffset * 0.2)
                        }}
                      />
                    )}
                    <div className="layer-label">
                      <h3>{layer.name}</h3>
                      <p>{layer.description}</p>
                    </div>
                  </div>
                ))}
                
                {/* Light Ray Simulation: Visualizes how light travels through the stack */}
                <div className="light-path" style={{ height: `${currentTech.layers.length * 150 * exploded}px` }}></div>
              </div>
            )}
          </div>
          
          <div className="drag-hint">DRAG TO ROTATE 360°</div>
          <div className="filter-stats-stage">
            {currentTech.id} MODE ACTIVE 
            {angleOffset > 0.1 && <span className="angle-warning"> (ANGLE SHIFT DETECTED)</span>}
          </div>
        </section>

        {/* Control Side Panel: Adjust technology and simulation parameters */}
        <aside className="control-panel">
          <section className="tech-selector">
            <label>DISPLAY TECHNOLOGY</label>
            <div className="tech-grid">
              {(Object.keys(TECH_DETAILS) as DisplayTech[]).map(t => (
                <button 
                  key={t}
                  className={tech === t ? 'active' : ''}
                  onClick={() => setTech(t)}
                >
                  {t}
                </button>
              ))}
            </div>
          </section>

          <section className="info-box">
            <h2>{currentTech.name} <span className="year">{currentTech.year}</span></h2>
            <div className="pros-cons">
              <div className="col">
                <span className="label">STRENGTHS</span>
                <ul>{currentTech.pros.map(p => <li key={p}>{p}</li>)}</ul>
              </div>
              <div className="col">
                <span className="label">WEAKNESSES</span>
                <ul>{currentTech.cons.map(c => <li key={c}>{c}</li>)}</ul>
              </div>
            </div>
          </section>

          <section className="sliders">
            <div className="slider-group">
              <label>LAYER SEPARATION (EXPLOSION)</label>
              <input type="range" min="0" max="1.5" step="0.01" value={exploded} onChange={e => setExploded(Number(e.target.value))} />
            </div>
            
            <div className="slider-group">
              <label>ROOM LIGHTING (AMBIENT)</label>
              <input type="range" min="0" max="1" step="0.01" value={ambientLight} onChange={e => setAmbientLight(Number(e.target.value))} />
            </div>
          </section>

          <div className="physics-note">
            * Simulation uses real-world layer stacks for {currentTech.id}. Light absorption and refraction are simulated via CSS filters.
          </div>
        </aside>
      </main>
    </div>
  );
};

export default App;
