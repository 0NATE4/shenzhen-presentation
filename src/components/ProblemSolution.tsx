import { useRef, useState, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import { AlertTriangle, CheckCircle2 } from 'lucide-react';
import BioDigitalScanner from './BioDigitalScanner';

const ProblemSolution = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { amount: 0.3 });
  const [isSolved, setIsSolved] = useState(false);

  // Auto-trigger solution when in view after a delay, or allow manual toggle
  useEffect(() => {
    if (!isInView) {
      setIsSolved(false);
    }
  }, [isInView]);

  return (
    <section ref={ref} className="snap-section flex w-full h-screen bg-[#0a0a0a] overflow-hidden relative">
      
      {/* LEFT SIDE: PROBLEM TEXT */}
      <motion.div 
        className="absolute left-0 top-0 w-1/3 h-full flex flex-col justify-center p-12 z-20 pointer-events-none"
        animate={{ 
          opacity: isSolved ? 0.2 : 1,
          x: isSolved ? -50 : 0
        }}
        transition={{ duration: 0.8 }}
      >
        <div className="max-w-md">
          <div className="mb-6 inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-500/10 text-red-500 border border-red-500/20">
            <AlertTriangle size={32} />
          </div>
          <h2 className="text-3xl font-bold text-red-500 mb-4">Manual Diagnosis</h2>
          <p className="text-lg text-slate-400 leading-relaxed">
            Subjective. Inconsistent. <br/>
            <span className="text-white">High latency</span> in critical windows.
          </p>
        </div>
      </motion.div>

      {/* CENTER: SCANNER VISUAL */}
      <div className="w-full h-full flex items-center justify-center relative z-10">
        <BioDigitalScanner isScanned={isSolved} onToggle={() => setIsSolved(!isSolved)} />
      </div>

      {/* RIGHT SIDE: SOLUTION TEXT */}
      <motion.div 
        className="absolute right-0 top-0 w-1/3 h-full flex flex-col justify-center items-end p-12 z-20 pointer-events-none text-right"
        animate={{ 
          opacity: isSolved ? 1 : 0.2,
          x: isSolved ? 0 : 50
        }}
        transition={{ duration: 0.8 }}
      >
        <div className="max-w-md flex flex-col items-end">
          <div className="mb-6 inline-flex items-center justify-center w-16 h-16 rounded-full bg-cyan-500/10 text-cyan-500 border border-cyan-500/20 shadow-[0_0_20px_rgba(6,182,212,0.3)]">
            <CheckCircle2 size={32} />
          </div>
          <h2 className="text-3xl font-bold text-cyan-400 mb-4">AI Precision</h2>
          <p className="text-lg text-slate-300 leading-relaxed">
            Helps practitioners and patients turn TCM intake into a <span className="text-cyan-400 font-bold">clear, structured summary</span> and draft recommendations for discussion.
          </p>
        </div>
      </motion.div>

    </section>
  );
};

export default ProblemSolution;
