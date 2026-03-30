import React, { useState, useRef, useEffect } from 'react';
import './App.css';
import refVideo from './assets/reference-video.webm';
import img1 from './assets/IMG.jpg';
import img2 from './assets/IMG 2.jpg';

// ----------------------------------------------------------------
// TYPES
// ----------------------------------------------------------------
type DisplayTech = 'CRT' | 'PLASMA' | 'TN_LCD' | 'IPS_LCD' | 'VA_LCD' | 'QLED' | 'OLED' | 'MiniLED' | 'QD_OLED' | 'MicroLED';
type MediaSource  = 'VIDEO' | 'CHROMA_TEST' | 'LUMINANCE_TEST';
type LightScenario = 'CINEMA' | 'LIVING_ROOM' | 'OFFICE' | 'GOLDEN_HOUR' | 'OVERCAST' | 'DIRECT_SUN' | 'CUSTOM';

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
  principles: string;
  layers: Layer[];
  pixelPattern: 'TRIAD' | 'STRIPE' | 'DIAMOND' | 'WRGB';
  pros: string[];
  cons: string[];
  angleShift: number;
  filters: { contrast: number; brightness: number; saturate: number; blur: number; sepia: number };
}

interface LightingState {
  scenario:        LightScenario;
  ambient:         number;   // 0–1   diffuse room illumination
  directIntensity: number;   // 0–1   point/directional source strength
  directAngle:     number;   // 0–360 direction the light comes from (°)
  temperature:     number;   // 2700–6500 K colour temperature
  glare:           number;   // 0–1   surface specular reflection
}

// ----------------------------------------------------------------
// LIGHTING PRESETS  (real-world scenarios)
// ----------------------------------------------------------------
const LIGHTING_PRESETS: Record<Exclude<LightScenario,'CUSTOM'>, LightingState & { label: string; icon: string }> = {
  CINEMA:      { scenario:'CINEMA',      label:'Dark Room',   icon:'🎬', ambient:0.02, directIntensity:0.00, directAngle:45,  temperature:3200, glare:0.00 },
  LIVING_ROOM: { scenario:'LIVING_ROOM', label:'Living Room', icon:'🛋️', ambient:0.28, directIntensity:0.30, directAngle:135, temperature:2800, glare:0.06 },
  OFFICE:      { scenario:'OFFICE',      label:'Office',      icon:'💼', ambient:0.45, directIntensity:0.55, directAngle:90,  temperature:5500, glare:0.12 },
  GOLDEN_HOUR: { scenario:'GOLDEN_HOUR', label:'Golden Hour', icon:'🌅', ambient:0.35, directIntensity:0.75, directAngle:20,  temperature:2700, glare:0.32 },
  OVERCAST:    { scenario:'OVERCAST',    label:'Overcast',    icon:'🌥️', ambient:0.40, directIntensity:0.10, directAngle:90,  temperature:6200, glare:0.02 },
  DIRECT_SUN:  { scenario:'DIRECT_SUN',  label:'Direct Sun',  icon:'☀️', ambient:0.85, directIntensity:1.00, directAngle:30,  temperature:6500, glare:0.75 },
};

