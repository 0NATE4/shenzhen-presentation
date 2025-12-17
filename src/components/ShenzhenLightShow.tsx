import { useMemo } from 'react';
import { motion } from 'framer-motion';

// --- Utility: Random Generators ---
const randomRange = (min: number, max: number) => Math.random() * (max - min) + min;

// --- Sub-Components ---

interface LaserBeamProps {
  x: string | number;
  y: string | number;
  angle: number;
  color: string;
  delay: number;
  duration: number;
}

// Improved Laser Beam: Fades to transparent, fans out, and SWEEPS
const LaserBeam = ({ x, y, angle, color, delay, duration }: LaserBeamProps) => {
  
  // Randomize sweep parameters for each beam so they don't move in unison
  const sweepDuration = useMemo(() => randomRange(4, 9), []); 
  const sweepOffset = useMemo(() => randomRange(-10, 10), []); // Random start rotation offset

  return (
    <motion.div
      style={{
        position: 'absolute',
        left: x,
        bottom: y,
        width: '4px',
        height: '150vh', // Longer to go off screen
        originY: 1, // Transform origin: Bottom Center
        // Gradient: Strong color at bottom, fading to transparent at top
        background: `linear-gradient(to top, ${color} 0%, ${color} 20%, transparent 80%)`,
        zIndex: 5, 
        translateX: "-50%", // Center horizontally
        filter: 'blur(3px) drop-shadow(0 0 15px ' + color + ')', // Enhanced Bloom
      }}
      initial={{ scaleY: 0, opacity: 0, rotate: angle }}
      animate={{
        scaleY: [0, 1, 1.2],
        opacity: [0, 1, 0],
        rotate: [angle - 30, angle + 30] // Sweep range
      }}
      transition={{
        // Rapid shooting animation
        scaleY: { duration: duration, delay: delay, repeat: Infinity, repeatDelay: randomRange(0.5, 3), ease: "easeOut" },
        opacity: { duration: duration, delay: delay, repeat: Infinity, repeatDelay: randomRange(0.5, 3), ease: "easeOut" },
        // Slow sweeping animation (Searchlight effect)
        rotate: { 
          duration: sweepDuration, 
          delay: Math.abs(sweepOffset), // Randomize start time
          repeat: Infinity, 
          repeatType: "reverse", // Sweep back and forth
          ease: "easeInOut" 
        } 
      }}
    />
  );
};

// Floating particles/stars
const Particle = ({ delay }: { delay: number }) => (
  <motion.div
    className="absolute rounded-full bg-white"
    style={{
      width: Math.random() * 2 + 1 + 'px',
      height: Math.random() * 2 + 1 + 'px',
      left: Math.random() * 100 + '%',
      top: Math.random() * 60 + '%', // Keep mostly in sky
      opacity: 0.3,
    }}
    animate={{
      y: [0, -30, 0],
      opacity: [0.1, 0.6, 0.1],
    }}
    transition={{
      duration: Math.random() * 5 + 3,
      repeat: Infinity,
      delay: delay,
    }}
  />
);

// --- Main Component ---

interface LightShowProps {
  isActive?: boolean;
}

