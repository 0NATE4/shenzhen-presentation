import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Bot, User, Sparkles } from 'lucide-react';

const Chatbot = () => {
  const ref = useRef(null);
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [selectedScenario, setSelectedScenario] = useState<number | null>(null);

  const scenarios = [
    {
      id: 1,
      buttonText: "Cold or flu symptoms",
      inputText: "I have cold or flu symptoms.",
      responseText: "Thanks, I can help map this into a TCM style pattern draft. When a cold starts, TCM often frames it as an external factor affecting the Lung. Two common drafts are Wind Cold, which tends to come with chills and clearer mucus, and Wind Heat, which tends to come with a sore throat and yellower mucus. If you tell me which sounds closer, I can point to the more likely direction.",
      keywords: [
        { word: "Wind Cold", color: "text-blue-400 shadow-[0_0_15px_rgba(96,165,250,0.4)]" },
        { word: "Wind Heat", color: "text-orange-400 shadow-[0_0_15px_rgba(251,146,60,0.4)]" }
      ]
    },
    {
      id: 2,
      buttonText: "Digestive issues and fatigue",
      inputText: "I'm experiencing digestive issues and fatigue.",
      responseText: "Got it. In TCM, digestion is closely tied to energy, so symptoms like bloating and tiredness are often organised around the Spleen and Stomach. A common draft is Spleen Qi deficiency, which can look like low energy and looser stools, while another is Dampness, which can feel like heaviness and sluggishness after eating. If you share whether you feel more “tired and weak” or “heavy and boggy”, I can narrow the draft.",
      keywords: [
        { word: "Spleen Qi deficiency", color: "text-yellow-400 shadow-[0_0_15px_rgba(250,204,21,0.4)]" },
        { word: "Dampness", color: "text-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.4)]" }
      ]
    },
    {
      id: 3,
      buttonText: "Pain, tightness, or headaches",
      inputText: "I have pain, tightness, or headaches.",
      responseText: "Thanks, that’s a helpful starting point. In TCM, pain is often described by how Qi and Blood are moving. If it feels like tightness that comes with stress, it often fits a Qi stagnation style draft. If it feels more fixed, sharp, or stubborn in one spot, it can lean closer to Blood stasis. If you tell me whether the pain moves around or stays in one place, I can guide the draft in a clearer direction.",
      keywords: [
        { word: "Qi stagnation", color: "text-purple-400 shadow-[0_0_15px_rgba(192,132,252,0.4)]" },
        { word: "Blood stasis", color: "text-red-400 shadow-[0_0_15px_rgba(248,113,113,0.4)]" }
      ]
    }
  ];

  useEffect(() => {
    if (selectedScenario !== null) {
      setDisplayedText('');
      setIsTyping(true);
      let currentIndex = 0;
      const currentScenario = scenarios.find(s => s.id === selectedScenario);
      
      if (!currentScenario) return;

      const interval = setInterval(() => {
        if (currentIndex <= currentScenario.responseText.length) {
          setDisplayedText(currentScenario.responseText.slice(0, currentIndex));
          currentIndex++;
        } else {
          setIsTyping(false);
          clearInterval(interval);
        }
      }, 20); // Slightly faster typing speed

      return () => clearInterval(interval);
    } else {
      setDisplayedText('');
      setIsTyping(false);
    }
  }, [selectedScenario]);

  // Reset when scrolling out of view? Optional, but let's keep it simple for now.
  // If user wants to reset, they can refresh or we can add a back button later.
  
  const handleScenarioSelect = (id: number) => {
    setSelectedScenario(id);
  };

  const renderText = (text: string, currentKeywords: { word: string, color: string }[]) => {
    let parts = [text];
    
    currentKeywords.forEach(({ word, color }) => {
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

  const currentScenarioData = scenarios.find(s => s.id === selectedScenario);

  return (
    <section ref={ref} className="snap-section flex items-center justify-center bg-[#050505] relative">
      <div className="w-full max-w-3xl p-4">
        
        {/* Chat Interface */}
        <div className="bg-[#0f0f0f] rounded-2xl border border-white/10 p-6 shadow-2xl min-h-[400px] flex flex-col justify-center gap-6">
          
          {!selectedScenario ? (
            <div className="flex flex-col gap-4 w-full max-w-md mx-auto">
              <h3 className="text-xl text-slate-300 text-center mb-4">Select a symptom to analyse:</h3>
              {scenarios.map((scenario) => (
                <motion.button
                  key={scenario.id}
                  whileHover={{ scale: 1.02, backgroundColor: "rgba(255,255,255,0.05)" }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleScenarioSelect(scenario.id)}
                  className="p-4 rounded-xl border border-white/10 bg-white/5 text-left text-slate-200 hover:border-blue-500/50 transition-colors flex items-center justify-between group"
                >
                  <span>{scenario.buttonText}</span>
                  <Sparkles size={16} className="text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                </motion.button>
              ))}
            </div>
          ) : (
            <>
              {/* User Message */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex gap-4 items-start"
              >
                <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center shrink-0">
                  <User size={20} className="text-slate-300" />
                </div>
                <div className="bg-slate-800 rounded-2xl rounded-tl-none p-4 text-slate-200 max-w-[80%]">
                  <p>{currentScenarioData?.inputText}</p>
                </div>
              </motion.div>

              {/* AI Response */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
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
                      {renderText(displayedText, currentScenarioData?.keywords || [])}
                      {isTyping && (
                        <span className="animate-pulse inline-block w-2 h-5 bg-blue-400 ml-1 align-middle" />
                      )}
                    </p>
                  )}
                </div>
              </motion.div>
              
              {/* Reset Button (Optional, for better UX) */}
              {!isTyping && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1 }}
                  className="flex justify-center mt-4"
                >
                  <button 
                    onClick={() => setSelectedScenario(null)}
                    className="text-sm text-slate-500 hover:text-blue-400 transition-colors"
                  >
                    Start over
                  </button>
                </motion.div>
              )}
            </>
          )}

        </div>
      </div>
    </section>
  );
};

export default Chatbot;