// ----------------------------------------------------------------
// DISPLAY TECHNOLOGY DATA
// ----------------------------------------------------------------
const TECH_DETAILS: Record<DisplayTech, TechDetails> = {
  CRT: {
    id:'CRT', name:'Cathode Ray Tube', year:'1950s',
    principles:'Thermionic emission & Phosphorescence',
    pixelPattern:'TRIAD',
    layers:[
      { name:'Electron Guns',  description:'R/G/B cathode emitters',              color:'rgba(100,100,255,0.3)', thickness:50 },
      { name:'Vacuum Tube',    description:'Focusing electromagnetic field',       color:'rgba(200,200,200,0.1)', thickness:40 },
      { name:'Shadow Mask',    description:'Physical aperture for beam alignment', color:'#333',                  thickness:5  },
      { name:'Phosphor Layer', description:'Kinetic-to-light energy conversion',  color:'rgba(0,255,0,0.5)',     thickness:10 },
      { name:'Leaded Glass',   description:'X-ray shielding & viewing surface',   color:'rgba(255,255,255,0.2)', thickness:20 },
    ],
    pros:['Zero Motion Blur','Perfect Black Levels'],
    cons:['Extreme Weight','Analog Scanlines'],
    angleShift:0.1,
    filters:{ contrast:1.4, brightness:0.8, saturate:1.2, blur:2, sepia:0.2 },
  },
  TN_LCD: {
    id:'TN_LCD', name:'Twisted Nematic LCD', year:'1980s',
    principles:'Liquid crystal twisting (90°) via electrical potential',
    pixelPattern:'STRIPE',
    layers:[
      { name:'Backlight',          description:'Uniform CCFL source',              color:'#fff',                         thickness:20 },
      { name:'Horiz. Polarizer',   description:'Filters light to horizontal wave', color:'#444',                         thickness:5  },
      { name:'TN Liquid Crystals', description:'Fastest response, narrowest twist',color:'rgba(200,255,255,0.1)',         thickness:15 },
      { name:'Vert. Polarizer',    description:'Light blocking/passing stage',     color:'#444',                         thickness:5  },
      { name:'Color Filter',       description:'Subpixel dye matrix',              color:'linear-gradient(90deg,#f00,#0f0,#00f)', thickness:5 },
    ],
    pros:['Ultra-fast Response','Low Cost'],
    cons:['Poor Viewing Angles','Weak Contrast'],
    angleShift:2.0,
    filters:{ contrast:0.7, brightness:1.3, saturate:0.7, blur:0, sepia:0 },
  },
  IPS_LCD: {
    id:'IPS_LCD', name:'In-Plane Switching LCD', year:'1990s',
    principles:'Parallel crystal rotation for improved off-axis visibility',
    pixelPattern:'STRIPE',
    layers:[
      { name:'W-LED Backlight', description:'High brightness source',             color:'#fff',                         thickness:20 },
      { name:'Dual Polarizers', description:'Phase-corrected light control',      color:'#444',                         thickness:5  },
      { name:'IPS Crystals',    description:'Lateral rotation (In-Plane)',        color:'rgba(200,200,255,0.2)',         thickness:15 },
      { name:'Color Filter',    description:'High-purity RGB mask',               color:'linear-gradient(90deg,#f00,#0f0,#00f)', thickness:5 },
    ],
    pros:['Superb Viewing Angles','Color Accuracy'],
    cons:['IPS Glow','Slower Black-to-Black'],
    angleShift:0.4,
    filters:{ contrast:0.9, brightness:1.1, saturate:1.1, blur:0, sepia:0 },
  },
  VA_LCD: {
    id:'VA_LCD', name:'Vertical Alignment LCD', year:'1990s',
    principles:'Vertical crystal orientation for superior light blocking',
    pixelPattern:'STRIPE',
    layers:[
      { name:'Backlight',         description:'Full-Array LED source',                     color:'#fff',                         thickness:20 },
      { name:'Vertical Polarizer',description:'Optimized for blocking',                    color:'#444',                         thickness:5  },
      { name:'VA Crystals',       description:'Perpendicular alignment to substrate',      color:'rgba(255,255,200,0.1)',         thickness:15 },
      { name:'Color Filter',      description:'Subpixel dye matrix',                      color:'linear-gradient(90deg,#f00,#0f0,#00f)', thickness:5 },
    ],
    pros:['Deep Blacks (3000:1+)','High Contrast'],
    cons:['Black Smearing','Gamma Shift'],
    angleShift:1.2,
    filters:{ contrast:1.3, brightness:0.9, saturate:1.0, blur:0, sepia:0 },
  },
  QLED: {
    id:'QLED', name:'Quantum Dot LCD', year:'2015s',
    principles:'Photo-luminescent nanocrystals (QD) for pure color',
    pixelPattern:'STRIPE',
    layers:[
      { name:'Blue LED Backlight', description:'High energy photon source',        color:'#00f',                 thickness:20 },
      { name:'Quantum Dot Film',   description:'Pure Red/Green re-emission',       color:'rgba(255,0,255,0.3)',   thickness:10 },
      { name:'VA/IPS LCD Stack',   description:'Polarized light modulator',        color:'rgba(255,255,255,0.2)', thickness:30 },
      { name:'Moth-eye Coating',   description:'Nano-structured anti-reflection',  color:'rgba(255,255,255,0.1)', thickness:5  },
    ],
    pros:['Extreme Peak Brightness','Wide Color Gamut'],
    cons:['Blooming/Halos','Backlight dependent'],
    angleShift:1.4,
    filters:{ contrast:1.1, brightness:1.3, saturate:1.5, blur:0, sepia:0 },
  },
  OLED: {
    id:'OLED', name:'Organic LED', year:'2010s',
    principles:'Self-emissive carbon compounds (Electroluminescence)',
    pixelPattern:'WRGB',
    layers:[
      { name:'TFT Backplane',       description:'Active-Matrix pixel logic',              color:'#111',                 thickness:10 },
      { name:'Organic Emitters',    description:'Direct light generation (no backlight)', color:'rgba(0,255,100,0.4)',   thickness:15 },
      { name:'Color Filter (WRGB)', description:'White OLED + R/G/B pass-through',       color:'rgba(255,255,255,0.1)', thickness:10 },
      { name:'Circular Polarizer',  description:'Ambient light suppression',              color:'rgba(0,0,0,0.3)',       thickness:5  },
    ],
    pros:['Infinite Contrast','Instant Pixel Response'],
    cons:['Permanent Burn-in','Organic Degradation'],
    angleShift:0.05,
    filters:{ contrast:1.5, brightness:1.0, saturate:1.2, blur:0, sepia:0 },
  },
  MiniLED: {
    id:'MiniLED', name:'Mini-LED LCD', year:'2021',
    principles:'FALD (Full Array Local Dimming) via micro-LED zones',
    pixelPattern:'STRIPE',
    layers:[
      { name:'Mini-LED Matrix',  description:'Thousands of dimmable zones', color:'#fff',                 thickness:20 },
      { name:'Diffuser Sheet',   description:'Light homogenization layer',  color:'rgba(255,255,255,0.5)', thickness:10 },
      { name:'Quantum Dot Film', description:'Spectral enhancement',         color:'rgba(255,0,255,0.2)',   thickness:10 },
      { name:'VA Panel',         description:'High-contrast light valve',    color:'rgba(255,255,255,0.1)', thickness:25 },
    ],
    pros:['OLED-like Blacks','1000+ nits HDR'],
    cons:['Zone transition visible','Thicker profile'],
    angleShift:1.5,
    filters:{ contrast:1.3, brightness:1.4, saturate:1.3, blur:0, sepia:0 },
  },
  QD_OLED: {
    id:'QD_OLED', name:'Quantum Dot OLED', year:'2022',
    principles:'Blue OLED stack + Quantum Dot color conversion',
    pixelPattern:'DIAMOND',
    layers:[
      { name:'Blue OLED Stack',    description:'High-efficiency base emission', color:'rgba(0,100,255,0.5)',            thickness:15 },
      { name:'QD Color Converters',description:'Zero dye-loss conversion',       color:'linear-gradient(90deg,#f00,#0f0)', thickness:10 },
      { name:'Glass Encapsulation',description:'Environmental barrier',          color:'rgba(255,255,255,0.1)',          thickness:5  },
    ],
    pros:['Purest Colors','Widest Viewing Angles'],
    cons:['Reflective in light','Expensive'],
    angleShift:0.02,
    filters:{ contrast:1.5, brightness:1.1, saturate:1.8, blur:0, sepia:0 },
  },
  MicroLED: {
    id:'MicroLED', name:'MicroLED', year:'Future',
    principles:'Inorganic tiny LED chips (Self-emissive)',
    pixelPattern:'STRIPE',
    layers:[
      { name:'CMOS Backplane', description:'High-speed control circuit',       color:'#000',                 thickness:15 },
      { name:'RGB MicroLEDs',  description:'Sub-100µm inorganic chips',        color:'#fff',                 thickness:10 },
      { name:'Sapphire Glass', description:'Military-grade scratch protection', color:'rgba(255,255,255,0.1)', thickness:10 },
    ],
    pros:['10,000+ Nits','Lifelong durability'],
    cons:['Manufacturing yield issue','Modular seams'],
    angleShift:0.01,
    filters:{ contrast:1.6, brightness:1.5, saturate:1.3, blur:0, sepia:0 },
  },
  PLASMA: {
    id:'PLASMA', name:'Plasma PDP', year:'2000s',
    principles:'Ionized noble gas discharge producing UV',
    pixelPattern:'STRIPE',
    layers:[
      { name:'Rear Glass',       description:'Substrate',                      color:'#222',                 thickness:10 },
      { name:'Noble Gas Cells',  description:'Xenon/Neon plasma discharge',    color:'rgba(100,200,255,0.4)', thickness:20 },
      { name:'Phosphor Coating', description:'UV-to-Visible conversion',        color:'rgba(255,255,255,0.5)', thickness:5  },
      { name:'Front Glass',      description:'Anti-glare viewing surface',      color:'rgba(255,255,255,0.2)', thickness:10 },
    ],
    pros:['Great Motion Handling','Natural Colors'],
    cons:['Heavy Power Draw','Altitude sensitive'],
    angleShift:0.1,
    filters:{ contrast:1.3, brightness:0.9, saturate:1.3, blur:0.5, sepia:0 },
  },
};

