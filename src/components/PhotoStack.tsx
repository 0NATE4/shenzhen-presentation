import { useState } from 'react';
import { motion, useMotionValue, useTransform, animate, AnimatePresence, type PanInfo } from 'framer-motion';
import { MapPin, Smartphone, CheckCircle } from 'lucide-react';

// Import local assets
import bicyclesImg from '../assets/bicycles.jpg';
import firstDayImg from '../assets/firstDay.jpg';
import guangzhouImg from '../assets/guangzhou.jpg';
import guilinImg from '../assets/guilin.jpg';
import mixueImg from '../assets/mixue.jpg';
import skylineImg from '../assets/skyline.jpg';
import taobaoImg from '../assets/taobao.jpg';

/**
 * MOCK DATA
 */
interface Memory {
  id: number;
  src: string;
  caption: string;
  location: string;
}

const INITIAL_MEMORIES: Memory[] = [
  { 
    id: 1, 
    src: firstDayImg, 
    caption: 'First day in Shenzhen.',
    location: 'Shenzhen, CN'
  },
  { 
    id: 2, 
    src: bicyclesImg, 
    caption: 'Cycling through the city.',
    location: 'Nanshan District'
  },
  { 
    id: 3, 
    src: mixueImg, 
    caption: 'Daily Mixue fix.',
    location: 'Anywhere'
  },
  { 
    id: 4, 
    src: taobaoImg, 
    caption: 'Taobao Haul!',
    location: 'Hotel'
  },
  { 
    id: 5, 
    src: guangzhouImg, 
    caption: 'Weekend trip to Guangzhou.',
    location: 'Guangzhou'
  },
  { 
    id: 6, 
    src: guilinImg, 
    caption: 'Exploring the mountains',
    location: 'Guilin'
  },
  { 
    id: 7, 
    src: skylineImg, 
    caption: 'Skyline',
    location: 'Futian'
  },
];

interface CardProps {
  data: Memory;
  isTop: boolean;
  onRemove: (id: number) => void;
  baseRotation: number;
  totalCards: number;
}

/**
 * Card Component
 * Represents a single "Dark Tech" glass tablet.
 */
const Card = ({ data, isTop, onRemove, baseRotation, totalCards }: CardProps) => {
  const x = useMotionValue(0);
  
  // Visual transforms based on drag position
  const rotate = useTransform(x, [-200, 200], [baseRotation - 15, baseRotation + 15]);
  const opacity = useTransform(x, [-250, 0, 250], [0.5, 1, 0.5]);

  const handleDragEnd = (_: unknown, info: PanInfo) => {
    const swipeThreshold = 100;
    const velocityThreshold = 500;
    const { offset, velocity } = info;
    
    // Check if the swipe is strong enough
    const isSwipe = Math.abs(offset.x) > swipeThreshold || Math.abs(velocity.x) > velocityThreshold;

    if (isSwipe) {
      // SWIPE DETECTED: Fly away
      const direction = offset.x > 0 ? 1 : -1; // 1 = right, -1 = left
      
      // We manually animate 'x' to a large value immediately.
      // This overrides any default constraint behavior.
      animate(x, direction * 1000, { 
        duration: 0.4, 
        ease: "easeIn",
        onComplete: () => onRemove(data.id) // Only remove after animation finishes
      });

    } else {
      // NO SWIPE: Snap back to center
      // We manually animate back to 0. This gives us full control over the spring feel.
      animate(x, 0, { 
        type: "spring", 
        stiffness: 300, 
        damping: 25 
      });
    }
  };

  // Calculate progress percentage
  const progress = (data.id / totalCards) * 100;

  return (
    <motion.div
      style={{ x, rotate, opacity, zIndex: isTop ? 10 : 1 }}
      
      // Initial Entry Animation
      initial={{ scale: 0.95, opacity: 0, y: 0 }}
      animate={{ 
        scale: isTop ? 1 : 0.95, 
        opacity: 1, 
        y: 0, 
        rotate: baseRotation,
        filter: isTop ? 'brightness(1)' : 'brightness(0.5)',
        transition: { type: 'spring', stiffness: 260, damping: 20 }
      }}
      
      // Drag Configuration
      drag={isTop ? "x" : false} 
      
      // Elastic resistance when pulling away from center
      dragConstraints={{ left: 0, right: 0 }} 
      dragElastic={0.6}
      
      // IMPORTANT: Disable momentum so the card doesn't "slide" after release.
      // This allows our manual animation in onDragEnd to take over instantly.
      dragMomentum={false} 
      
      onDragEnd={handleDragEnd}
      
      // Styling
      whileTap={{ cursor: 'grabbing', scale: 1.02 }}
      className={`
        absolute top-0 left-0 
        w-96 h-96 
        bg-slate-900 
        p-4 pb-6
        rounded-2xl
        border border-slate-700/50
        flex flex-col
        cursor-grab origin-bottom
        shadow-[0_0_40px_-10px_rgba(6,182,212,0.3)]
        ${!isTop && 'pointer-events-none'} 
      `}
    >
      {/* Top Bar / Status Line (Dynamic Progress) */}
      <div className="w-full h-1 bg-slate-800 rounded-full mb-3 overflow-hidden">
         <div 
           className="h-full bg-cyan-500/80 rounded-full transition-all duration-300 ease-out"
           style={{ width: `${progress}%` }}
         ></div>
      </div>

      {/* The Image Area */}
      <div className="relative w-full aspect-[4/5] bg-slate-950 rounded-lg overflow-hidden mb-4 shadow-inner ring-1 ring-white/5">
        <img 
          src={data.src} 
          alt={data.caption} 
          className="w-full h-full object-cover pointer-events-none select-none"
        />
        {/* Glass reflection gradient */}
        <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent pointer-events-none"></div>
      </div>

      {/* The Text Area - Clean Sans Serif */}
      <div className="flex-1 flex flex-col justify-end">
        <h3 className="font-sans text-lg font-medium text-slate-200 leading-tight mb-2 tracking-wide">
          {data.caption}
        </h3>
        {data.location && (
          <div className="flex items-center text-xs text-cyan-400 font-mono mt-1 uppercase tracking-wider">
            <MapPin size={12} className="mr-1" />
            {data.location}
          </div>
        )}
      </div>
    </motion.div>
  );
};

