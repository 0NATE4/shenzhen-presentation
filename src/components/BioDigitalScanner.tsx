import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface BioDigitalScannerProps {
  isScanned?: boolean;
  onToggle?: () => void;
}

const BioDigitalScanner = ({ isScanned: externalIsScanned, onToggle }: BioDigitalScannerProps) => {
  const [internalIsScanned, setInternalIsScanned] = useState(false);
  
  const isScanned = externalIsScanned !== undefined ? externalIsScanned : internalIsScanned;
  const handleToggle = () => {
    if (onToggle) {
      onToggle();
    } else {
      setInternalIsScanned(!internalIsScanned);
    }
  };

  const hud = isScanned
  ? {
      title: "TCM ↔ AI Bridge",
      status: "STRUCTURED SUMMARY: DRAFT",
      detail: "For practitioner review, not medical advice",
      prompt: "DRAFT READY",
    }
  : {
      title: "TCM ↔ AI Bridge",
      status: "INTAKE: FREEFORM CONTEXT",
      detail: "Click to preview how we structure TCM notes",
      prompt: "CLICK TO PREVIEW",
    };

  // Coordinates for the nodes (approximate locations on a torso)
  const nodes = [
    { id: 1, x: 100, y: 60, label: "Head" },
    { id: 2, x: 100, y: 100, label: "Throat" },
    { id: 3, x: 70, y: 140, label: "R. Shoulder" },
    { id: 4, x: 130, y: 140, label: "L. Shoulder" },
    { id: 5, x: 100, y: 180, label: "Heart" },
    { id: 6, x: 100, y: 250, label: "Solar Plexus" },
  ];

  return (
    <div 
      className="relative w-full h-full min-h-[500px] bg-[#0a0a0a] overflow-hidden flex flex-col items-center justify-center font-mono cursor-pointer group"
      onClick={handleToggle}
    >
      {/* Grid Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(6,182,212,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.05)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />
      
      {/* Scanner Bar */}
      <AnimatePresence>
        {isScanned && (
          <motion.div
            initial={{ top: "-10%" }}
            animate={{ top: "110%" }}
            transition={{ duration: 2, ease: "linear" }}
            className="absolute left-0 w-full h-2 bg-gradient-to-r from-transparent via-cyan-400 to-transparent z-20 shadow-[0_0_20px_rgba(6,182,212,0.5)]"
          />
        )}
      </AnimatePresence>

      {/* Main Visual Container */}
      <div className="relative w-[300px] h-[500px] z-10">
        <svg viewBox="0 0 200 400" className="w-full h-full drop-shadow-[0_0_10px_rgba(6,182,212,0.2)]">
          {/* Wireframe Torso */}
          <g className="stroke-slate-700 stroke-[1] fill-none opacity-50">
            {/* Head */}
            <circle cx="100" cy="50" r="30" />
            {/* Neck */}
            <path d="M85 75 L85 90 M115 75 L115 90" />
            {/* Shoulders */}
            <path d="M85 90 L40 110 M115 90 L160 110" />
            {/* Torso Outline */}
            <path d="M40 110 L50 250 L80 350 M160 110 L150 250 L120 350" />
            {/* Spine */}
            <path d="M100 90 L100 350" strokeDasharray="4 4" />
            {/* Ribs */}
            <path d="M60 140 Q100 160 140 140" />
            <path d="M60 170 Q100 190 140 170" />
            <path d="M65 200 Q100 220 135 200" />
          </g>

          {/* State 1: The Imbalance (Red Dots & Jittery Lines) */}
          {!isScanned && (
            <g>
              {nodes.map((node, i) => (
                <motion.circle
                  key={`red-${node.id}`}
                  cx={node.x}
                  cy={node.y}
                  r="4"
                  className="fill-red-500"
                  animate={{ 
                    r: [4, 6, 4],
                    opacity: [0.6, 1, 0.6] 
                  }}
                  transition={{ 
                    duration: 1.5, 
                    repeat: Infinity, 
                    delay: i * 0.2 
                  }}
                />
              ))}
              {/* Jittery connection attempts */}
              <motion.path
                d={`M${nodes[0].x} ${nodes[0].y} L${nodes[2].x} ${nodes[2].y} L${nodes[4].x} ${nodes[4].y}`}
                className="stroke-red-500/30 stroke-[1] fill-none"
                animate={{ pathLength: [0, 0.8, 0], opacity: [0, 0.5, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              />
               <motion.path
                d={`M${nodes[1].x} ${nodes[1].y} L${nodes[3].x} ${nodes[3].y} L${nodes[5].x} ${nodes[5].y}`}
                className="stroke-red-500/30 stroke-[1] fill-none"
                animate={{ pathLength: [0, 0.6, 0], opacity: [0, 0.5, 0] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
              />
            </g>
          )}

          {/* State 2: The Meridian Lock (Green Nodes & Cyan Lines) */}
          {isScanned && (
            <g>
              {/* Connection Lines (The Meridian Channel) */}
              <motion.path
                d={`M${nodes[0].x} ${nodes[0].y} L${nodes[1].x} ${nodes[1].y} L${nodes[4].x} ${nodes[4].y} L${nodes[5].x} ${nodes[5].y}`}
                className="stroke-cyan-400 stroke-[2] fill-none drop-shadow-[0_0_5px_rgba(6,182,212,0.8)]"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1.5, ease: "easeInOut", delay: 0.5 }}
              />
              <motion.path
                 d={`M${nodes[2].x} ${nodes[2].y} L${nodes[4].x} ${nodes[4].y} L${nodes[3].x} ${nodes[3].y}`}
                 className="stroke-cyan-400 stroke-[2] fill-none drop-shadow-[0_0_5px_rgba(6,182,212,0.8)]"
                 initial={{ pathLength: 0 }}
                 animate={{ pathLength: 1 }}
                 transition={{ duration: 1.5, ease: "easeInOut", delay: 1 }}
              />

              {/* Nodes turning Green */}
              {nodes.map((node, i) => (
                <motion.g key={`green-${node.id}`}>
                  <motion.circle
                    cx={node.x}
                    cy={node.y}
                    r="5"
                    className="fill-[#0a0a0a] stroke-green-500 stroke-2"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.5 + (i * 0.1) }}
                  />
                  <motion.circle
                    cx={node.x}
                    cy={node.y}
                    r="2"
                    className="fill-green-400"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 + (i * 0.1) }}
                  />
                </motion.g>
              ))}
            </g>
          )}
        </svg>
      </div>

      {/* HUD Overlay Elements - Moved to outer container */}
      <div className="absolute inset-0 w-full h-full pointer-events-none p-8">
          {/* Top Left Corner */}
          <div className="absolute top-8 left-8 w-8 h-8 border-t-2 border-l-2 border-cyan-500/50" />
          {/* Bottom Right Corner */}
          <div className="absolute bottom-8 right-8 w-8 h-8 border-b-2 border-r-2 border-cyan-500/50" />
          
          {/* Status Text */}
          <div className="absolute top-12 right-12 text-right">
            <div className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">
              {hud.title}
            </div>
            <motion.div 
              key={isScanned ? "structured" : "intake"}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`text-sm font-bold font-mono ${isScanned ? "text-cyan-400" : "text-red-500"}`}
            >
              {hud.status}
            </motion.div>
            <div className="text-[10px] text-slate-500 mt-1">
              {hud.detail}
            </div>
          </div>
      </div>

      {/* Instruction Text */}
      <div className="absolute bottom-8 text-slate-600 text-xs tracking-[0.2em] animate-pulse">
        {hud.prompt}
      </div>
    </div>
  );
};

export default BioDigitalScanner;