// ----------------------------------------------------------------
// COMPONENT
// ----------------------------------------------------------------
const App: React.FC = () => {
  const [tech,        setTech]        = useState<DisplayTech>('IPS_LCD');
  const [rotation,    setRotation]    = useState({ x: -15, y: -30 });
  const [exploded,    setExploded]    = useState(0.5);
  const [lighting,    setLighting]    = useState<LightingState>({ ...LIGHTING_PRESETS.CINEMA });
  const [isProMode,   setIsProMode]   = useState(false);
  const [isMicroscope,setIsMicroscope]= useState(false);
  const [isDragging,  setIsDragging]  = useState(false);
  const [mediaSource, setMediaSource] = useState<MediaSource>('VIDEO');
  const [stageDims,   setStageDims]   = useState({ w: 800, h: 450 });
  const [zoom,        setZoom]        = useState(1);

  const lastTouchRef    = useRef<{ x: number; y: number } | null>(null);
  const lastPinchDistRef= useRef<number | null>(null);
  const stageRef        = useRef<HTMLDivElement>(null);

  // Measure stage for pixel-accurate 3D dimensions
  useEffect(() => {
    const obs = new ResizeObserver(entries => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        setStageDims({ w: width, h: height });
      }
    });
    if (stageRef.current) obs.observe(stageRef.current);
    return () => obs.disconnect();
  }, []);

  const currentTech = TECH_DETAILS[tech];

  // Media source helper
  const getMediaUrl = () => {
    switch (mediaSource) {
      case 'CHROMA_TEST':    return img1;
      case 'LUMINANCE_TEST': return img2;
      default:               return refVideo;
    }
  };

  // Viewing angle offset — degrades contrast on panel types with poor off-axis performance
  const deviation   = Math.sqrt(Math.pow(rotation.x, 2) + Math.pow(rotation.y, 2));
  const angleOffset = Math.min(deviation / 90, 1) * currentTech.angleShift;

  // ---- LIGHTING MODEL ----
  // Real-world illumination → CSS filter string + overlay colours
  const computeLightingEffects = () => {
    const { ambient, directIntensity, directAngle, temperature, glare } = lighting;

    // Colour temperature mapping: 2700 K (warm/amber) → 6500 K (cool/blue)
    const tempNorm   = (temperature - 2700) / (6500 - 2700);
    const tempSepia  = (1 - tempNorm) * 0.22;
    const tempHueRot = (tempNorm - 0.5) * -22;
    const tempTint   = tempNorm < 0.5
      ? `rgba(255,150,50,${((0.5 - tempNorm) * 0.20).toFixed(2)})`
      : `rgba(130,180,255,${((tempNorm - 0.5) * 0.16).toFixed(2)})`;

    // Ambient wash degrades contrast & saturation (more light = more washed-out image)
    const contrastMod  = Math.max(0.4, 1 - ambient * 0.38);
    const brightnessMod= 1 + (ambient * 0.30 + directIntensity * 0.22);
    const saturateMod  = Math.max(0.3, 1 - ambient * 0.18);

    const displayFilter = [
      `contrast(${((currentTech.filters.contrast - angleOffset * 0.5) * contrastMod).toFixed(2)})`,
      `brightness(${((currentTech.filters.brightness + angleOffset * 0.3) * brightnessMod).toFixed(2)})`,
      `saturate(${(Math.max(0.1, currentTech.filters.saturate - angleOffset) * saturateMod).toFixed(2)})`,
      `blur(${currentTech.filters.blur}px)`,
      `sepia(${Math.min(1, currentTech.filters.sepia + tempSepia).toFixed(2)})`,
      `hue-rotate(${tempHueRot.toFixed(1)}deg)`,
    ].join(' ');

    // Directional light visually sweeps across the stage
    const dirGradient = `linear-gradient(${directAngle}deg,
      rgba(255,255,255,${(directIntensity * 0.18).toFixed(2)}) 0%,
      rgba(255,255,255,${(directIntensity * 0.05).toFixed(2)}) 45%,
      transparent 70%)`;

    return {
      displayFilter,
      bgColor:        `rgba(0,0,0,${Math.max(0, 1 - ambient * 1.3).toFixed(2)})`,
      ambientOpacity: ambient,
      dirGradient,
      tempTint,
      glareOpacity:   glare * 0.72,
    };
  };

  const lightFX = computeLightingEffects();

  // ---- INTERACTION HANDLERS ----

  // Align Center: reset rotation only — zoom intentionally preserved
  const alignCenter = () => setRotation({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setRotation(prev => ({
      x: prev.x - e.movementY * 0.5,
      y: prev.y + e.movementX * 0.5,
    }));
  };

  // Mouse wheel → zoom
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY < 0 ? 0.08 : -0.08;
    setZoom(prev => Math.min(Math.max(prev + delta, 0.3), 3));
  };

  // Touch: single-finger pan, two-finger pinch-to-zoom
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      lastPinchDistRef.current = Math.sqrt(dx * dx + dy * dy);
      lastTouchRef.current = null;
    } else {
      setIsDragging(true);
      const t = e.touches[0];
      lastTouchRef.current     = { x: t.clientX, y: t.clientY };
      lastPinchDistRef.current = null;
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 2 && lastPinchDistRef.current !== null) {
      const dx   = e.touches[0].clientX - e.touches[1].clientX;
      const dy   = e.touches[0].clientY - e.touches[1].clientY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      setZoom(prev => Math.min(Math.max(prev * (dist / lastPinchDistRef.current!), 0.3), 3));
      lastPinchDistRef.current = dist;
      return;
    }
    if (!isDragging || !lastTouchRef.current) return;
    const t  = e.touches[0];
    const dx = t.clientX - lastTouchRef.current.x;
    const dy = t.clientY - lastTouchRef.current.y;
    setRotation(prev => ({ x: prev.x - dy * 0.5, y: prev.y + dx * 0.5 }));
    lastTouchRef.current = { x: t.clientX, y: t.clientY };
  };

  // Computed 3D stack pixel size (real stage dimensions for accurate perspective)
  const stackW = stageDims.w * 0.82;
  const stackH = stackW * (9 / 16);

  // ---- RENDER ----
  return (
    <div
      className="app-root tech-schematic"
      style={{ '--ambient': lighting.ambient, backgroundColor: lightFX.bgColor } as React.CSSProperties}
      onMouseMove={handleMouseMove}
      onMouseUp={() => setIsDragging(false)}
      onMouseLeave={() => setIsDragging(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={() => setIsDragging(false)}
    >
      <div className="blueprint-grid" />

      {/* Layered lighting overlays — each handles one real-world lighting component */}
      <div className="ambient-overlay"           style={{ opacity: lightFX.ambientOpacity }} />
      <div className="directional-light-overlay" style={{ background: lightFX.dirGradient }} />
      <div className="temperature-overlay"       style={{ background: lightFX.tempTint }} />
      <div className="glare-overlay"             style={{ opacity: lightFX.glareOpacity }} />

      <header className="main-header">
        <div className="logo">DISPLAY_TECH_BREAKDOWN</div>
        <div className="subtitle">Fundamental Level Physics &amp; Component Architecture</div>
      </header>

      <main className="main-layout">
        {/* ---- LEFT: STAGE ---- */}
        <section className="stage-area" ref={stageRef}>
          <div className="view-toggle">
            <button onClick={() => setIsMicroscope(false)} className={!isMicroscope ? 'active' : ''}>Exploded View</button>
            <button onClick={() => setIsMicroscope(true)}  className={ isMicroscope ? 'active' : ''}>Microscope (Subpixels)</button>
            <button onClick={alignCenter} className="reset-btn">Align Center</button>
          </div>

          <div
            className="interaction-canvas"
            onMouseDown={() => setIsDragging(true)}
            onWheel={handleWheel}
          >
            {isMicroscope ? (
              /* ---- MICROSCOPE VIEW ---- */
              <div className="microscope-view">
                {mediaSource === 'VIDEO' ? (
                  <video
                    src={refVideo} autoPlay loop muted
                    className="microscope-bg-video"
                    style={{ filter: lightFX.displayFilter }}
                  />
                ) : (
                  <img
                    src={getMediaUrl()} alt="test-pattern"
                    className="microscope-bg-video"
                    style={{ filter: lightFX.displayFilter }}
                  />
                )}
                <div className={`pixel-grid ${currentTech.pixelPattern}`}>
                  {[...Array(30)].map((_, i) => (
                    <div key={i} className="pixel-unit">
                      <div className="sub R" />
                      <div className="sub G" />
                      {currentTech.pixelPattern === 'DIAMOND' && <div className="sub G G2" />}
                      <div className="sub B" />
                      {currentTech.pixelPattern === 'WRGB'    && <div className="sub W" />}
                    </div>
                  ))}
                </div>
                <div className="zoom-overlay">30,000× MAGNIFICATION · {mediaSource}</div>
              </div>
            ) : (
              /* ---- EXPLODED 3D STACK ---- */
              <div
                className="exploded-stack"
                style={{
                  transform: `scale(${zoom}) rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
                  width: stackW,
                  height: stackH,
                }}
              >
                {currentTech.layers.map((layer, idx) => (
                  <div
                    key={idx}
                    className="layer-plane"
                    style={{
                      transform: `translateZ(${idx * 150 * exploded}px)`,
                      background: layer.color,
                      border: `1px solid rgba(0,242,255,${0.1 + idx * 0.1})`,
                    }}
                  >
                    {/* Label floats ABOVE the layer plane */}
                    <div className="layer-label">
                      <div className="idx">0{idx + 1}</div>
                      <h3>{layer.name}</h3>
                      <p>{layer.description}</p>
                    </div>

                    {/* Video/image on the topmost layer (the screen surface) */}
                    {idx === currentTech.layers.length - 1 && (
                      mediaSource === 'VIDEO' ? (
                        <video
                          src={refVideo} autoPlay loop muted
                          className="layer-video"
                          style={{ filter: lightFX.displayFilter, opacity: 1 - angleOffset * 0.2 }}
                        />
                      ) : (
                        <img
                          src={getMediaUrl()} alt="test-pattern"
                          className="layer-video"
                          style={{ filter: lightFX.displayFilter, opacity: 1 - angleOffset * 0.2 }}
                        />
                      )
                    )}
                  </div>
                ))}
                <div className="light-path" style={{ height: `${currentTech.layers.length * 150 * exploded}px` }} />
              </div>
            )}
          </div>

          <div className="drag-hint">DRAG · SCROLL TO ZOOM · PINCH ON TOUCH</div>
          <div className="filter-stats-stage">
            <span className="tech-id">{currentTech.id}</span>
            <span className="zoom-level"> · ZOOM {zoom.toFixed(2)}×</span>
            {angleOffset > 0.1 && <span className="angle-warning"> [ANGLE_OFFSET_ACTIVE]</span>}
          </div>
        </section>

        {/* ---- RIGHT: CONTROL PANEL ---- */}
        <aside className="control-panel hud-panel">

          {/* Display technology selector */}
          <section className="tech-selector">
            <label className="hud-label">CORE ARCHITECTURE</label>
            <div className="tech-grid">
              {(Object.keys(TECH_DETAILS) as DisplayTech[]).map(t => (
                <button key={t} className={tech === t ? 'active' : ''} onClick={() => setTech(t)}>
                  {t.replace(/_/g, ' ')}
                </button>
              ))}
            </div>
          </section>

          {/* Calibration source */}
          <section className="media-selector">
            <label className="hud-label">CALIBRATION SOURCE</label>
            <div className="source-grid">
              {(['VIDEO','CHROMA_TEST','LUMINANCE_TEST'] as MediaSource[]).map(s => (
                <button key={s} className={mediaSource === s ? 'active' : ''} onClick={() => setMediaSource(s)}>
                  {s.replace(/_/g, ' ')}
                </button>
              ))}
            </div>
          </section>

          {/* Tech info */}
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

          {/* Layer separation */}
          <section className="sliders hud-sliders">
            <div className="slider-group">
              <div className="slider-header">
                <label>LAYER SEPARATION</label>
                <span className="value">{(exploded * 100).toFixed(0)}%</span>
              </div>
              <input type="range" min="0" max="1.5" step="0.01" value={exploded}
                onChange={e => setExploded(Number(e.target.value))} />
            </div>
          </section>

          {/* ---- LIGHTING ENVIRONMENT ---- */}
          <section className="lighting-panel">
            <div className="lighting-header">
              <label className="hud-label">LIGHTING ENVIRONMENT</label>
              <button
                className={`pro-toggle ${isProMode ? 'active' : ''}`}
                onClick={() => setIsProMode(v => !v)}
                title="Toggle PRO custom controls"
              >
                {isProMode ? '⚙ PRO ▾' : '⚙ PRO ▸'}
              </button>
            </div>

            {/* Active scenario badge when in custom mode */}
            {lighting.scenario === 'CUSTOM' && (
              <div className="custom-badge">✦ CUSTOM CONFIGURATION</div>
            )}

            {/* Quick preset buttons — always visible */}
            <div className="scenario-grid">
              {(Object.keys(LIGHTING_PRESETS) as Exclude<LightScenario,'CUSTOM'>[]).map(key => {
                const preset = LIGHTING_PRESETS[key];
                return (
                  <button
                    key={key}
                    className={`scenario-btn ${lighting.scenario === key ? 'active' : ''}`}
                    onClick={() => { setLighting({ ...preset }); setIsProMode(false); }}
                  >
                    <span className="scenario-icon">{preset.icon}</span>
                    <span className="scenario-name">{preset.label}</span>
                  </button>
                );
              })}
            </div>

            {/* PRO — collapsible fine-tune controls */}
            {isProMode && (
              <div className="light-controls pro-controls">
                <div className="pro-controls-header">MANUAL CALIBRATION</div>
                {[
                  { key:'ambient',         label:'AMBIENT',       desc:'room diffuse',   min:0,    max:1,    step:0.01, fmt:(v:number)=>`${Math.round(v*100)}%`  },
                  { key:'directIntensity', label:'DIRECT LIGHT',  desc:'point source',   min:0,    max:1,    step:0.01, fmt:(v:number)=>`${Math.round(v*100)}%`  },
                  { key:'directAngle',     label:'LIGHT ANGLE',   desc:'direction',      min:0,    max:360,  step:1,    fmt:(v:number)=>`${Math.round(v)}°`       },
                  { key:'temperature',     label:'COLOUR TEMP',   desc:'Kelvin',         min:2700, max:6500, step:50,   fmt:(v:number)=>`${Math.round(v)}K`       },
                  { key:'glare',           label:'SURFACE GLARE', desc:'reflection',     min:0,    max:1,    step:0.01, fmt:(v:number)=>`${Math.round(v*100)}%`  },
                ].map(({ key, label, desc, min, max, step, fmt }) => (
                  <div className="slider-group" key={key}>
                    <div className="slider-header">
                      <label>{label} <span className="light-desc">{desc}</span></label>
                      <span className="value">{fmt((lighting as unknown as Record<string,number>)[key])}</span>
                    </div>
                    <input
                      type="range" min={min} max={max} step={step}
                      value={(lighting as unknown as Record<string,number>)[key]}
                      onChange={e => setLighting(l => ({ ...l, scenario:'CUSTOM', [key]: +e.target.value }))}
                    />
                  </div>
                ))}
              </div>
            )}
          </section>

          <div className="physics-note">
            * SCHEMATIC DATA: Simulating photon modulation, polarization physics, crystal birefringence,
            and atomic-level emission across the full display technology stack.
            Lighting model accounts for ambient wash, direct illumination, colour temperature (K), and surface glare.
          </div>
        </aside>
      </main>
    </div>
  );
};

export default App;
