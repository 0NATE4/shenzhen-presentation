import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { AlertTriangle, CheckCircle2 } from 'lucide-react';

const ProblemSolution = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { amount: 0.5 });

  return (
    <section ref={ref} className="snap-section flex w-full bg-[#0a0a0a] overflow-hidden relative">
      
      {/* LEFT SIDE: PROBLEM */}
      <motion.div 
        className="w-1/2 h-full flex flex-col items-center justify-center p-12 border-r border-white/5 relative z-10"
        animate={{ 
          filter: isInView ? "blur(8px)" : "blur(0px)",
          opacity: isInView ? 0.4 : 1,
          scale: isInView ? 0.95 : 1
        }}
        transition={{ duration: 0.8, ease: "easeInOut" }}
      >
        <div className="max-w-md text-center">
          <div className="mb-6 inline-flex items-center justify-center w-20 h-20 rounded-full bg-red-500/10 text-red-500 border border-red-500/20">
            <AlertTriangle size={40} />
          </div>
          <h2 className="text-4xl font-bold text-red-500 mb-4">Manual Diagnosis</h2>
          <p className="text-xl text-slate-400 leading-relaxed">
            Slow, error-prone, and expensive. Doctors spend <span className="text-white font-bold">40%</span> of their time on paperwork.
          </p>
          
          {/* Visual Chaos */}
          <div className="mt-12 grid grid-cols-2 gap-4 opacity-50">
             {[1,2,3,4].map((i) => (
               <div key={i} className="h-24 bg-white/5 rounded-lg border border-white/5 animate-pulse" style={{ animationDelay: `${i * 0.2}s`}} />
             ))}
          </div>
        </div>
      </motion.div>

      {/* RIGHT SIDE: SOLUTION */}
      <motion.div 
        className="w-1/2 h-full flex flex-col items-center justify-center p-12 relative z-20 bg-[#0a0a0a]"
        initial={{ x: 100, opacity: 0 }}
        animate={{ 
          x: isInView ? 0 : 100,
          opacity: isInView ? 1 : 0
        }}
        transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
      >
        {/* Background Glow */}
        <div className="absolute inset-0 bg-blue-900/10 radial-gradient-center blur-3xl" />

        <div className="max-w-md text-center relative">
          <div className="mb-6 inline-flex items-center justify-center w-20 h-20 rounded-full bg-blue-500/10 text-blue-500 border border-blue-500/20 shadow-[0_0_30px_rgba(59,130,246,0.3)]">
            <CheckCircle2 size={40} />
          </div>
          <h2 className="text-4xl font-bold text-white mb-4">AI-Powered Precision</h2>
          <p className="text-xl text-slate-300 leading-relaxed">
            Instant analysis. <span className="text-blue-400 font-bold">99.8%</span> accuracy. 
            Freeing doctors to focus on patients, not paperwork.
          </p>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="mt-8 px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-full font-bold shadow-lg shadow-blue-600/20 transition-all"
          >
            See How It Works
          </motion.button>
        </div>
      </motion.div>

    </section>
  );
};

export default ProblemSolution;