export default function ShenzhenLightShow({ isActive = true }: LightShowProps) {
  // 1. Generate "Filler" Cityscape (The Density)
  const fillerBuildings = useMemo(() => {
    const buildings = [];
    const count = 40; // Dense skyline
    for (let i = 0; i < count; i++) {
      const height = randomRange(150, 600);
      const width = randomRange(40, 100);
      const x = randomRange(-50, 2000); // Spread across wide SVG canvas
      buildings.push({
        id: i,
        x,
        y: 1080 - height, // Align to bottom
        width,
        height,
        opacity: randomRange(0.6, 0.9),
        // Varied dark blues/purples
        color: i % 2 === 0 ? '#1e1b4b' : '#312e81', 
        hasWindows: true, // All have windows now for texture
      });
    }
    return buildings.sort((a, b) => a.y - b.y); // Taller in back
  }, []);

  // 2. Generate Lasers - SHINING FROM THE GROUND
  const lasers = useMemo(() => {
    const beams = [];
    const colors = ['#00ffff', '#ff00ff', '#e0e7ff', '#fbbf24']; 
    
    // Left Side Ground Lasers
    for (let i = 0; i < 8; i++) {
      beams.push({
        id: `laser-r-${i}`,
        x: randomRange(20, 45) + '%', // Spread across the left side
        y: '0%', // Start from the bottom of the screen
        angle: randomRange(-20, 5), // Angle slightly right
        color: colors[Math.floor(Math.random() * colors.length)],
        delay: randomRange(0, 5),
        duration: randomRange(0.8, 1.5), 
      });
    }

    // Right Side Ground Lasers
    for (let i = 0; i < 8; i++) {
      beams.push({
        id: `laser-l-${i}`,
        x: randomRange(55, 80) + '%', // Spread across the right side
        y: '0%', // Start from the bottom of the screen
        angle: randomRange(-5, 20), // Angle slightly left
        color: colors[Math.floor(Math.random() * colors.length)],
        delay: randomRange(0, 5),
        duration: randomRange(0.8, 1.5),
      });
    }
    return beams;
  }, []);

  // --- PATH DEFINITION FOR CITIZEN CENTER ---
  // A smooth, majestic arch where the center is the HIGHEST point.
  // Updated: Fills screen width (0-1920) and ends curve upwards to ~half peak height.
  // Peak Y: 240. Ends Y: ~330 (approx half height relative to a base of ~420-500).
  const citizenCenterPath = `
    M 0 330 
    C 400 330, 600 240, 960 240
    S 1520 330, 1920 330
    L 1920 410
    C 1520 410, 1320 320, 960 320
    S 400 410, 0 410
    Z
  `;

  const citizenCenterStroke = `
    M 0 330 
    C 400 330, 600 240, 960 240
    S 1520 330, 1920 330
  `;

  // --- PATH DEFINITION FOR LEFT TOWER (Restored Curve + Flat Top + Grounded) ---
  // M 0 1080 (Bottom Left Ground)
  // Q 30 500 60 100 (Curve to Top Left Shoulder)
  // L 140 100 (Flat Horizontal Top)
  // Q 170 500 200 1080 (Curve to Bottom Right Ground)
  const leftTowerPath = `
    M 0 1080 
    Q 30 500 60 100 
    L 140 100 
    Q 170 500 200 1080 
    Z
  `;

  // --- PATH DEFINITION FOR RIGHT TOWER (Ping An - Grounded) ---
  const rightTowerPath = `
    M 0 1080 
    L 0 200 
    L 100 0 
    L 200 200 
    L 200 1080 
    Z
  `;

  return (
    <section className="snap-section relative w-full h-screen overflow-hidden bg-slate-950 font-sans">
      
      {/* 1. Deep Sky Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-[#0f0c29] to-[#302b63] z-0">
         {/* Stars - Only render if active */}
        {isActive && Array.from({ length: 40 }).map((_, i) => (
          <Particle key={i} delay={Math.random() * 5} />
        ))}
      </div>

      {/* 2. Atmospheric Fog/Glow behind buildings */}
      <div className="absolute bottom-0 w-full h-2/3 bg-gradient-to-t from-purple-900/40 via-blue-900/10 to-transparent z-0 blur-[100px] pointer-events-none" />

      {/* 3. Lasers (Layered between sky and main foreground, but physically drawn absolute) */}
      <div className="absolute inset-0 z-10 pointer-events-none mix-blend-screen">
        {isActive && lasers.map((laser) => (
          <LaserBeam key={laser.id} {...laser} />
        ))}
      </div>

      {/* 4. The Cityscape SVG */}
      <div className="absolute inset-0 z-20 flex items-end justify-center pointer-events-none">
        <svg
          viewBox="0 0 1920 1080"
          className="w-full h-full object-cover object-bottom"
          preserveAspectRatio="xMidYMax slice"
        >
          <defs>
            {/* --- PATTERNS --- */}
            <pattern id="denseWindows" x="0" y="0" width="10" height="14" patternUnits="userSpaceOnUse">
               <rect width="10" height="14" fillOpacity="0" /> 
               <rect x="2" y="2" width="6" height="8" fill="#a5f3fc" fillOpacity="0.2" />
               <rect x="4" y="4" width="2" height="4" fill="#a5f3fc" fillOpacity="0.3" />
            </pattern>

            <pattern id="pixelGrid" x="0" y="0" width="8" height="8" patternUnits="userSpaceOnUse">
               <rect width="8" height="8" fill="none"/>
               <rect x="0" y="0" width="2" height="2" fill="black" opacity="0.5" />
               <rect x="4" y="4" width="2" height="2" fill="black" opacity="0.5" />
            </pattern>

            {/* --- GRADIENTS --- */}
            <linearGradient id="centerWingGrad" x1="0" y1="0" x2="1" y2="0">
              <motion.stop offset="0%" animate={{ stopColor: ["#ef4444", "#22d3ee", "#a855f7", "#ef4444"] }} transition={{ duration: 4, repeat: Infinity, ease: "linear" }} />
              <motion.stop offset="50%" animate={{ stopColor: ["#fbbf24", "#ef4444", "#22d3ee", "#fbbf24"] }} transition={{ duration: 4, repeat: Infinity, ease: "linear" }} />
              <motion.stop offset="100%" animate={{ stopColor: ["#ef4444", "#22d3ee", "#a855f7", "#ef4444"] }} transition={{ duration: 4, repeat: Infinity, ease: "linear" }} />
            </linearGradient>

            <linearGradient id="screenGradient" x1="0" y1="1" x2="0" y2="0">
               {/* Multi-stop gradient for internal variation "gradients within" */}
               <motion.stop offset="0%" animate={{ stopColor: ["#3b0764", "#1e3a8a", "#0f766e", "#3b0764"] }} transition={{ duration: 8, repeat: Infinity, ease: "linear" }} />
               <motion.stop offset="25%" animate={{ stopColor: ["#1e3a8a", "#0f766e", "#3b0764", "#1e3a8a"] }} transition={{ duration: 8, repeat: Infinity, ease: "linear" }} />
               <motion.stop offset="50%" animate={{ stopColor: ["#22d3ee", "#a855f7", "#ef4444", "#22d3ee"] }} transition={{ duration: 8, repeat: Infinity, ease: "linear" }} />
               <motion.stop offset="75%" animate={{ stopColor: ["#a855f7", "#ef4444", "#22d3ee", "#a855f7"] }} transition={{ duration: 8, repeat: Infinity, ease: "linear" }} />
               <motion.stop offset="100%" animate={{ stopColor: ["#ef4444", "#22d3ee", "#a855f7", "#ef4444"] }} transition={{ duration: 8, repeat: Infinity, ease: "linear" }} />
            </linearGradient>

            {/* --- FILTERS (Glow) --- */}
            <filter id="neonGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="5" result="blur" />
              <feColorMatrix in="blur" type="matrix" values="1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 18 -7" result="glow" />
              <feMerge>
                <feMergeNode in="glow" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            <filter id="strongGlow">
               <feGaussianBlur stdDeviation="6" result="coloredBlur" />
               <feMerge>
                   <feMergeNode in="coloredBlur" />
                   <feMergeNode in="SourceGraphic" />
               </feMerge>
            </filter>

            {/* --- CLIP PATHS --- */}
            <clipPath id="leftTowerClip">
                <path d={leftTowerPath} transform="translate(480, 250) scale(0.9)" />
            </clipPath>
            <clipPath id="rightTowerClip">
                <path d={rightTowerPath} transform="translate(1300, 150)" />
            </clipPath>
          </defs>

          {/* --- LAYER 1: Generated Filler City --- */}
          <g>
             {fillerBuildings.map((b) => (
               <g key={b.id}>
                 <rect 
                    x={b.x} y={b.y} width={b.width} height={b.height} 
                    fill={b.color} opacity="0.95"
                  />
                  <rect 
                    x={b.x} y={b.y} width={b.width} height={b.height} 
                    fill="url(#denseWindows)" 
                    opacity={b.id % 3 === 0 ? 0.8 : 0.4} 
                  />
                  {b.height > 400 && (
                    <circle cx={b.x + b.width/2} cy={b.y} r="2" fill="#ef4444">
                       <animate attributeName="opacity" values="0.2;1;0.2" dur={`${randomRange(1,3)}s`} repeatCount="indefinite" />
                    </circle>
                  )}
               </g>
             ))}
          </g>

          {/* --- LAYER 2: Main Towers --- */}
          
          {/* LEFT TOWER (Curved, Flat Top, Grounded) */}
          <g transform="translate(480, 250) scale(0.9)">
              <path d={leftTowerPath} fill="#0f172a" stroke="#312e81" />
          </g>
          
          {/* LED Screen & Effects (Clipped) */}
          <g clipPath="url(#leftTowerClip)">
             <rect 
                x="0" y="0" width="1920" height="1080"
                fill="url(#screenGradient)" opacity="0.9"
             />
             <rect x="0" y="0" width="1920" height="1080" fill="url(#pixelGrid)" opacity="0.4" />
          </g>
          
          {/* Overlays / Outlines */}
          <g transform="translate(480, 250) scale(0.9)">
             {/* Curved Neon Edges */}
             <motion.path 
               d="M 60 100 Q 30 500 0 1080" 
               fill="none" strokeWidth="4" filter="url(#neonGlow)"
               animate={{ 
                 opacity: [0.4, 1, 0.4],
                 stroke: ["#22d3ee", "#a855f7", "#ef4444", "#22d3ee"]
               }}
               transition={{ 
                 opacity: { duration: 3, repeat: Infinity },
                 stroke: { duration: 5, repeat: Infinity, ease: "linear" }
               }}
             />
             <motion.path 
               d="M 140 100 Q 170 500 200 1080" 
               fill="none" strokeWidth="4" filter="url(#neonGlow)"
               animate={{ 
                 opacity: [0.4, 1, 0.4],
                 stroke: ["#c026d3", "#ef4444", "#22d3ee", "#c026d3"]
               }}
               transition={{ 
                 opacity: { duration: 3, repeat: Infinity, delay: 1.5 },
                 stroke: { duration: 5, repeat: Infinity, ease: "linear", delay: 1 }
               }}
             />
             {/* Flat Top Closure */}
             <path d="M 60 100 L 140 100" stroke="#22d3ee" strokeWidth="3" filter="url(#neonGlow)" />
          </g>

          {/* RIGHT TOWER (Grounded) */}
          <g transform="translate(1300, 150)">
              <path d={rightTowerPath} fill="#0f172a" />
          </g>
          
          <g clipPath="url(#rightTowerClip)">
             <rect 
                x="0" y="0" width="1920" height="1080"
                fill="url(#screenGradient)" opacity="0.95"
             />
             <rect x="0" y="0" width="1920" height="1080" fill="url(#pixelGrid)" opacity="0.4" />
          </g>
          
          <g transform="translate(1300, 150)">
            {/* Outline Highlights connecting at the top and extending to ground */}
            <path d="M0 200 L0 1080" stroke="#ffffff" strokeOpacity="0.3" strokeWidth="3" />
            <path d="M200 200 L200 1080" stroke="#ffffff" strokeOpacity="0.3" strokeWidth="3" />
            <path d="M0 200 L100 0" stroke="#ffffff" strokeOpacity="0.3" strokeWidth="2" />
            <path d="M200 200 L100 0" stroke="#ffffff" strokeOpacity="0.3" strokeWidth="2" />
          </g>


          {/* --- LAYER 3: Citizen Center (Redesigned Central Arch) --- */}
          <g transform="translate(0, 600)">
             
             {/* 1. Glow Aura */}
             <motion.path
               d={citizenCenterPath}
               fill="#f97316"
               filter="url(#strongGlow)"
               opacity="0.6"
               animate={{ opacity: [0.4, 0.7, 0.4] }}
               transition={{ duration: 4, repeat: Infinity }}
             />

             {/* 2. Main Structure Fill */}
             <path
               d={citizenCenterPath}
               fill="#f97316"
             />

             {/* 3. Structural Ribs (Top Stroke) */}
             <path
               d={citizenCenterStroke}
               fill="none" stroke="white" strokeWidth="3" strokeOpacity="0.6"
             />
             
             {/* 4. Vertical Struts for Detail */}
             {Array.from({ length: 17 }).map((_, i) => {
                const x = 200 + i * 90;
                // Simple visual placement
                return (
                   <line 
                     key={i} 
                     x1={x} y1="320" x2={x} y2="400" 
                     stroke="white" strokeOpacity="0.15" strokeWidth="1" 
                   />
                )
             })}
          </g>

        </svg>
      </div>

      {/* Cyberpunk HUD Overlay */}
      <div className="absolute top-5 left-5 pointer-events-none z-50">
        <div className="flex flex-col space-y-1">
          <motion.div 
            className="text-cyan-400 font-mono text-xl font-bold tracking-widest drop-shadow-[0_0_5px_rgba(34,211,238,0.8)]"
            animate={{ opacity: [0.8, 1, 0.8] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            SHENZHEN // 深圳
          </motion.div>
          <div className="h-0.5 bg-gradient-to-r from-cyan-500 to-transparent w-48" />
          <div className="text-xs text-cyan-700 font-mono">LIGHT_SHOW_SEQUENCE: ACTIVE</div>
        </div>
      </div>

    </section>
  );
}
