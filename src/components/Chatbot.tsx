import { useState, useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Bot, User, Sparkles } from 'lucide-react';

const Chatbot = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { amount: 0.5, once: false });
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const fullText = "Based on the patient's symptoms of high fever, chest pain, and productive cough, the most likely diagnosis is pneumonia. I recommend starting a treatment plan including antibiotics and rest immediately.";
  
  // Keywords to highlight
  const keywords = [
    { word: "pneumonia", color: "text-green-400 shadow-[0_0_15px_rgba(74,222,128,0.4)]" },
    { word: "treatment plan", color: "text-blue-400 shadow-[0_0_15px_rgba(96,165,250,0.4)]" },
    { word: "antibiotics", color: "text-purple-400 shadow-[0_0_15px_rgba(192,132,252,0.4)]" }
  ];

  useEffect(() => {
    if (isInView) {
      setDisplayedText('');
      setIsTyping(true);
      let currentIndex = 0;
      
      const interval = setInterval(() => {
        if (currentIndex <= fullText.length) {
          setDisplayedText(fullText.slice(0, currentIndex));
          currentIndex++;
        } else {
          setIsTyping(false);
          clearInterval(interval);
        }
      }, 30); // Typing speed

      return () => clearInterval(interval);
    }
  }, [isInView]);

  // Helper to render text with highlights
  const renderText = (text: string) => {
    let parts = [text];
    
    keywords.forEach(({ word, color }) => {
      const newParts: any[] = [];
      parts.forEach(part => {
        if (typeof part === 'string') {
          const split = part.split(word);
          split.forEach((s, i) => {
            newParts.push(s);
            if (i < split.length - 1) {
              newParts.push(
                <motion.span 
                  key={`${word}-${i}`}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className={`font-bold ${color} inline-block px-1 rounded`}
                >
                  {word}
                </motion.span>
              );
            }
          });
        } else {
          newParts.push(part);
        }
      });
      parts = newParts;
    });

    return parts;
  };

  return (
    <section ref={ref} className="snap-section flex items-center justify-center bg-[#050505] relative">
      <div className="w-full max-w-3xl p-4">
        
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm text-slate-400 mb-4">
            <Sparkles size={14} className="text-yellow-400" />
            <span>Live Analysis</span>
          </div>
          <h2 className="text-4xl font-bold text-white">Instant Diagnosis</h2>
        </div>

        {/* Chat Interface */}
        <div className="bg-[#0f0f0f] rounded-2xl border border-white/10 p-6 shadow-2xl min-h-[400px] flex flex-col gap-6">
          
          {/* User Message */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex gap-4 items-start"
          >
            <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center shrink-0">
              <User size={20} className="text-slate-300" />
            </div>
            <div className="bg-slate-800 rounded-2xl rounded-tl-none p-4 text-slate-200 max-w-[80%]">
              <p>Patient presents with high fever (39°C), sharp chest pain when breathing, and coughing up greenish phlegm. What is the diagnosis?</p>
            </div>
          </motion.div>

          {/* AI Response */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            className="flex gap-4 items-start"
          >
            <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center shrink-0 shadow-[0_0_20px_rgba(37,99,235,0.5)]">
              <Bot size={20} className="text-white" />
            </div>
            <div className="bg-blue-900/20 border border-blue-500/20 rounded-2xl rounded-tl-none p-6 text-slate-200 max-w-[90%] w-full min-h-[120px]">
              {isTyping && displayedText.length === 0 ? (
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" />
                  <span className="w-2 h-2 bg-blue-400 rounded-full animate-bounce delay-75" />
                  <span className="w-2 h-2 bg-blue-400 rounded-full animate-bounce delay-150" />
                </div>
              ) : (
                <p className="text-lg leading-relaxed">
                  {renderText(displayedText)}
                  <span className="animate-pulse inline-block w-2 h-5 bg-blue-400 ml-1 align-middle" />
                </p>
              )}
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default Chatbot;
