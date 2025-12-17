import Intro from './components/Intro';
import ShenzhenLightShow from './components/ShenzhenLightShow';
import ProblemSolution from './components/ProblemSolution';
import Chatbot from './components/Chatbot';
import ResultsComparison from './components/ResultsComparison';
import DroneSwarm from './components/DroneSwarm';
import { useInView } from './hooks/useInView';

function App() {
  const [introRef] = useInView({ threshold: 0.1 });
  const [problemRef] = useInView({ threshold: 0.1 });
  const [chatbotRef] = useInView({ threshold: 0.1 });
  const [resultsRef, resultsInView] = useInView({ threshold: 0.1 });
  const [lightShowRef, lightShowInView] = useInView({ threshold: 0.1 });
  const [droneRef, droneInView] = useInView({ threshold: 0.1 });

  return (
    <div className="snap-container bg-[#0a0a0a] text-white">
      <div ref={introRef} className="snap-start h-screen w-full">
        <Intro />
      </div>
      <div ref={problemRef} className="snap-start h-screen w-full">
        <ProblemSolution />
      </div>
      <div ref={chatbotRef} className="snap-start h-screen w-full">
        <Chatbot />
      </div>
      <div ref={resultsRef} className="snap-start h-screen w-full">
        <ResultsComparison isActive={resultsInView} />
      </div>
      <div ref={lightShowRef} className="snap-start h-screen w-full">
        <ShenzhenLightShow isActive={lightShowInView} />
      </div>
      <div ref={droneRef} className="snap-start h-screen w-full">
        <DroneSwarm isActive={droneInView} />
      </div>
    </div>
  );
}

export default App;
