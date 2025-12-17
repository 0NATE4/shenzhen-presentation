import { useEffect, useRef, useState } from 'react';

interface Particle {
  x: number;
  y: number;
  targetX: number;
  targetY: number;
}

interface DroneSwarmProps {
  isActive?: boolean;
}

const DroneSwarm = ({ isActive = true }: DroneSwarmProps) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationRef = useRef<number | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  
  // State to track text toggling
  const [mode, setMode] = useState<'EN' | 'CN'>('EN'); // 'EN' or 'CN'

  // Constants
  const PARTICLE_COUNT = 1500;
  const TEXT_EN = 'SHENZHEN';
  const TEXT_CN = '深圳';
  const FONT_FAMILY = 'Inter, system-ui, "Heiti SC", "Microsoft YaHei", sans-serif';

  // Refs for mutable data avoiding re-renders
  const particles = useRef<Particle[]>([]);
  // We don't strictly need a ref for size if we read from DOM, but it helps track state
  const canvasSize = useRef({ w: 0, h: 0 });

  // Initialize Particles once
  useEffect(() => {
    const initParticles = () => {
      const p: Particle[] = [];
      // Use window dimensions as fallback if container isn't ready
      const initialW = window.innerWidth;
      const initialH = window.innerHeight;
      
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        p.push({
          x: Math.random() * initialW,
          y: Math.random() * initialH,
          targetX: initialW / 2,
          targetY: initialH / 2,
        });
      }
      particles.current = p;
    };
    initParticles();
  }, []);

  // Helper: Generate coordinate points from text
  const getCoordinatesFromText = (text: string, width: number, height: number) => {
    // SAFETY CHECK: Prevent IndexSizeError by ensuring dimensions are valid
    if (!width || !height || width <= 0 || height <= 0) return [];

    // 1. Setup off-screen canvas
    const offCanvas = document.createElement('canvas');
    const offCtx = offCanvas.getContext('2d', { willReadFrequently: true });
    
    if (!offCtx) return [];

    offCanvas.width = width;
    offCanvas.height = height;

    // 2. Configure Font
    // Scale font based on viewport width to ensure it fits but stays large
    const fontSize = Math.min(width / 6, height / 3); 
    offCtx.font = `900 ${fontSize}px ${FONT_FAMILY}`;
    offCtx.textAlign = 'center';
    offCtx.textBaseline = 'middle';
    offCtx.fillStyle = '#ffffff';

    // 3. Draw text centered
    offCtx.fillText(text, width / 2, height / 2);

    // 4. Scan pixel data
    const imageData = offCtx.getImageData(0, 0, width, height).data;
    const validPoints: { x: number; y: number }[] = [];
    
    // Scan density: larger steps = faster processing, less detail
    const step = 4; 

    for (let y = 0; y < height; y += step) {
      for (let x = 0; x < width; x += step) {
        const index = (y * width + x) * 4;
        // Check alpha channel (transparency) > 128
        if (imageData[index + 3] > 128) {
          validPoints.push({ x, y });
        }
      }
    }

    return validPoints;
  };

  // Logic to assign targets to particles
  const updateTargets = () => {
    if (!canvasRef.current) return;
    
    const { width, height } = canvasRef.current;
    
    // SAFETY CHECK: Abort if canvas has no size
    if (width <= 0 || height <= 0) return;

    const text = mode === 'EN' ? TEXT_EN : TEXT_CN;
    
    // Get raw points from text shape
    let points = getCoordinatesFromText(text, width, height);

    // Shuffle points for a more organic "swarm" look
    points = points.sort(() => Math.random() - 0.5);

    if (points.length === 0) return;

    // Assign targets
    particles.current.forEach((p, i) => {
      const target = points[i % points.length];
      p.targetX = target.x;
      p.targetY = target.y;
    });
  };

  // Toggle Timer
  useEffect(() => {
    if (!isActive) return;
    
    const interval = setInterval(() => {
      setMode((prev) => (prev === 'EN' ? 'CN' : 'EN'));
    }, 8000); // Increased from 5000 to 10000ms (10 seconds)
    return () => clearInterval(interval);
  }, [isActive]);

  // Update targets whenever mode changes
  useEffect(() => {
    updateTargets();
  }, [mode]);

  // Animation Loop
  useEffect(() => {
    if (!isActive) {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Easing factor: Lowered to 0.015 for slower, smoother movement
    const EASE = 0.015; 

    const render = () => {
      if (!canvas) return;

      // 1. Clear Canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // 2. Set Dynamic RGB Color
      // Use performance.now() to cycle through HSL hue (0-360)
      const time = performance.now();
      const hue = (time * 0.02) % 360; 
      ctx.fillStyle = `hsl(${hue}, 80%, 60%)`;

      // 3. Update and Draw Particles
      ctx.beginPath();
      
      const pArr = particles.current;
      for (let i = 0; i < pArr.length; i++) {
        const p = pArr[i];

        // Physics: Ease out interpolation
        const dx = p.targetX - p.x;
        const dy = p.targetY - p.y;
        
        p.x += dx * EASE;
        p.y += dy * EASE;

        ctx.moveTo(p.x, p.y);
        ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
      }
      
      ctx.fill();

      animationRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
        if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [isActive]);

  // Handle Resize
  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current && canvasRef.current) {
        const { offsetWidth, offsetHeight } = containerRef.current;
        
        // Only update if dimensions are valid to prevent errors
        if (offsetWidth > 0 && offsetHeight > 0) {
            canvasRef.current.width = offsetWidth;
            canvasRef.current.height = offsetHeight;
            canvasSize.current = { w: offsetWidth, h: offsetHeight };
            
            // Immediate re-calculation of targets on resize
            updateTargets();
        }
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Initial size check

    return () => window.removeEventListener('resize', handleResize);
  }, [mode]); // Re-bind allows updateTargets to see current mode

  return (
    <div 
      ref={containerRef} 
      className="relative w-full h-screen bg-neutral-900 overflow-hidden flex flex-col items-center justify-center snap-start"
    >
      <canvas
        ref={canvasRef}
        className="block"
        style={{ width: '100%', height: '100%' }}
      />
      
      {/* Overlay UI for context */}
      <div className="absolute bottom-10 left-0 right-0 text-center pointer-events-none">
    
       
      </div>
    </div>
  );
};

export default DroneSwarm;
