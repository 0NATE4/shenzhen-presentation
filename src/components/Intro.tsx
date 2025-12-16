import React from 'react';
import { motion } from 'framer-motion';
import logo from '../assets/logo.png';

// --- Sub-Components ---

/**
 * The "Breathing Aurora" Background
 * Slowly rotating blobs of color behind the scene.
 */
const AmbientBackground = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {/* Container for the rotating blobs */}
      <motion.div 
        className="absolute inset-0 flex items-center justify-center opacity-40"
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      >
        {/* Cyan Blob */}
        <div className="absolute w-[500px] h-[500px] bg-cyan-500/30 rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2 mix-blend-screen" />
        
        {/* Green Blob (Offset) */}
        <div className="absolute w-[400px] h-[400px] bg-green-500/20 rounded-full blur-[100px] translate-x-1/3 translate-y-1/3 mix-blend-screen" />
      </motion.div>
      
      {/* Noise overlay for texture (optional, makes it look more 'film-like') */}
      <div className="absolute inset-0 opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
    </div>
  );
};

/**
 * The "Scanner Ring"
 * A conic gradient ring that spins around the logo.
 */
const ScannerRing = () => {
  return (
    <motion.div
      className="absolute inset-0 z-10"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, rotate: 360 }}
      transition={{ 
        opacity: { duration: 1, delay: 0.5 },
        rotate: { duration: 3, repeat: Infinity, ease: "linear" }
      }}
    >
      <div 
        className="w-full h-full rounded-full"
        style={{
          background: `conic-gradient(from 0deg, transparent 0deg, transparent 270deg, #06b6d4 320deg, #22c55e 360deg)`,
          // Use a mask to cut out the center and create a thin ring
          maskImage: 'radial-gradient(closest-side, transparent 96%, black 100%)',
          WebkitMaskImage: 'radial-gradient(closest-side, transparent 96%, black 100%)',
        }}
      />
    </motion.div>
  );
};

// --- Main Component ---

const Intro = () => {
  return (
    <section className="snap-section relative w-full h-screen bg-[#050505] flex flex-col items-center justify-center overflow-hidden font-sans text-white">
      
      {/* 1. Background Ambience */}
      <AmbientBackground />

      {/* 2. Central Logo Container */}
      <div className="relative z-10 flex flex-col items-center justify-center">
        
        {/* Logo Wrapper - Ensures Ring is centered on Logo */}
        <div className="relative flex items-center justify-center">
          {/* Scanner Ring Container - Sized slightly larger than logo */}
          <div className="absolute w-[260px] h-[260px]">
            <ScannerRing />
          </div>

          {/* Logo Animation */}
          <motion.div
            className="relative w-40 h-40 z-20"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
          >
            <motion.div
              // The "Floating" Idle Animation
              animate={{ y: [0, -15, 0] }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="w-full h-full flex items-center justify-center p-4"
            >
              <img 
                src={logo} 
                alt="PneumaAI Logo" 
                className="w-full h-full object-contain drop-shadow-[0_0_15px_rgba(6,182,212,0.3)]" 
              />
            </motion.div>
          </motion.div>
        </div>

        {/* 3. Text Reveal */}
        <motion.div
          className="mt-12 text-center z-20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 1 }}
        >
          <h1 className="text-4xl md:text-5xl font-light tracking-wide mb-2">
            <span className="relative inline-block">
              {/* Base Text */}
              <span className="text-transparent bg-clip-text bg-gradient-to-br from-white via-gray-200 to-gray-500">
                PneumaAI
              </span>
              
              {/* Shimmer Overlay */}
              <motion.span
                className="absolute inset-0 text-transparent bg-clip-text bg-gradient-to-r from-transparent via-white/50 to-transparent"
                animate={{ backgroundPosition: ["-200% center", "200% center"] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", repeatDelay: 1 }}
                style={{ backgroundSize: "200% auto" }}
                aria-hidden="true"
              >
                PneumaAI
              </motion.span>
            </span>
          </h1>
          
          <p className="text-sm md:text-base text-gray-500 tracking-[0.3em] uppercase font-medium opacity-80">
            Internship Experience
          </p>
        </motion.div>
      </div>

      {/* Optional: Subtle Overlay Vignette to focus attention */}
      <div className="absolute inset-0 pointer-events-none bg-radial-gradient-vignette z-30 opacity-40" />
      
      {/* Styles for the custom vignette class if Tailwind config isn't available */}
      <style>{`
        .bg-radial-gradient-vignette {
          background: radial-gradient(circle at center, transparent 0%, #050505 100%);
        }
      `}</style>
    </section>
  );
};

export default Intro;
