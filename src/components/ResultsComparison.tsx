import { useEffect, useRef, useState } from 'react';
import Matter from 'matter-js';
import { AlertTriangle, Clock, Play, Zap } from 'lucide-react';

interface ResultsComparisonProps {
  isActive?: boolean;
}

/**
 * RESULTS COMPARISON COMPONENT
 * * Demonstrates efficiency gains using a physics-based simulation.
 * Left side: Chaotic, overflowing, expensive (Time = Money).
 * Right side: Efficient, orderly, cheap.
 * * Uses Matter.js for physics rendering.
 */
const ResultsComparison = ({ isActive = true }: ResultsComparisonProps) => {
  const sceneRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // State for UI triggers
  const [hasStarted, setHasStarted] = useState(false);
  const [leftFinished, setLeftFinished] = useState(false);
  const [optimisedStarted, setOptimisedStarted] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, setSimulationFinished] = useState(false);

  // Refs for direct DOM manipulation (Counters)
  const leftCostRef = useRef<HTMLDivElement>(null);
  const rightCostRef = useRef<HTMLDivElement>(null);
  
  // Refs to store engine instances and control functions
  const engineRef = useRef<Matter.Engine | null>(null);
  const renderRef = useRef<Matter.Render | null>(null);
  const runnerRef = useRef<Matter.Runner | null>(null);
  const intervalsRef = useRef<NodeJS.Timeout[]>([]);
  const startOptimisedRef = useRef<(() => void) | null>(null); // Ref to hold the trigger function

  // Configuration
  const CONFIG = {
    canvasWidth: 800,
    canvasHeight: 500,
    wallThickness: 24,
    hopperWidth: 160,
    hopperHeight: 250,
    coinSize: 5, // Reduced from 7 to 5 to prevent squashing
    colors: {
      background: '#0a0a0a',
      glass: 'rgba(59, 130, 246, 0.1)',
      glassBorder: '#3b82f6',
      coinGold: '#fbbf24',
      coinSilver: '#94a3b8',
      textRed: '#ef4444',
      textGreen: '#10b981'
    }
  };

  // Pause/Resume logic
  useEffect(() => {
    if (!runnerRef.current || !engineRef.current) return;

    if (isActive) {
      Matter.Runner.run(runnerRef.current, engineRef.current);
    } else {
      Matter.Runner.stop(runnerRef.current);
    }
  }, [isActive]);

  const initSimulation = () => {
    if (!sceneRef.current) return;
    
    setHasStarted(true);
    setSimulationFinished(false);

    // --- MATTER.JS SETUP ---
    const Engine = Matter.Engine,
          Render = Matter.Render,
          Runner = Matter.Runner,
          Bodies = Matter.Bodies,
          Composite = Matter.Composite,
          Events = Matter.Events;

    // Create engine 
    // Increased iterations to 50 to drastically reduce jitter
    const engine = Engine.create({
      positionIterations: 60, // Increased to 60 for better collision resolution
      velocityIterations: 60,
      enableSleeping: true,   // Re-enabled: Essential for preventing "sinking" in stacks
      gravity: { scale: 0.002 } 
    });
    engineRef.current = engine;

    // Create renderer
    const render = Render.create({
      element: sceneRef.current,
      engine: engine,
      options: {
        width: CONFIG.canvasWidth,
        height: CONFIG.canvasHeight,
        background: 'transparent',
        wireframes: false,
        showSleeping: false, // CRITICAL: Prevents sleeping bodies from turning grey
        pixelRatio: window.devicePixelRatio || 1
      }
    });
    
    // CRITICAL FIX: Force canvas to stretch to 100% of the container
    // This ensures physics coordinates (25% and 75%) align perfectly with HTML flexbox
    render.canvas.style.width = '100%';
    render.canvas.style.height = '100%';
    
    renderRef.current = render;

    // --- BOUNDARIES & CONTAINERS ---

    // Perfectly align with the 50/50 flex layout
    const leftX = CONFIG.canvasWidth * 0.25; // 25% (Center of left side)
    const rightX = CONFIG.canvasWidth * 0.75; // 75% (Center of right side)
    
    // Keep hopper bottom consistent
    const hopperBottomY = CONFIG.canvasHeight - 110; 

    const glassOptions = {
      isStatic: true,
      render: { visible: false },
      chamfer: { radius: 4 }
    };

    // Ground - RAISED to align with hopper bottoms
    const ground = Bodies.rectangle(CONFIG.canvasWidth / 2, hopperBottomY + (CONFIG.wallThickness / 2), CONFIG.canvasWidth, CONFIG.wallThickness, { 
      isStatic: true,
      render: { visible: false } 
    });

    // Create Hopper Function
    const createHopper = (x: number, y: number) => {
      const w = CONFIG.hopperWidth;
      const h = CONFIG.hopperHeight;
      const t = CONFIG.wallThickness;
      
      return [
        // Bottom
        Bodies.rectangle(x, y - (t/2), w, t, glassOptions),
        // Left Wall
        Bodies.rectangle(x - w/2 + t/2, y - h/2, t, h, glassOptions),
        // Right Wall
        Bodies.rectangle(x + w/2 - t/2, y - h/2, t, h, glassOptions)
      ];
    };

    const leftHopper = createHopper(leftX, hopperBottomY);
    const rightHopper = createHopper(rightX, hopperBottomY);

    Composite.add(engine.world, [ground, ...leftHopper, ...rightHopper]);

    // --- CUSTOM RENDERING (FRONT GLASS & GLOW) ---
    Events.on(render, 'afterRender', (event) => {
      const ctx = event.source.context;
      
      // Helper to draw the container visually
      const drawContainer = (x: number, y: number, w: number, h: number) => {
        ctx.beginPath();
        // Draw the U shape
        ctx.moveTo(x - w/2, y - h); 
        ctx.lineTo(x - w/2, y);     
        ctx.lineTo(x + w/2, y);     
        ctx.lineTo(x + w/2, y - h); 
        
        // Styling
        ctx.lineWidth = 4;
        ctx.strokeStyle = 'rgba(59, 130, 246, 0.4)'; 
        ctx.lineJoin = 'round';
        ctx.stroke();

        // Front Glass Pane
        ctx.fillStyle = 'rgba(59, 130, 246, 0.1)'; 
        ctx.fill();
        
        // Glow effect
        ctx.shadowBlur = 15;
        ctx.shadowColor = CONFIG.colors.glassBorder;
        ctx.stroke();
        ctx.shadowBlur = 0;
      };

      drawContainer(leftX, hopperBottomY, CONFIG.hopperWidth, CONFIG.hopperHeight);
      drawContainer(rightX, hopperBottomY, CONFIG.hopperWidth, CONFIG.hopperHeight);
      
      // Draw Floor Line
      ctx.beginPath();
      ctx.moveTo(0, hopperBottomY);
      ctx.lineTo(CONFIG.canvasWidth, hopperBottomY);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
      ctx.lineWidth = 1;
      ctx.stroke();
    });

    // --- COIN SPAWNERS ---

    const PRICE_PER_COIN = 10; 

    // Define Trigger Function for Right Side
    startOptimisedRef.current = () => {
      let rightCount = 0;
      const maxRightCoins = 63; 
      setOptimisedStarted(true);
      
      const rightInterval = setInterval(() => {
        if (rightCount >= maxRightCoins) {
          clearInterval(rightInterval);
          setSimulationFinished(true);
          return;
        }

        const randX = rightX + (Math.random() * 4 - 2); 

        // Optimised coin physics: High density, high friction, no bounce
        const coin = Bodies.circle(randX, -50, CONFIG.coinSize, {
          restitution: 0.1,    // Slight bounce to prevent immediate freezing
          friction: 0.5,       // Reduced from 1.0 to allow some settling
          frictionStatic: 0.5, // Reduced from 10.0
          frictionAir: 0.05, 
          density: 0.01,       
          sleepThreshold: 60,  // Increased from 10 to 60 to allow natural settling
          render: {
            fillStyle: CONFIG.colors.coinSilver,
            strokeStyle: '#cbd5e1',
            lineWidth: 1
          }
        });

        Composite.add(engine.world, coin);
        rightCount++;

        // Update Counter
        const currentCost = rightCount * PRICE_PER_COIN;
        if (rightCostRef.current) rightCostRef.current.innerText = `$${currentCost.toLocaleString()}`;

      }, 80); 
      intervalsRef.current.push(rightInterval);
    };

    // Left Side (CHAOS - Original)
    let leftCount = 0;
    const maxLeftCoins = 500; 
    const leftInterval = setInterval(() => {
      if (leftCount >= maxLeftCoins) {
        clearInterval(leftInterval);
        setLeftFinished(true);
        // Do NOT auto-start right side
        return;
      }
      
      const randX = leftX + (Math.random() * 60 - 30);
      
      // Standard coin physics
      const coin = Bodies.circle(randX, -50, CONFIG.coinSize, {
        restitution: 0.4, 
        friction: 0.5,
        density: 0.002,      // Standard density
        sleepThreshold: 40,  // Increased from 20 to 40
        render: {
          fillStyle: CONFIG.colors.coinGold,
          strokeStyle: '#b45309',
          lineWidth: 1
        }
      });
      
      Composite.add(engine.world, coin);
      leftCount++;
      
      // Update Counter
      const currentCost = leftCount * PRICE_PER_COIN;
      if (leftCostRef.current) leftCostRef.current.innerText = `$${currentCost.toLocaleString()}`;

    }, 12); 
    intervalsRef.current.push(leftInterval);


    // Run the engine
    Render.run(render);
    const runner = Runner.create();
    runnerRef.current = runner;
    Runner.run(runner, engine);
  };

  const handleStartOptimised = () => {
    if (startOptimisedRef.current) {
        startOptimisedRef.current();
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      intervalsRef.current.forEach(clearInterval);
      if (renderRef.current) {
        Matter.Render.stop(renderRef.current);
        if (renderRef.current.canvas) {
            renderRef.current.canvas.remove();
        }
      }
      if (runnerRef.current) Matter.Runner.stop(runnerRef.current);
      if (engineRef.current) Matter.Engine.clear(engineRef.current);
    };
  }, []);

  return (
    <section 
      ref={containerRef}
      className="snap-section relative w-full h-screen bg-[#0a0a0a] text-slate-200 font-sans overflow-hidden flex flex-col items-center justify-center py-4 md:py-8"
    >
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-900/10 via-[#0a0a0a] to-[#0a0a0a]" />

      {/* Header */}
      <div className="relative z-10 text-center mb-4 max-w-2xl px-4 shrink-0">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-medium mb-2">
          <Clock className="w-3 h-3" />
          <span>Efficiency Analysis</span>
        </div>
        <h2 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400 mb-2">
          Cost Comparison
        </h2>
        <p className="text-slate-400 text-sm">
          Visualizing the cost impact of the original process versus the optimised workflow.
        </p>
      </div>

      {/* Main Display Area */}
      <div className="relative z-10 w-full max-w-4xl mx-auto px-4 flex-1 flex items-center justify-center min-h-0">
        
        {/* Canvas Container */}
        {/* FIX: Locked aspect ratio to [16/10] (1.6) to match the physics world 800/500 (1.6) exactly */}
        {/* This prevents mismatch between the absolute positioned text and the canvas content */}
        <div className="relative w-full aspect-[16/10] max-h-[70vh] bg-white/5 rounded-2xl border border-white/10 shadow-2xl overflow-hidden backdrop-blur-sm">
          
          {/* Simulation Viewport */}
          <div ref={sceneRef} className="absolute inset-0 w-full h-full" />

          {/* Overlays (Labels & Counters) */}
          <div className="absolute inset-0 flex">
            
            {/* Left Zone Overlay */}
            <div className="flex-1 h-full relative border-r border-white/5 flex flex-col">
              <div className="pt-4 md:pt-6 text-center flex-1">
                <div className="flex items-center justify-center gap-2 text-red-400 font-bold tracking-wider mb-1 text-xs uppercase">
                  <AlertTriangle className="w-3 h-3" />
                  Manual Process
                </div>
                <h3 className="text-xl font-bold text-white tracking-tight">Original</h3>
              </div>

              {/* Counter Left */}
              <div className="pb-4 md:pb-6 text-center z-20">
                <p className="text-[10px] text-red-500 font-mono mb-1 uppercase tracking-[0.2em] opacity-80">Estimated Cost</p>
                <div 
                  ref={leftCostRef} 
                  className="text-3xl md:text-4xl font-bold text-red-500 tabular-nums drop-shadow-[0_0_15px_rgba(239,68,68,0.5)]"
                >
                  $0
                </div>
              </div>
            </div>

            {/* Right Zone Overlay */}
            <div className="flex-1 h-full relative flex flex-col">
              <div className="pt-4 md:pt-6 text-center flex-1">
                 <div className="flex items-center justify-center gap-2 text-emerald-400 font-bold tracking-wider mb-1 text-xs uppercase">
                  <Zap className="w-3 h-3" />
                  Automated
                </div>
                <h3 className="text-xl font-bold text-white tracking-tight">Optimised</h3>
                
                {/* Manual Trigger Button */}
                {!optimisedStarted && (
                    <div className="mt-6 flex justify-center">
                        <button
                            onClick={handleStartOptimised}
                            disabled={!leftFinished && !hasStarted}
                            className={`
                                flex items-center gap-2 px-5 py-2 rounded-full font-bold text-xs transition-all
                                ${leftFinished 
                                    ? 'bg-emerald-500 hover:bg-emerald-400 text-white shadow-[0_0_20px_rgba(16,185,129,0.4)] hover:shadow-[0_0_30px_rgba(16,185,129,0.6)] cursor-pointer scale-100' 
                                    : 'bg-white/5 text-slate-500 cursor-not-allowed border border-white/5'
                                }
                            `}
                        >
                            <Play className="w-3 h-3 fill-current" />
                            {leftFinished ? "Run Optimization" : "Waiting for Original..."}
                        </button>
                    </div>
                )}
              </div>

               {/* Counter Right */}
               <div className="pb-4 md:pb-6 text-center z-20">
                <p className="text-[10px] text-emerald-500 font-mono mb-1 uppercase tracking-[0.2em] opacity-80">Estimated Cost</p>
                <div 
                  ref={rightCostRef} 
                  className="text-3xl md:text-4xl font-bold text-emerald-500 tabular-nums drop-shadow-[0_0_15px_rgba(16,185,129,0.5)]"
                >
                  $0
                </div>
              </div>
            </div>
          </div>
          
          {/* Start Trigger Overlay (Initial) */}
          {!hasStarted && (
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center backdrop-blur-sm z-20">
              <button 
                onClick={initSimulation}
                className="group relative px-6 py-3 bg-blue-600 hover:bg-blue-500 rounded-full font-bold text-white shadow-[0_0_20px_rgba(37,99,235,0.5)] transition-all hover:scale-105 active:scale-95 flex items-center gap-2 text-sm"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>Start Simulation</span>
                <div className="absolute inset-0 rounded-full ring-2 ring-white/20 group-hover:ring-white/40 animate-pulse" />
              </button>
            </div>
          )}

        </div>

      </div>
    </section>
  );
};

export default ResultsComparison;