/**
 * Confetti Component
 */
const Confetti = () => {
  const particles = Array.from({ length: 50 });
  
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {particles.map((_, i) => (
        <motion.div
          key={i}
          initial={{ 
            y: '100vh', 
            x: Math.random() * 100 + 'vw',
            opacity: 1,
            scale: Math.random() * 0.5 + 0.5,
            rotate: Math.random() * 360
          }}
          animate={{ 
            y: '-10vh',
            x: `calc(${Math.random() * 100}vw + ${Math.random() * 200 - 100}px)`,
            rotate: Math.random() * 720 + 360,
            opacity: [1, 1, 0]
          }}
          transition={{ 
            duration: Math.random() * 2 + 2, 
            ease: "easeOut",
            delay: Math.random() * 0.5
          }}
          className="absolute w-3 h-3 rounded-sm"
          style={{
            backgroundColor: ['#06b6d4', '#3b82f6', '#8b5cf6', '#ec4899'][Math.floor(Math.random() * 4)]
          }}
        />
      ))}
    </div>
  );
};

/**
 * Main PhotoStack Container
 */
const PhotoStack = () => {
  const [cards, setCards] = useState<Memory[]>(INITIAL_MEMORIES);
  const [isFinished, setIsFinished] = useState(false);

  // Remove card from array
  const handleRemove = (id: number) => {
    setCards((current) => {
      const newCards = current.filter(card => card.id !== id);
      if (newCards.length === 0) {
        setTimeout(() => setIsFinished(true), 300);
      }
      return newCards;
    });
  };

  return (
    <div className="h-full w-full bg-slate-950 flex flex-col items-center justify-center overflow-hidden font-sans text-slate-200 relative selection:bg-cyan-500/30">
      
      {/* Background decoration - Dark Grid */}
      <div className="absolute inset-0 opacity-20 pointer-events-none" 
           style={{ 
             backgroundImage: `
               linear-gradient(to right, #334155 1px, transparent 1px),
               linear-gradient(to bottom, #334155 1px, transparent 1px)
             `, 
             backgroundSize: '40px 40px' 
           }}>
      </div>
      <div className="absolute inset-0 bg-radial-gradient from-slate-900/0 via-slate-950/80 to-slate-950 pointer-events-none"></div>

      <div className="z-10 flex flex-col items-center mb-10">
        <div className="flex items-center gap-2 mb-2 text-cyan-400">
           <Smartphone size={20} />
           <span className="font-mono text-xs uppercase tracking-[0.2em]">System.Memories</span>
        </div>
        <h1 className="text-4xl font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-slate-100 to-slate-500">
          Photo Stream
        </h1>
      </div>

      <div className="relative w-96 h-96 flex justify-center items-center perspective-1000">
        <AnimatePresence mode="wait">
          {!isFinished ? (
            cards.slice().reverse().map((card, index) => {
              const isTop = index === cards.length - 1;
              const baseRotation = (card.id % 2 === 0 ? 1 : -1) * ((card.id * 3) % 8);

              return (
                <Card
                  key={card.id}
                  data={card}
                  isTop={isTop}
                  onRemove={handleRemove}
                  baseRotation={baseRotation}
                  totalCards={INITIAL_MEMORIES.length}
                />
              );
            })
          ) : (
            <motion.div 
              key="thank-you"
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
              className="text-center flex flex-col items-center justify-center p-8 w-96 h-64 bg-slate-900/50 backdrop-blur-md rounded-2xl border border-slate-800 shadow-2xl relative z-20"
            >
              <div className="w-16 h-16 rounded-full bg-cyan-500/10 flex items-center justify-center mb-4 text-cyan-400 ring-1 ring-cyan-500/50">
                 <CheckCircle size={32} />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Thank You</h2>
              <p className="text-slate-400 font-light">End of presentation.</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {isFinished && <Confetti />}
      
      {/* Footer / Instructions */}
      {!isFinished && (
        <div className="mt-16 text-center text-slate-600 text-xs max-w-xs font-mono">
          <p>Interaction Mode: [Active]</p>
          <p className="mt-2 text-cyan-900/50">Drag card horizontally to dismiss</p>
        </div>
      )}
    </div>
  );
};

export default PhotoStack;

